import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { UserModel } from '../models/User.model.js';
import { CategoryModel } from '../models/Category.model.js';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { VoucherModel } from '../models/Voucher.model.js';
import { BannerModel } from '../models/Banner.model.js';
import { generateId } from '../utils/generateId.js';

const SEED_CATEGORIES = [
  {
    s_ID: 'sofa-giuong-thong-minh',
    slug: 'sofa-giuong-thong-minh',
    s_Name: 'Sofa Giường Thông Minh',
    description: 'Sofa giường thông minh (Sofa bed) gấp gọn tiện lợi, tối ưu không gian cho căn hộ nhỏ. Chất liệu nỉ, da cao cấp nhập khẩu.',
    image_url: '',
    item_count: 45,
  },
  {
    s_ID: 'ban-an-thong-minh',
    slug: 'ban-an-thong-minh',
    s_Name: 'Bàn Ăn Thông Minh',
    description: 'Bàn ăn thông minh gấp gọn, mở rộng, tích hợp bếp từ, thiết kế hiện đại sang trọng từ Phê Decor.',
    image_url: '',
    item_count: 60,
  },
  {
    s_ID: 'tu-giay-thong-minh',
    slug: 'tu-giay-thong-minh',
    s_Name: 'Tủ Giày Thông Minh',
    description: 'Tủ giày thông minh siêu mỏng, sức chứa lớn, tích hợp ghế ngồi khử mùi diệt khuẩn.',
    image_url: '',
    item_count: 32,
  },
  {
    s_ID: 'ban-tra-thong-minh',
    slug: 'ban-tra-thong-minh',
    s_Name: 'Bàn Trà Thông Minh',
    description: 'Bàn trà thông minh nâng hạ kết hợp bàn làm việc, tích hợp ngăn kéo chứa đồ tiện ích.',
    image_url: '',
    item_count: 25,
  },
  {
    s_ID: 'giuong-ngu-thong-minh',
    slug: 'giuong-ngu-thong-minh',
    s_Name: 'Giường Ngủ Thông Minh',
    description: 'Giường ngủ thông minh tích hợp tủ quần áo, ngăn kéo, giường gấp tường tiết kiệm diện tích tối đa.',
    image_url: '',
    item_count: 18,
  },
  {
    s_ID: 'ban-lam-viec-thong-minh',
    slug: 'ban-lam-viec-thong-minh',
    s_Name: 'Bàn Làm Việc Thông Minh',
    description: 'Bàn làm việc thông minh nâng hạ chiều cao, chống gù chống cận, thiết kế công thái học.',
    image_url: '',
    item_count: 20,
  },
  {
    s_ID: 'den-trang-tri',
    slug: 'den-trang-tri',
    s_Name: 'Đèn Trang Trí',
    description: 'Đèn chùm phòng khách, đèn thả bàn ăn, đèn ngủ nhập khẩu Bắc Âu hiện đại.',
    image_url: '',
    item_count: 120,
  }
];

