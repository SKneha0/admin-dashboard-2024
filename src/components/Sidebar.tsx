"use client"; // To enable client-side rendering in Next.js

import Link from "next/link";
import { Home, ShoppingBag, Users, X } from "lucide-react"; // Import X icon from lucide-react
import { useState } from "react"; // Importing React's useState hook for toggling the sidebar

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function for the sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Button to open/close the sidebar on small screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden h-5 text-black p-4"
        aria-label="Toggle Sidebar"
      >
        <span className="text-2xl">&#9776;</span> {/* Hamburger menu icon */}
      </button>

      <div
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform transition-all duration-200 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Button to close the sidebar */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white md:hidden"
          aria-label="Close Sidebar"
        >
          <X className="w-6 h-6" /> {/* Cross icon to close sidebar */}
        </button>

        {/* Logo */}
        <Link href="/" className="text-white flex items-center space-x-2 px-4">
          <ShoppingBag className="w-8 h-8" />
          <span className="text-2xl font-extrabold">Admin</span>
        </Link>
        <nav>
          <Link
            href="/"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <Home className="inline-block mr-2 w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/products"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <ShoppingBag className="inline-block mr-2 w-5 h-5" /> Products
          </Link>
          <Link
            href="/customer"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <Users className="inline-block mr-2 w-5 h-5" /> Customers
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;