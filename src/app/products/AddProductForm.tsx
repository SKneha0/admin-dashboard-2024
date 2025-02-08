"use client"

import { useState } from "react"
import { client } from "@/sanity/lib/client"
import { useRouter } from "next/navigation"

export default function AddProductForm() {
  const [name, settitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)  // Add loading state
  const [error, setError] = useState("")  // To display any error
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)  // Set loading state
    setError("")  // Reset error

    try {
      await client.create({
        _type: "product",
        name,
        price: Number.parseFloat(price),
        description,
      })
      // Reset form fields after submission
      settitle("")
      setPrice("")
      setDescription("")

      // Optionally, you can refresh the page or navigate
      router.push("/products")  // Navigate to a list page, for example

    } catch (error) {
      console.error("Error adding product:", error)
      setError("Failed to add product. Please try again.")  // Display error
    } finally {
      setIsSubmitting(false)  // Reset loading state
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => settitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          step="0.01"
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}  {/* Error Message */}
      <button
        type="submit"
        disabled={isSubmitting}  // Disable button while submitting
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  )
}