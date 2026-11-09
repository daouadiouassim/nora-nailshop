import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import BenefitsRow from "@/components/home/BenefitsRow";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CustomPromo from "@/components/home/CustomPromo";
import HowToOrder from "@/components/home/HowToOrder";
import SocialSection from "@/components/home/SocialSection";
import FinalCTA from "@/components/home/FinalCTA";
import { fetchCategories, fetchFeaturedProducts } from "@/lib/catalog";
import { SAMPLE_PRODUCTS } from "@/data/sampleCatalog";

export default function Home() {
  const { settings } = useOutletContext() || {};
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    document.title = "Nora Nailshop | Custom Press-On Nails in Algeria";
  }, []);

  useEffect(() => {
    let active = true;
    fetchFeaturedProducts(6)
      .then((rows) => {
        if (active && rows.length > 0) setProducts(rows);
      })
      .catch(() => {});
    fetchCategories()
      .then((rows) => {
        if (active) setCategories(rows);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <HeroSection settings={settings} />
      <BenefitsRow />
      <FeaturedCollections categories={categories} />
      <FeaturedProducts products={products} />
      <CustomPromo />
      <HowToOrder />
      <SocialSection settings={settings} />
      <FinalCTA />
    </>
  );
}