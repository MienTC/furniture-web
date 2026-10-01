import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { generateId } from '../utils/generateId.js';

dotenv.config();

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || 'lux-decor';
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_URL || '';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Download image from url and upload directly to Cloudflare R2
async function uploadImageToR2(imgUrl: string, productSlug: string, index: number): Promise<string | null> {
  try {
    const response = await axios.get(imgUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] || 'image/jpeg';
    let ext = 'jpg';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';

    const cleanSlug = productSlug.replace(/[^a-z0-9-]/gi, '').substring(0, 40);
    const key = `products/${cleanSlug}-${index}-${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    if (PUBLIC_BASE_URL) {
      const base = PUBLIC_BASE_URL.replace(/\/+$/, '');
      return `${base}/${key}`;
    }

    return key;
  } catch (err: any) {
    console.error(`      ⚠️ Không tải được ảnh ${imgUrl}: ${err.message}`);
    return null;
  }
}

// Scrape images from product detail page
async function scrapeImagesFromPage(productUrl: string): Promise<string[]> {
  try {
    const { data } = await axios.get(productUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    const $ = cheerio.load(data);
    const imgs: string[] = [];

    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
      if (
        src &&
        (src.includes('sudospaces') || src.includes('phedecor')) &&
        !src.includes('logo') &&
        !src.includes('icon') &&
        !src.includes('banner') &&
        !src.includes('deal_tag')
      ) {
        imgs.push(src.startsWith('http') ? src : `https://phedecor.com${src}`);
      }
    });

    return [...new Set(imgs)].slice(0, 5); // Take up to 5 images per product
  } catch (err: any) {
    return [];
  }
}

async function main() {
  console.log('🚀 Bắt đầu cào ảnh & Upload lên Cloudflare R2...');
  await connectDB();

  // Đọc danh sách sản phẩm đã cào trước đó
  if (!fs.existsSync('phedecor_products.json')) {
    console.error('❌ Không tìm thấy file phedecor_products.json!');
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync('phedecor_products.json', 'utf8'));
  const scrapedProducts = rawData.products;

  console.log(`Tìm thấy ${scrapedProducts.length} sản phẩm từ file backup.`);

  // Lấy danh sách sản phẩm trong DB
  const dbProducts = await ProductModel.find({}).lean();
  console.log(`Tìm thấy ${dbProducts.length} sản phẩm trong MongoDB.`);

  // Map link theo tên hoặc sku
  const linkMap = new Map<string, string>();
  scrapedProducts.forEach((p: any) => {
    linkMap.set(p.name.trim().toLowerCase(), p.link);
  });

  let processedCount = 0;

  for (const prod of dbProducts) {
    processedCount++;
    const link = linkMap.get(prod.s_Name.trim().toLowerCase());
    if (!link) continue;

    // Kiểm tra xem sản phẩm đã có ảnh chưa
    const existingImages = await ProductImageModel.countDocuments({ s_product_ID: prod.s_ID });
    if (existingImages > 0) {
      console.log(`[${processedCount}/${dbProducts.length}] Đã có ảnh: ${prod.s_Name}`);
      continue;
    }

    console.log(`\n[${processedCount}/${dbProducts.length}] Đang xử lý: ${prod.s_Name}`);
    const sourceImages = await scrapeImagesFromPage(link);

    if (sourceImages.length === 0) {
      console.log(`   -> Không tìm thấy ảnh trên Phê Decor.`);
      continue;
    }

    console.log(`   -> Tìm thấy ${sourceImages.length} ảnh. Đang upload lên Cloudflare R2...`);
    const uploadedDocs: any[] = [];

    for (let i = 0; i < sourceImages.length; i++) {
      const r2Url = await uploadImageToR2(sourceImages[i], prod.slug, i);
      if (r2Url) {
        uploadedDocs.push({
          s_ID: generateId('img'),
          s_product_ID: prod.s_ID,
          image_url: r2Url,
          alt_text: prod.s_Name,
          sort_order: i,
          is_primary: i === 0,
        });
      }
      await delay(200);
    }

    if (uploadedDocs.length > 0) {
      await ProductImageModel.insertMany(uploadedDocs);
      console.log(`   ✅ Đã lưu ${uploadedDocs.length} ảnh vào MongoDB cho sản phẩm này!`);
    }

    await delay(300);
  }

  console.log('\n🎉🎉🎉 HOÀN THÀNH TẤT CẢ ẢNH LÊN CLOUDFLARE R2 VÀ MONGODB!');
  process.exit(0);
}

main();
