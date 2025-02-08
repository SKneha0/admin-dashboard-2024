import { client } from "@/sanity/lib/client"
import AddProductForm from "./AddProductForm"
import ProductList from "./productslist"

export interface Product {
  _id: string
  title: string
  price: number
  description?: string
  image?: {
    asset: {
      url: string
    }
  }
}

async function fetchProducts(): Promise<Product[]> {
  return client.fetch(`*[_type == "product"]`, {}, {cache: 'no-store'})
}

export default async function ProductsContent() {
  const products = await fetchProducts()

  return (
    <div className="space-y-6">
      <AddProductForm />
      <ProductList initialProducts={products} />
    </div>
  )
}