const SEED_PRODUCTS = [
  // --- SOFA GIƯỜNG ---
  {
    s_ID: 'prod-sofa-1',
    s_Product_ID: 'prod-sofa-1',
    s_Name: 'Sofa Giường Thông Minh Cao Cấp - SFG21',
    slug: 'sofa-giuong-thong-minh-cao-cap-sfg21',
    category_id: 'sofa-giuong-thong-minh',
    category_name: 'Sofa Giường Thông Minh',
    price: 8500000,
    original_price: 11000000,
    discount_percent: 22,
    avg_rating: 4.8,
    review_count: 120,
    in_stock: true,
    stock_quantity: 15,
    is_featured: true,
    is_best_seller: true,
    images: [],
    dimensions: 'Gấp gọn: 1.5m x 0.85m | Mở ra: 1.5m x 1.9m',
    material: 'Khung gỗ sồi, Đệm mút K43, Vải nỉ Hàn Quốc',
    color_options: ['Xám nhạt', 'Xanh lam', 'Be'],
    origin: 'Nhập khẩu nguyên chiếc',
    warranty: '24 tháng',
    sku: 'SFG21',
    description: 'Sofa giường thông minh SFG21 là giải pháp hoàn hảo cho căn hộ diện tích nhỏ. Chỉ với thao tác kéo đẩy nhẹ nhàng 3s, chiếc sofa phòng khách sẽ biến thành một chiếc giường ngủ êm ái rộng rãi. Tích hợp ngăn chứa đồ siêu rộng bên dưới.',
    specifications: {
      'Khung': 'Gỗ sồi kết hợp thép sơn tĩnh điện chống gỉ',
      'Chất liệu bọc': 'Vải nỉ chống thấm nước, dễ dàng vệ sinh',
      'Tính năng': 'Sofa + Giường ngủ + Hộc chứa đồ',
    },
  },
  {
    s_ID: 'prod-sofa-2',
    s_Product_ID: 'prod-sofa-2',
    s_Name: 'Sofa Giường Gấp Gọn Khung Thép - SFG18',
    slug: 'sofa-giuong-gap-gon-khung-thep-sfg18',
    category_id: 'sofa-giuong-thong-minh',
    category_name: 'Sofa Giường Thông Minh',
    price: 6200000,
    original_price: 7500000,
    discount_percent: 17,
    avg_rating: 4.6,
    review_count: 85,
    in_stock: true,
    stock_quantity: 20,
    is_featured: false,
    is_best_seller: false,
    images: [],
    dimensions: '1.2m x 1.9m',
    material: 'Khung thép chịu lực, đệm mút D40',
    color_options: ['Ghi đậm', 'Xanh cổ vịt'],
    origin: 'Phê Decor',
    warranty: '12 tháng',
    sku: 'SFG18',
    description: 'Thiết kế tối giản mang phong cách Bắc Âu. Sofa giường SFG18 với hệ khung thép siêu bền, chịu tải tới 300kg. Lớp đệm mút cao su nhân tạo mang lại cảm giác thoải mái khi ngồi lẫn nằm.',
    specifications: {
      'Khung': 'Thép carbon không gỉ',
      'Đệm': 'Mút D40 đàn hồi cao',
    },
  },

  // --- BÀN ĂN THÔNG MINH ---
  {
    s_ID: 'prod-banan-1',
    s_Product_ID: 'prod-banan-1',
    s_Name: 'Bàn Ăn Thông Minh Kéo Dài Mặt Gốm Ceramic - BA01',
    slug: 'ban-an-thong-minh-keo-dai-mat-gom-ceramic-ba01',
    category_id: 'ban-an-thong-minh',
    category_name: 'Bàn Ăn Thông Minh',
    price: 12500000,
    original_price: 15500000,
    discount_percent: 19,
    avg_rating: 4.9,
    review_count: 245,
    in_stock: true,
    stock_quantity: 10,
    is_featured: true,
    is_best_seller: true,
    images: [],
    dimensions: 'Thu gọn: 1.1m | Kéo dài: 1.4m',
    material: 'Mặt Ceramic chống xước, Khung gỗ cao su',
    color_options: ['Trắng vân mây', 'Đen nhám', 'Ghi sáng'],
    origin: 'Nhập khẩu Đài Loan',
    warranty: '24 tháng',
    sku: 'BA01',
    description: 'Bàn ăn thông minh BA01 có khả năng thu gọn - kéo dài linh hoạt từ 4 - 6 người ngồi. Mặt bàn bằng chất liệu gốm Ceramic cao cấp chịu nhiệt độ cao, chống xước dăm, chống ố, dễ dàng lau chùi dầu mỡ. Ray trượt nhập khẩu êm ái.',
    specifications: {
      'Mặt bàn': 'Ceramic 12mm chịu lực',
      'Chân bàn': 'Gỗ cao su tự nhiên phủ PU',
      'Sức chứa': 'Tối đa 6-8 người',
    },
  },
  {
    s_ID: 'prod-banan-2',
    s_Product_ID: 'prod-banan-2',
    s_Name: 'Bàn Ăn Gấp Gọn Kèm Bếp Từ - BA08',
    slug: 'ban-an-gap-gon-kem-bep-tu-ba08',
    category_id: 'ban-an-thong-minh',
    category_name: 'Bàn Ăn Thông Minh',
    price: 7900000,
    original_price: 9500000,
    discount_percent: 16,
    avg_rating: 4.7,
    review_count: 112,
    in_stock: true,
    stock_quantity: 8,
    is_featured: true,
    is_best_seller: false,
    images: [],
    dimensions: 'Mở rộng: 1.4m | Gấp gọn làm tủ: 0.4m',
    material: 'Gỗ MDF lõi xanh chống ẩm phủ Melamine',
    color_options: ['Vân gỗ sồi', 'Trắng kết hợp vân gỗ'],
    origin: 'Phê Decor',
    warranty: '12 tháng',
    sku: 'BA08',
    description: 'Giải pháp tuyệt đỉnh cho chung cư. Bàn ăn tích hợp bếp từ ở giữa thuận tiện cho các bữa lẩu gia đình. Khi không dùng có thể gấp gọn lại thành 1 chiếc tủ trang trí nhỏ gọn.',
    specifications: {
      'Bếp từ': 'Tích hợp bếp 2000W mặt kính',
      'Tính năng': 'Gấp gọn thành tủ, bánh xe di chuyển',
    },
  },

  // --- TỦ GIÀY THÔNG MINH ---
  {
    s_ID: 'prod-tugiay-1',
    s_Product_ID: 'prod-tugiay-1',
    s_Name: 'Tủ Giày Thông Minh Cánh Lật Siêu Mỏng - TG33',
    slug: 'tu-giay-thong-minh-canh-lat-sieu-mong-tg33',
    category_id: 'tu-giay-thong-minh',
    category_name: 'Tủ Giày Thông Minh',
    price: 1850000,
    original_price: 2500000,
    discount_percent: 26,
    avg_rating: 4.8,
    review_count: 320,
    in_stock: true,
    stock_quantity: 30,
    is_featured: false,
    is_best_seller: true,
    images: [],
    dimensions: 'Rộng 100cm x Cao 120cm x Sâu 24cm',
    material: 'Gỗ MDF phủ Melamine chống xước',
    color_options: ['Trắng tinh khôi', 'Vân gỗ đậm'],
    origin: 'Việt Nam',
    warranty: '12 tháng',
    sku: 'TG33',
    description: 'Tủ giày siêu mỏng với độ sâu chỉ 24cm nhưng có sức chứa lên tới 24 đôi giày nhờ thiết kế cánh lật 3 tầng thông minh. Tối ưu không gian lối ra vào cho các căn hộ chung cư chật hẹp.',
    specifications: {
      'Sức chứa': '20 - 24 đôi giày/dép',
      'Độ sâu': 'Chỉ 24cm',
      'Bản lề': 'Bản lề xoay nhựa đúc ABS',
    },
  },

  // --- BÀN TRÀ THÔNG MINH ---
  {
    s_ID: 'prod-bantra-1',
    s_Product_ID: 'prod-bantra-1',
    s_Name: 'Bàn Trà Thông Minh Nâng Hạ Mặt Kính - BT12',
    slug: 'ban-tra-thong-minh-nang-ha-mat-kinh-bt12',
    category_id: 'ban-tra-thong-minh',
    category_name: 'Bàn Trà Thông Minh',
    price: 4500000,
    original_price: 5800000,
    discount_percent: 22,
    avg_rating: 4.7,
    review_count: 56,
    in_stock: true,
    stock_quantity: 12,
    is_featured: true,
    is_best_seller: false,
    images: [],
    dimensions: '1m x 0.5m x Cao(0.4m - 0.65m)',
    material: 'Khung thép, Gỗ công nghiệp, Kính cường lực',
    color_options: ['Đen', 'Trắng'],
    origin: 'Nhập khẩu',
    warranty: '12 tháng',
    sku: 'BT12',
    description: 'Sự kết hợp hoàn hảo giữa bàn trà phòng khách và bàn làm việc. Với hệ thống piston thủy lực, mặt bàn có thể nâng lên cao vừa tầm ngồi sofa để sử dụng laptop hoặc ăn nhẹ. Bên dưới là khoang chứa đồ rộng rãi.',
    specifications: {
      'Mặt bàn': 'Kính cường lực 8ly chịu lực',
      'Cơ chế nâng': 'Piston thủy lực êm ái',
    },
  },

  // --- GIƯỜNG NGỦ THÔNG MINH ---
  {
    s_ID: 'prod-giuong-1',
    s_Product_ID: 'prod-giuong-1',
    s_Name: 'Giường Ngủ Có Ngăn Kéo Thông Minh - GN05',
    slug: 'giuong-ngu-co-ngan-keo-thong-minh-gn05',
    category_id: 'giuong-ngu-thong-minh',
    category_name: 'Giường Ngủ Thông Minh',
    price: 9800000,
    original_price: 12500000,
    discount_percent: 21,
    avg_rating: 4.9,
    review_count: 78,
    in_stock: true,
    stock_quantity: 5,
    is_featured: true,
    is_best_seller: true,
    images: [],
    dimensions: '1.6m x 2.0m hoặc 1.8m x 2.0m',
    material: 'Gỗ MDF xanh chống ẩm cốt Thái, Bọc nỉ nhung',
    color_options: ['Be', 'Xanh rêu', 'Ghi xám'],
    origin: 'Việt Nam',
    warranty: '36 tháng',
    sku: 'GN05',
    description: 'Giường ngủ hiện đại bọc nỉ nhung êm ái, an toàn cho trẻ nhỏ. Bên dưới gầm giường là 4 ngăn kéo lớn đựng chăn ga gối đệm dự phòng cực kỳ tiện lợi, thay thế hoàn toàn cho 1 chiếc tủ phụ.',
    specifications: {
      'Hệ ngăn kéo': '4 ngăn kéo ray trượt bi 3 tầng',
      'Tựa đầu': 'Đệm mút D40 bọc nỉ nhung mềm',
      'Thang giường': 'Thép hộp chịu lực',
    },
  },

  // --- BÀN LÀM VIỆC ---
  {
    s_ID: 'prod-banlv-1',
    s_Product_ID: 'prod-banlv-1',
    s_Name: 'Bàn Làm Việc Nâng Hạ Ergonomic - BLV99',
    slug: 'ban-lam-viec-nang-ha-ergonomic-blv99',
    category_id: 'ban-lam-viec-thong-minh',
    category_name: 'Bàn Làm Việc Thông Minh',
    price: 5900000,
    original_price: 7200000,
    discount_percent: 18,
    avg_rating: 4.8,
    review_count: 140,
    in_stock: true,
    stock_quantity: 25,
    is_featured: true,
    is_best_seller: true,
    images: [],
    dimensions: '1.2m x 0.6m',
    material: 'Mặt gỗ MDF, Khung thép sơn tĩnh điện',
    color_options: ['Khung trắng mặt vân sáng', 'Khung đen mặt vân tối'],
    origin: 'Lắp ráp tại VN, Động cơ nhập khẩu',
    warranty: '24 tháng động cơ',
    sku: 'BLV99',
    description: 'Bảo vệ cột sống của bạn với Bàn làm việc nâng hạ độ cao thông minh. Ghi nhớ 4 vị trí độ cao, dễ dàng thay đổi tư thế đứng - ngồi làm việc linh hoạt, tăng hiệu suất công việc.',
    specifications: {
      'Động cơ': '1 động cơ êm ái, nâng hạ < 50dB',
      'Độ cao điều chỉnh': '70cm - 118cm',
      'Tải trọng': '80kg',
    },
  },

  // --- ĐÈN TRANG TRÍ ---
  {
    s_ID: 'prod-den-1',
    s_Product_ID: 'prod-den-1',
    s_Name: 'Đèn Chùm Pha Lê Phòng Khách Phong Cách Bắc Âu - DC55',
    slug: 'den-chum-pha-le-phong-khach-bac-au-dc55',
    category_id: 'den-trang-tri',
    category_name: 'Đèn Trang Trí',
    price: 3200000,
    original_price: 4500000,
    discount_percent: 28,
    avg_rating: 4.7,
    review_count: 92,
    in_stock: true,
    stock_quantity: 40,
    is_featured: false,
    is_best_seller: false,
    images: [],
    dimensions: 'Đường kính 80cm',
    material: 'Hợp kim mạ vàng, Pha lê K9',
    color_options: ['Vàng Gold'],
    origin: 'Nhập khẩu',
    warranty: '12 tháng',
    sku: 'DC55',
    description: 'Đèn chùm pha lê cao cấp K9 thiết kế lộng lẫy theo phong cách Bắc Âu. Phù hợp trang trí không gian phòng khách, phòng ăn tạo điểm nhấn sang trọng.',
    specifications: {
      'Bóng LED': 'Ánh sáng 3 màu (Trắng/Vàng/Trung tính)',
      'Diện tích chiếu sáng': '15 - 25m2',
    },
  }
];

