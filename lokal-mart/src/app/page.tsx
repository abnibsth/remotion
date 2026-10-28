import Hero from "@/components/hero";
import CategoryShowcase from "@/components/category-showcase";
import FeaturedProducts from "@/components/featured-products";
import StorySection from "@/components/story-section";
import PromoBanner from "@/components/promo-banner";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <StorySection />
      <PromoBanner />
    </main>
  );
}
