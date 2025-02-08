"use client"

import DashboardContent from "@/components/DashboardContent"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <DashboardContent/>
        </main>
      
    </div>
  )
}