const SEED_VOUCHERS = [
  {
    s_ID: 'vouch-1',
    code: 'PHEDECOR10',
    name: 'Giảm 10% cho khách mới',
    discount_type: 'percentage' as const,
    discount_value: 10,
    min_order_value: 5000000,
    max_discount: 2000000,
    description: 'Giảm 10% tối đa 2.000.000₫ cho đơn hàng từ 5 triệu',
  },
  {
    s_ID: 'vouch-2',
    code: 'FREESHIPHN',
    name: 'Freeship Nội thành HN',
    discount_type: 'fixed' as const,
    discount_value: 200000,
    min_order_value: 2000000,
    description: 'Miễn phí vận chuyển tận nhà nội thành HN (Giảm 200.000₫)',
  },
  {
    s_ID: 'vouch-3',
    code: 'COMBO2026',
    name: 'Ưu Đãi Sắm Combo',
    discount_type: 'fixed' as const,
    discount_value: 1000000,
    min_order_value: 30000000,
    description: 'Giảm trực tiếp 1.000.000₫ khi mua combo nội thất trên 30 triệu',
  },
];

const SEED_BANNERS = [
  {
    s_ID: 'ban-1',
    title: 'Nội Thất Thông Minh Phê Decor',
    subtitle: 'Giải pháp hoàn hảo mở rộng không gian sống cho gia đình bạn.',
    image_url: '',
    link_url: '/products',
    badge_text: 'BỘ SƯU TẬP 2026',
    type: 'hero' as const,
    sort_order: 1,
    is_active: true,
  },
  {
    s_ID: 'ban-2',
    title: 'Sofa Giường Thông Minh Mẫu Mới',
    subtitle: 'Bừng sáng không gian - Xóa tan chật chội.',
    image_url: '',
    link_url: '/products?categoryId=sofa-giuong-thong-minh',
    badge_text: 'ƯU ĐÃI ĐẾN 30%',
    type: 'hero' as const,
    sort_order: 2,
    is_active: true,
  },
  {
    s_ID: 'trust-1',
    title: 'Miễn Phí Lắp Đặt',
    subtitle: 'Áp dụng cho nội thành HN & HCM',
    image_url: '',
    type: 'trustbar' as const,
    icon_name: 'Tool',
    sort_order: 1,
    is_active: true,
  },
  {
    s_ID: 'trust-2',
    title: 'Bảo Hành Từ 1-3 Năm',
    subtitle: 'Bảo trì trọn đời, phụ kiện chính hãng',
    image_url: '',
    type: 'trustbar' as const,
    icon_name: 'ShieldCheck',
    sort_order: 2,
    is_active: true,
  },
  {
    s_ID: 'trust-3',
    title: 'Chất Lượng Nhập Khẩu',
    subtitle: 'Vật liệu cao cấp, an toàn sức khỏe',
    image_url: '',
    type: 'trustbar' as const,
    icon_name: 'Award',
    sort_order: 3,
    is_active: true,
  },
];

