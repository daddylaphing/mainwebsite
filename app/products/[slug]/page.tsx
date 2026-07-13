import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { ProductDetailPage } from "@/components/product/product-detail-page";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}


// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Laphing Daddy`,
    description: product.short_description || product.description?.substring(0, 160) || `Buy ${product.name} from Laphing Daddy`,
    openGraph: {
      title: product.name,
      description: product.short_description || "",
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
