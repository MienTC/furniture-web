import React, { useState, useEffect, useMemo } from 'react';
import { Select, Input, Tag, Spin } from 'antd';
import {
  IconLink,
  IconExternalLink,
  IconFlame,
  IconShoppingBag,
  IconCategory,
  IconArmchair,
  IconCheck,
} from '@tabler/icons-react';
import { useCategories } from '~/features/products/hooks/useCategory';
import { ProductService } from '~/services/v1/product.service';
import { formatVND } from '~/common/utils/formatters';
import type { Product } from '~/types';

const productService = new ProductService();

interface BannerLinkPickerProps {
  value?: string;
  onChange: (val: string) => void;
}

type LinkType = 'all' | 'flashsale' | 'category' | 'product' | 'custom' | 'none';

interface ProductOptionItem {
  value: string;
  label: string;
  image?: string;
  price?: number;
  categoryName?: string;
}

export const BannerLinkPicker: React.FC<BannerLinkPickerProps> = ({
  value = '',
  onChange,
}) => {
  const { categories, isCategoriesLoading } = useCategories();

  const [linkType, setLinkType] = useState<LinkType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  // Danh sách sản phẩm gợi ý và tìm kiếm
  const [productOptions, setProductOptions] = useState<ProductOptionItem[]>([]);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);

  // Phân tích và tự động nhận diện giá trị hiện tại (Reverse Detection)
  useEffect(() => {
    if (!value || value.trim() === '') {
      setLinkType('none');
      return;
    }

    const trimmed = value.trim();

    if (trimmed === '/products') {
      setLinkType('all');
    } else if (trimmed === '/products?flashsale=true' || trimmed.includes('flashsale=true')) {
      setLinkType('flashsale');
    } else if (trimmed.startsWith('/products?category=')) {
      setLinkType('category');
      const catId = trimmed.replace('/products?category=', '').split('&')[0];
      setSelectedCategory(catId);
    } else if (trimmed.startsWith('/products/')) {
      setLinkType('product');
      const slug = trimmed.replace('/products/', '').split('?')[0];
      setSelectedProduct(slug);
    } else {
      setLinkType('custom');
      setCustomUrl(trimmed);
    }
  }, [value]);

  // Load danh sách sản phẩm gợi ý ban đầu
  useEffect(() => {
    if (linkType === 'product' && productOptions.length === 0) {
      setIsSearchingProduct(true);
      productService
        .fetchProducts({ limit: 16 })
        .then((res) => {
          const opts = (res.products || []).map((p: Product) => ({
            value: p.slug || p.id,
            label: p.name,
            image: p.images?.[0],
            price: p.price,
            categoryName: p.categoryName,
          }));
          setProductOptions(opts);
        })
        .catch(() => {})
        .finally(() => setIsSearchingProduct(false));
    }
  }, [linkType, productOptions.length]);

  // Tự động load thông tin sản phẩm đã chọn nếu chưa có trong danh sách
  useEffect(() => {
    if (selectedProduct && !productOptions.some((p) => p.value === selectedProduct)) {
      productService
        .fetchProductBySlug(selectedProduct)
        .then((p: Product) => {
          if (p) {
            setProductOptions((prev) => [
              {
                value: p.slug || p.id,
                label: p.name,
                image: p.images?.[0],
                price: p.price,
                categoryName: p.categoryName,
              },
              ...prev,
            ]);
          }
        })
        .catch(() => {});
    }
  }, [selectedProduct, productOptions]);

  // Tìm kiếm sản phẩm khi người dùng gõ
  const handleSearchProduct = async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setIsSearchingProduct(true);
    try {
      const res = await productService.fetchProducts({ search: query.trim(), limit: 16 });
      const opts = (res.products || []).map((p: Product) => ({
        value: p.slug || p.id,
        label: p.name,
        image: p.images?.[0],
        price: p.price,
        categoryName: p.categoryName,
      }));
      setProductOptions(opts);
    } catch {
      // bỏ qua lỗi
    } finally {
      setIsSearchingProduct(false);
    }
  };

  // Handler khi thay đổi Loại liên kết
  const handleTypeChange = (newType: LinkType) => {
    setLinkType(newType);

    if (newType === 'none') {
      onChange('');
    } else if (newType === 'all') {
      onChange('/products');
    } else if (newType === 'flashsale') {
      onChange('/products?flashsale=true');
    } else if (newType === 'category') {
      if (selectedCategory) {
        onChange(`/products?category=${selectedCategory}`);
      } else if (categories.length > 0) {
        const firstCat = categories[0].id;
        setSelectedCategory(firstCat);
        onChange(`/products?category=${firstCat}`);
      }
    } else if (newType === 'product') {
      if (selectedProduct) {
        onChange(`/products/${selectedProduct}`);
      } else if (productOptions.length > 0) {
        const firstProd = productOptions[0].value;
        setSelectedProduct(firstProd);
        onChange(`/products/${firstProd}`);
      }
    } else if (newType === 'custom') {
      onChange(customUrl || '');
    }
  };

  // Handler chọn danh mục
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    onChange(`/products?category=${catId}`);
  };

  // Handler chọn sản phẩm
  const handleSelectProduct = (prodSlug: string) => {
    setSelectedProduct(prodSlug);
    onChange(`/products/${prodSlug}`);
  };

  // Handler nhập link tùy chỉnh
  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomUrl(val);
    onChange(val);
  };

  // Sản phẩm hiện tại đang được chọn (để hiển thị ảnh preview)
  const selectedProductInfo = useMemo(() => {
    return productOptions.find((p) => p.value === selectedProduct);
  }, [productOptions, selectedProduct]);

  // Tên hiển thị thân thiện của đích đến hiện tại
  const humanReadableTarget = useMemo(() => {
    if (!value) return 'Không có liên kết (Banner tĩnh)';
    if (value === '/products') return 'Toàn bộ sản phẩm cửa hàng (/products)';
    if (value.includes('flashsale=true')) return 'Trang Flash Sale khuyến mãi (/products?flashsale=true)';
    if (value.startsWith('/products?category=')) {
      const catId = value.replace('/products?category=', '').split('&')[0];
      const found = categories.find((c) => c.id === catId || c.slug === catId);
      return `Danh mục: ${found ? found.name : catId} (${value})`;
    }
    if (value.startsWith('/products/')) {
      const slug = value.replace('/products/', '');
      const prod = productOptions.find((p) => p.value === slug);
      return prod ? `Sản phẩm: ${prod.label}` : `Chi tiết sản phẩm: ${slug}`;
    }
    return `Liên kết tùy chỉnh: ${value}`;
  }, [value, categories, productOptions]);

  return (
    <div className="space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Dropdown 1: Phân loại đích đến */}
        <div className="w-full sm:w-56 shrink-0">
          <Select
            value={linkType}
            onChange={handleTypeChange}
            className="w-full !h-10"
            options={[
              { value: 'all', label: '🛍️ Toàn bộ sản phẩm' },
              { value: 'flashsale', label: '⚡ Trang Flash Sale' },
              { value: 'category', label: '📂 Theo Danh mục sản phẩm' },
              { value: 'product', label: '🛋️ Theo Sản phẩm cụ thể' },
              { value: 'custom', label: '🔗 Nhập URL tùy chỉnh' },
              { value: 'none', label: '❌ Không gắn link' },
            ]}
          />
        </div>

        {/* Cấu hình chi tiết theo từng phân loại */}
        <div className="flex-1 min-w-0">
          {linkType === 'all' && (
            <div className="h-10 px-3 rounded-lg bg-stone-100/80 border border-stone-200 flex items-center text-xs text-stone-600 font-medium">
              Tự động dẫn đến trang cửa hàng: <code className="ml-1.5 font-mono text-[#2B5A50] font-bold">/products</code>
            </div>
          )}

          {linkType === 'flashsale' && (
            <div className="h-10 px-3 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center text-xs text-amber-800 font-medium">
              Tự động dẫn đến Flash Sale: <code className="ml-1.5 font-mono text-amber-900 font-bold">/products?flashsale=true</code>
            </div>
          )}

          {/* Chọn Danh mục với hình ảnh & tên */}
          {linkType === 'category' && (
            <Select
              showSearch
              placeholder="Chọn danh mục nội thất..."
              value={selectedCategory || undefined}
              onChange={handleSelectCategory}
              loading={isCategoriesLoading}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              className="w-full !h-10"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
                image: c.image || (c as any).image_url,
                slug: c.slug,
              }))}
              optionRender={(option) => {
                const data = option.data;
                return (
                  <div className="flex items-center gap-2.5 py-1">
                    {data.image ? (
                      <img
                        src={data.image}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover border border-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                        <IconCategory size={16} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-stone-900 truncate m-0 leading-tight">
                        {data.label}
                      </p>
                      <span className="text-[10px] text-stone-400 font-mono block">
                        /{data.slug}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          )}

          {/* Chọn Sản phẩm cụ thể với HÌNH ẢNH TRỰC QUAN, GIÁ TIỀN & TÌM KIẾM */}
          {linkType === 'product' && (
            <Select
              showSearch
              placeholder="🔍 Gõ tên sản phẩm để tìm kiếm và chọn..."
              value={selectedProduct || undefined}
              onChange={handleSelectProduct}
              onSearch={handleSearchProduct}
              filterOption={false}
              notFoundContent={isSearchingProduct ? <div className="p-3 text-center"><Spin size="small" /> Đang tìm...</div> : 'Không tìm thấy sản phẩm'}
              className="w-full !h-10"
              options={productOptions.map((p) => ({
                value: p.value,
                label: p.label,
                image: p.image,
                price: p.price,
                categoryName: p.categoryName,
              }))}
              optionRender={(option) => {
                const data = option.data;
                return (
                  <div className="flex items-center gap-3 py-1.5 border-b border-stone-100/60 last:border-none">
                    {data.image ? (
                      <img
                        src={data.image}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-50"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                        <IconArmchair size={18} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-stone-900 truncate m-0 leading-tight">
                        {data.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-[#2B5A50]">
                          {formatVND(data.price || 0)}
                        </span>
                        {data.categoryName && (
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                            {data.categoryName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          )}

          {linkType === 'custom' && (
            <Input
              value={customUrl}
              onChange={handleCustomUrlChange}
              placeholder="Nhập link bất kỳ: /chinh-sach, https://..."
              className="!h-10 !rounded-lg text-xs"
            />
          )}

          {linkType === 'none' && (
            <div className="h-10 px-3 rounded-lg bg-stone-100 border border-stone-200 flex items-center text-xs text-stone-400">
              Banner chỉ hiển thị ảnh, khi click vào sẽ không chuyển trang
            </div>
          )}
        </div>
      </div>

      {/* Card xem trước sản phẩm đã chọn có ẢNH, TÊN, GIÁ TIỀN rất trực quan */}
      {linkType === 'product' && selectedProductInfo && (
        <div className="flex items-center gap-3.5 p-2.5 bg-[#EDF5F2] border border-[#C5D8D0] rounded-xl transition-all">
          {selectedProductInfo.image ? (
            <img
              src={selectedProductInfo.image}
              alt=""
              className="w-13 h-13 rounded-lg object-cover border border-white shadow-xs shrink-0"
            />
          ) : (
            <div className="w-13 h-13 rounded-lg bg-white flex items-center justify-center text-stone-400 shrink-0 shadow-xs">
              <IconArmchair size={22} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#2B5A50] uppercase tracking-wider">
                Sản phẩm được liên kết
              </span>
              <span className="inline-flex items-center size-3.5 rounded-full bg-[#2B5A50] text-white justify-center text-[9px]">
                <IconCheck size={10} />
              </span>
            </div>
            <p className="font-bold text-xs text-stone-900 truncate m-0 mt-0.5">
              {selectedProductInfo.label}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-black text-[#2B5A50]">
                {formatVND(selectedProductInfo.price || 0)}
              </span>
              {selectedProductInfo.categoryName && (
                <span className="text-[10px] text-stone-600 bg-white px-2 py-0.5 rounded border border-[#D0DBD6]">
                  {selectedProductInfo.categoryName}
                </span>
              )}
            </div>
          </div>
          <Tag color="green" className="!font-bold !text-[11px] !border-[#2B5A50] !text-[#2B5A50] !bg-white shrink-0">
            Đã gắn vào Banner
          </Tag>
        </div>
      )}

      {/* Dãy phím tắt chọn nhanh 1-Click (Quick Presets) */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[11px] text-stone-400 font-medium mr-1">Gợi ý nhanh 1-click:</span>
        <button
          type="button"
          onClick={() => handleTypeChange('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
            value === '/products'
              ? 'bg-[#2B5A50] text-white border-[#2B5A50]'
              : 'bg-white text-stone-700 border-stone-200 hover:border-[#2B5A50] hover:text-[#2B5A50]'
          }`}
        >
          🛍️ Tất cả sản phẩm
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('flashsale')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
            value.includes('flashsale=true')
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-600 hover:text-amber-600'
          }`}
        >
          ⚡ Flash Sale
        </button>

        {/* Top Danh mục chính */}
        {categories.slice(0, 5).map((cat) => {
          const isSelected = value === `/products?category=${cat.id}`;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setLinkType('category');
                handleSelectCategory(cat.id);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2B5A50] text-white border-[#2B5A50]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-[#2B5A50] hover:text-[#2B5A50]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Thanh phản hồi hiển thị đích đến trực quan */}
      <div className="flex items-center justify-between p-2.5 px-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
        <div className="flex items-center gap-2 truncate">
          <IconLink size={16} className="text-[#2B5A50] shrink-0" />
          <span className="font-semibold text-stone-500 shrink-0">Đích đến:</span>
          <span className="font-bold text-[#1A2421] truncate">{humanReadableTarget}</span>
        </div>

        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#2B5A50] hover:underline font-semibold shrink-0 ml-3"
            title="Mở thử liên kết trên tab mới"
          >
            Mở xem thử <IconExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
};

export default BannerLinkPicker;
