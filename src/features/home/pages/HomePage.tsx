import React from 'react';
import { HeroBanner } from '~/features/home/components/HeroBanner';
import { VoucherSection } from '~/features/home/components/VoucherSection';
import { CategoryGrid } from '~/features/home/components/CategoryGrid';
import { FeaturedProducts } from '~/features/home/components/FeaturedProducts';
import { ShowcaseSection } from '~/features/home/components/ShowcaseSection';
import { useBanners, useShowcase } from '~/features/home/hooks/useBanner';
import { useVouchers } from '~/features/vouchers/hooks/useVoucher';
import { useProducts } from '~/features/products/hooks/useProduct';
import { useCategories } from '~/features/products/hooks/useCategory';

export const HomePage: React.FC = () => {
  const { banners, isBannersLoading }             = useBanners();
  const { vouchers, isVouchersLoading }           = useVouchers();
  const { categories, isCategoriesLoading }       = useCategories();
  const { products: featured, isProductsLoading } = useProducts({ sortBy: 'featured' });
  const { products: all }                         = useProducts();
  const { showcase }                              = useShowcase();

  return (
    <div className="space-y-16 pb-16">
      <HeroBanner banners={banners} isLoading={isBannersLoading} />
      <VoucherSection vouchers={vouchers} isLoading={isVouchersLoading} />
      <CategoryGrid categories={categories} isLoading={isCategoriesLoading} />
      <FeaturedProducts products={featured} totalCount={all.length} isLoading={isProductsLoading} />
      {showcase && <ShowcaseSection showcase={showcase} />}
    </div>
  );
};
