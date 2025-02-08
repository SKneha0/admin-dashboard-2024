'use client'

import { client } from "@/sanity/lib/client"
import { useState, useEffect } from "react"
import Image from "next/image"

interface EditProductFormProps {
  productId: string
  onProductUpdated: () => void
}

const EditProductForm: React.FC<EditProductFormProps> = ({ productId, onProductUpdated }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("active")
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const result = await client.fetch(
        `*[_type == "product" && _id == $productId][0]{
          _id,
          title,
          price,
          description,
          status,
          image{
            asset->{_id, url}
          }
        }`,
        { productId }
      )
      
      if (result) {
        setName(result.name)
        setPrice(result.price.toString())
        setDescription(result.description)
        setStatus(result.status)
        if (result.image?.asset?.url) {
          setPreviewUrl(result.image.asset.url)
        }
      }
    }
    
    fetchProduct()
  }, [productId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let imageAsset
      if (image) {
        imageAsset = await client.assets.upload("image", image)
      }

      const updatedProduct = {
        _id: productId,
        _type: "product",
        name,
        price: Number.parseFloat(price),
        description,
        status,
        ...(imageAsset && { image: { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } } }),
      }

      const result = await client.patch(productId).set(updatedProduct).commit()
      console.log("Product updated:", result)
      onProductUpdated()
    } catch (err) {
      console.error("Error updating product:", err)
      if (err instanceof Error) {
        setError(`Failed to update product: ${err.message}`)
      } else {
        setError("Failed to update product: An unknown error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Same form fields as AddProductForm, pre-filled with current product data */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>
      {previewUrl && (
        <div className="mt-2">
          <Image
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            width={200}
            height={200}
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update Product"}
      </button>
    </form>
  )
}

export default EditProductForm