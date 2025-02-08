import React, { useState } from "react"
import type { Product } from "./productscontent"

interface ProductItemProps {
  product: Product
  onDelete: (id: string) => void
  onUpdate: (updatedProduct: Product) => void
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(product.title)
  const [price, setPrice] = useState(product.price.toString())
  const [description, setDescription] = useState(product.description)

  const handleDeleteClick = () => {
    onDelete(product._id)
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveClick = () => {
    const updatedProduct = {
      ...product,
     name,
      price: parseFloat(price),
      description,
    }
    onUpdate(updatedProduct) 
    setIsEditing(false)
  }

  return (
    <div className="p-4 border rounded-md">
      {!isEditing ? (
        <>
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="line-clamp-2">{product.description}</p>
          <p className="font-bold">${product.price}</p>
          <div className="mt-2 flex space-x-2">
            <button onClick={handleEditClick} className="bg-blue-500 text-white px-4 py-2 rounded">
              Edit
            </button>
            <button onClick={handleDeleteClick} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border rounded"
            ></textarea>
          </div>
          <div className="mt-2 flex space-x-2">
            <button onClick={handleSaveClick} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={handleEditClick} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductItem