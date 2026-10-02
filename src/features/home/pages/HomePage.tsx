import React from 'react';
import { HeroBanner } from '~/features/home/components/HeroBanner';
import { VoucherSection } from '~/features/home/components/VoucherSection';
import { CategoryGrid } from '~/features/home/components/CategoryGrid';
import { FeaturedProducts } from '~/features/home/components/FeaturedProducts';
import { ShowcaseSection } from '~/features/home/components/ShowcaseSection';
import { HomeFeatures } from '~/features/home/components/HomeFeatures';
import { TestimonialsSection } from '~/features/home/components/TestimonialsSection';
import { useBanners, useShowcase } from '~/features/home/hooks/useBanner';
import { useVouchers } from '~/features/vouchers/hooks/useVoucher';
import { useProducts } from '~/features/products/hooks/useProduct';
import { useCategories } from '~/features/products/hooks/useCategory';

export const HomePage: React.FC = () => {
  const { banners, isBannersLoading }             = useBanners();
  const { vouchers, isVouchersLoading }           = useVouchers();
  const { categories, isCategoriesLoading }       = useCategories();
  const { products: featured, totalCount, isProductsLoading } = useProducts({ sortBy: 'featured', limit: 8 });
  const { showcase }                              = useShowcase();

  const totalProducts = totalCount || categories.reduce((sum, c) => sum + (c.itemCount || 0), 0) || 668;

  return (
    <div className="space-y-16 pb-16">
      <HeroBanner banners={banners} isLoading={isBannersLoading} />
      <HomeFeatures />
      <VoucherSection vouchers={vouchers} isLoading={isVouchersLoading} />
      <CategoryGrid categories={categories} isLoading={isCategoriesLoading} />
      <FeaturedProducts products={featured} totalCount={totalProducts} isLoading={isProductsLoading} />
      <ShowcaseSection showcase={showcase} />
      <TestimonialsSection />
    </div>
  );
};
