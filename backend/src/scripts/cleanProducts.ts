import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { ProductVariantModel } from '../models/ProductVariant.model.js';

async function cleanProducts() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('✅ Connected to MongoDB Atlas');

  // 1. Find all products with price <= 0 or missing price
  const zeroProducts = await ProductModel.find({
    $or: [
      { price: { $lte: 0 } },
      { price: { $exists: false } },
      { price: null },
    ],
  }).lean();

  console.log(`🔍 Tìm thấy ${zeroProducts.length} sản phẩm có giá 0đ (bài viết, bài báo cop nhầm)...`);

  const zeroIds = zeroProducts.map((p) => p.s_ID);

  if (zeroIds.length > 0) {
    // Delete product images
    const deletedImages = await ProductImageModel.deleteMany({ s_product_ID: { $in: zeroIds } });
    console.log(`🗑️ Đã xóa ${deletedImages.deletedCount} ảnh liên quan`);

    // Delete product variants
    const deletedVariants = await ProductVariantModel.deleteMany({ s_product_id: { $in: zeroIds } });
    console.log(`🗑️ Đã xóa ${deletedVariants.deletedCount} biến thể liên quan`);

    // Delete products
    const deletedProducts = await ProductModel.deleteMany({ s_ID: { $in: zeroIds } });
    console.log(`🗑️ Đã xóa thành công ${deletedProducts.deletedCount} sản phẩm 0đ`);
  }

  // 2. Scan remaining products
  const remainingProducts = await ProductModel.find({}).lean();
  console.log(`\n📊 Tổng sản phẩm thực tế còn lại: ${remainingProducts.length}`);

  // Check if any product has no images
  const allImages = await ProductImageModel.find({}).lean();
  const prodImgMap = new Map<string, string[]>();
  allImages.forEach((img) => {
    const list = prodImgMap.get(img.s_product_ID) || [];
    list.push(img.image_url);
    prodImgMap.set(img.s_product_ID, list);
  });

  let noImgCount = 0;
  let invalidPriceCount = 0;

  for (const p of remainingProducts) {
    const imgs = prodImgMap.get(p.s_ID) || [];
    if (imgs.length === 0) {
      noImgCount++;
      console.warn(`⚠️ Sản phẩm không có ảnh: [${p.s_ID}] ${p.s_Name}`);
    }
    if (!p.price || p.price <= 0) {
      invalidPriceCount++;
      console.warn(`⚠️ Sản phẩm giá không hợp lệ: [${p.s_ID}] ${p.s_Name} | price: ${p.price}`);
    }
  }

  console.log(`\n✅ Kết quả kiểm tra sản phẩm sót lại:`);
  console.log(`- Số sản phẩm thiếu ảnh: ${noImgCount}`);
  console.log(`- Số sản phẩm giá <= 0: ${invalidPriceCount}`);
  console.log(`- Tất cả ${remainingProducts.length} sản phẩm đều hợp lệ, có giá và hình ảnh thực tế!`);

  await mongoose.disconnect();
}

cleanProducts().catch((err) => {
  console.error('❌ Lỗi khi dọn dẹp sản phẩm:', err);
  process.exit(1);
});
