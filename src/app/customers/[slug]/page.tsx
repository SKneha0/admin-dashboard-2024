import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";

// types.ts (or wherever you store types)
export interface Product {
  quantity: number;
  _id: string;
  price: number;
  title: string;
}

export interface Order {
  _id: string;
  _type: "order";
  customer: {
    _ref: string;
    _type: "reference";
  };
  products: Product[];
  status: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  totalOrders: number;
  details: {
    email: string;
    firstName: string;
    lastName: string;
    phone: number;
      city: string;
      zip: number;
        country: string;
  };
  products: (Product)[]; 
  status: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const customer: Customer = await client.fetch(
    `*[_type == "order" && _id == $slug][0]`,
    { slug }
  );

  if (!customer) {
    notFound();
  }

  console.log('Fetched customer:', customer);  // Debugging log

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customer Details</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
               <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {customer.details.firstName} {customer.details.lastName}
              </h2>
              <span className={getStatusColor(customer.status)}>
                {customer.status || "No Status"}
              </span>
            </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and order information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.details.firstName} {customer.details.lastName}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.details.email}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Zip Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.details.zip}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.details.country}
              </dd>
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.details.city}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.details.phone}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total orders</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.products.filter(Boolean).length}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Order Status</dt>
              <dd
                className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ${getStatusColor(
                  customer.status
                )}`}
              >
                {customer.status || "No Status"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Display Products in Orders */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ordered Products</h2>
        <div className="space-y-4">
          {customer.products
            .filter((product): product is Product => product !== null && product !== undefined) // Type guard to filter out null/undefined
            .map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">ID : {product._id}</p>
                <p className="text-sm text-gray-500">Name: {product.title}</p>
                <p className="text-sm text-gray-500">Price: ${product.price}</p>
                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}