// // _app.tsx (or App.tsx for Next.js)
// import ClientWrapper from './ClientWrapper'  // Adjust import as needed

// export default function App() {
//   return <ClientWrapper />
// }

import Link from "next/link"
import { client } from "@/sanity/lib/client"

interface OrderDetails {
  phone: string
  email: string
  zip: string
  country: string
  firstName: string
  lastName: string
  city: string
}

interface Order {
  _type: "order"
  details: OrderDetails
  _id: string
  _updatedAt: string
  user: string
  products: (string | null)[]
  _createdAt: string
  _rev: string
  slug: {
    current: string
  }
}

export default async function CustomersContent() {
  const response: Order[] = await client.fetch(
    `*[_type == "order"] {
      ...,
      "slug": details.firstName + "-" + details.lastName + "-" + _id
    } | order(_createdAt desc)`,
  )

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left font-semibold">Name</th>
            <th className="py-2 px-4 border-b text-left font-semibold">Email</th>
            <th className="py-2 px-4 border-b text-left font-semibold">Total Orders</th>
            <th className="py-2 px-4 border-b text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {response.map((customer) => (
            <tr key={customer._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {customer.details.firstName} {customer.details.lastName}
              </td>
              <td className="py-2 px-4 border-b">{customer.details.email}</td>
              <td className="py-2 px-4 border-b">{customer.products.length}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/customers/${customer._id}`} className="text-blue-600 hover:text-blue-800 underline">
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
