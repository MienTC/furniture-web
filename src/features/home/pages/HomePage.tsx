import React from 'react';
import { productService } from '~/services/productService';
import { HeroCarousel } from '../components/HeroCarousel';
import { VoucherSection } from '../components/VoucherSection';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { FlashSaleSection } from '../components/FlashSaleSection';
import { QualityCommitmentBanner } from '../components/QualityCommitmentBanner';
import { BestSellersSection } from '../components/BestSellersSection';

export const HomePage: React.FC = () => {
  const allProducts = productService.getProducts();
  const featuredProducts = productService.getProducts({ sortBy: 'featured' }).slice(0, 6);
  const bestSellers = productService.getProducts({ sortBy: 'rating' }).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Banner Carousel with White BG & Red text CTA buttons */}
      <HeroCarousel />

      {/* 2. Promo Vouchers Bar */}
      <VoucherSection />

      {/* 3. Living Space Category Showcase */}
      <CategoryShowcase />

      {/* 4. Flash Sale & Featured Furniture */}
      <FlashSaleSection 
        products={featuredProducts} 
        totalProductsCount={allProducts.length} 
      />

      {/* 5. Quality Commitment Showcase Banner */}
      <QualityCommitmentBanner />

      {/* 6. Top Best Sellers Section */}
      <BestSellersSection products={bestSellers} />
    </div>
  );
};
