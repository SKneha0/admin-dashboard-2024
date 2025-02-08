import Image from "next/image"

interface Product {
  _id: string
  title: string
  price: number
  description?: string
  status: string[]
  Productimage?: {
    asset: {
      url: string
      _ref: string
    }
  }
}

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    {product.Productimage && product.Productimage.asset && (
      <div className="relative h-48 mb-4">
        <Image
          src={product.Productimage.asset.url || "/placeholder.svg"}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
    )}
    <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
    <p className="text-gray-600 mb-2">{product.description || "No description available"}</p>
    <p className="text-xl font-bold mb-2">${product.price.toFixed(2)}</p>
  </div>
)

export default ProductCard