async function seedData() {
  try {
    console.log('🔄 Đang kết nối MongoDB...');
    await connectDB();

    console.log('🧹 Đang dọn dẹp dữ liệu cũ...');
    await Promise.all([
      UserModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      ProductModel.deleteMany({}),
      ProductImageModel.deleteMany({}),
      VoucherModel.deleteMany({}),
      BannerModel.deleteMany({}),
    ]);

    console.log('👤 Đang tạo tài khoản mẫu...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123456', salt);
    const customerPassword = await bcrypt.hash('Customer@123456', salt);

    await UserModel.create([
      {
        s_ID: 'usr-admin',
        s_user: 'admin',
        s_PWD: adminPassword,
        email: 'admin@phedecor.com',
        phone: '0988888888',
        role: 'admin',
        avatar_url: '',
        status: true,
      },
      {
        s_ID: 'usr-customer',
        s_user: 'customer',
        s_PWD: customerPassword,
        email: 'customer@gmail.com',
        phone: '0912345678',
        role: 'customer',
        avatar_url: '',
        status: true,
      },
    ]);

    console.log('📂 Đang nhập danh mục...');
    await CategoryModel.insertMany(SEED_CATEGORIES);

    console.log('📦 Đang nhập sản phẩm & hình ảnh...');
    for (const prod of SEED_PRODUCTS) {
      const { images, ...prodData } = prod;
      await ProductModel.create(prodData);

      if (images && images.length > 0) {
        const imgDocs = images.map((url, idx) => ({
          s_ID: generateId('img'),
          s_product_ID: prod.s_ID,
          image_url: url,
          sort_order: idx,
          is_primary: idx === 0,
        }));
        await ProductImageModel.insertMany(imgDocs);
      }
    }

    console.log('🎟️ Đang nhập voucher...');
    await VoucherModel.insertMany(SEED_VOUCHERS);

    console.log('🖼️ Đang nhập banners...');
    await BannerModel.insertMany(SEED_BANNERS);

    console.log('=============================================');
    console.log('✅ Khởi tạo Seed Data Phê Decor thành công!');
    console.log('👑 Admin: user="admin" / pass="Admin@123456"');
    console.log('🛒 Khách: user="customer" / pass="Customer@123456"');
    console.log('=============================================');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Lỗi khi seed data:', error.message);
    process.exit(1);
  }
}

seedData();
