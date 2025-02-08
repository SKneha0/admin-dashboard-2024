import type React from "react";
import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Package, ShoppingCart } from "lucide-react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  productImage: {
    asset: {
      url: string;
      _ref: string;
    };
  };
}

interface OrderDetails {
  phone: string;
  email: string;
  zip: string;
  country: string;
  firstName: string;
  lastName: string;
  city: string;
}

interface Order {
  _type: "order";
  details: OrderDetails;
  _id: string;
  status: string[];
  total: number;
  _updatedAt: string;
  user: string;
  products: (string | null)[];
  _createdAt: string;
  _rev: string;
  slug: {
    current: string;
  };
}

const DashboardContent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uniqueCustomers, setUniqueCustomers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productsQuery = `*[_type == "food"] {
        _id,
        title,
        price,
        description,
        "productImage": image.asset->{url, _ref}
      }`;
      const ordersQuery = `*[_type == "order"] | order(createdAt desc)`;

      const [productsResult, ordersResult] = await Promise.all([
        client.fetch<Product[]>(productsQuery),
        client.fetch<Order[]>(ordersQuery),
      ]);

      setProducts(productsResult || []);
      setOrders(ordersResult || []);

      // Set unique customers
      const customers = new Set(ordersResult.map((order) => order.user));
      setUniqueCustomers(customers);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Calculate Total Revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<DollarSign className="h-8 w-8" />} />
        <StatCard title="Orders" value={orders.length.toString()} icon={<ShoppingCart className="h-8 w-8" />} />
        <StatCard title="Products" value={products.length.toString()} icon={<Package className="h-8 w-8" />} />
        <StatCard title="Customers" value={uniqueCustomers.size.toString()} icon={<CreditCard className="h-8 w-8" />} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Order ID</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Customer ID</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Total</th>
                  <th className="text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    _id={order._id}
                    customer={order.details?.firstName}
                    user={order.user}
                    status={order.status}
                    total={order.total ? `$${order.total.toFixed(2)}` : "N/A"}
                    date={order._createdAt ? new Date(order._createdAt).toLocaleDateString() : "N/A"}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
        </div>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="rounded-full bg-blue-100 p-3 mr-4">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  </div>
);

const OrderRow = ({ _id, customer, user, status, total, date }: { _id: string; user: string; customer: string; status: string[]; total: string; date: string }) => (
  <tr>
    <td className="py-2">{_id}</td>
    <td>{customer}</td>
    <td>{user}</td>
    <td>
      {status ? (
        status.length > 0 ? (
          status.map((statusItem, index) => (
            <span key={index} className={`px-2 py-1 rounded-full text-xs ${getStatusColor(statusItem)}`}>
              {statusItem}
            </span>
          ))
        ) : (
          <span>No status available</span>
        )
      ) : (
        <span>No status</span>
      )}
    </td>
    <td>{total}</td>
    <td>{date}</td>
  </tr>
);

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
    {product.productImage && product.productImage.asset && (
      <div className="relative h-48 mb-4">
        <Image
          src={urlFor(product.productImage).url()}
          alt={product.title}
          className="rounded-t-lg"
          layout="fill"
          objectFit="cover"
        />
      </div>
    )}
    <p className="text-gray-600 mb-2 line-clamp-2">{product.description || "No description available"}</p>
    <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
  </div>
);

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

export default DashboardContent;