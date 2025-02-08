"use client"
import { useState } from "react"
import { client } from "@/sanity/lib/client" 
import type { Product } from "./productscontent"
import ProductItem from "./productsItem"

interface ProductListProps {
  initialProducts: Product[]
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const handleDelete = async (deletedId: string) => {
    try {
      await client.delete(deletedId) 
      setProducts(products.filter((product) => product._id !== deletedId))
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }
  const handleUpdate = async (updatedProduct: Product) => {
    try {
      const result = await client.patch(updatedProduct._id) 
        .set(updatedProduct) 
        .commit() 
      setProducts(products.map((product) => (product._id === updatedProduct._id ? (result as unknown as Product) : product)))
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductItem
          key={product._id}
          product={product}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}