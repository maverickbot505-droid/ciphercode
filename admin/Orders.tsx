'use client';

import { useState } from 'react';

export default function Orders() {
  const [orders] = useState([
    { id: 1, code: "CODE-ABC12", alias: "John Doe", email: "john@example.com", project: "E-Commerce Store", status: "PaymentSubmitted" as any, paymentStatus: "PendingVerification" },
    { id: 2, code: "CODE-DEF34", alias: "Alice Smith", email: "alice@example.com", project: "Portfolio Template", status: "DownloadReady" as any, paymentStatus: "Approved" },
    { id: 3, code: "CODE-GHI56", alias: "Bob Wilson", email: "bob@example.com", project: "Blog Platform", status: "Building" as any, paymentStatus: "Approved" },
    { id: 4, code: "CODE-JKL78", alias: "Jane Cooper", email: "jane@example.com", project: "CRM System", status: "Live" as any, paymentStatus: "Approved", liveUrl: "https://app.example.com" },
    { id: 5, code: "CODE-MNO90", alias: "Sam Taylor", email: "sam@example.com", project: "E-Commerce Store", status: "PaymentRejected" as any, paymentStatus: "Rejected", rejectionReason: "Insufficient funds" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <SearchInput placeholder="Filter by order code..." />
          <SelectInput 
            label="Status"
            options={[
              { value: "", label: "All Statuses" },
              { value: "PendingPayment", label: "Pending Payment" },
              { value: "DownloadReady", label: "Download Ready" },
              { value: "Building", label: "Building" },
              { value: "Live", label: "Live" },
              { value: "Failed", label: "Failed" },
            ]}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600/50">
              <th className="text-left py-3 px-4">Order Code</th>
              <th className="text-left py-3 px-4">Customer</th>
              <th className="text-left py-3 px-4">Project</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Payment Status</th>
              <th className="text-center py-3 px-4">Live URL</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-600/50 hover:bg-cipher-bg/50 transition-colors">
                <td className="py-3 px-4 font-semibold">{order.code}</td>
                <td className="py-3 px-4">
                  <div>{order.alias}</div>
                  <div className="text-xs text-cipher-text-muted">{order.email}</div>
                </td>
                <td className="py-3 px-4 text-cipher-text-muted">{order.project}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3 px-4">
                  {order.paymentStatus === 'Approved' && (
                    <span className="status-approved">✓ Approved</span>
                  )}
                  {order.paymentStatus === 'PendingVerification' && (
                    <span className="status-building">Awaiting verification</span>
                  )}
                  {order.paymentStatus === 'Rejected' && (
                    <>
                      <span className="status-rejected">✗ Rejected</span>
                      <div className="text-xs text-red-400 mt-1">{order.rejectionReason}</div>
                    </>
                  )}
                </td>
                <td className="text-center py-3 px-4">
                  {order.liveUrl ? (
                    <a 
                      href={order.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cipher-primary hover:text-blue-400 transition-colors text-sm"
                    >
                      View →
                    </a>
                  ) : '-'}
                </td>
                <td className="text-center py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => {}}
                      className="btn btn-outline" style={{padding: '0.5rem 1rem'}}
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => {}}
                      className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}
                    >
                      Manage
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-cipher-text-muted">Showing 1-5 of 247 orders</div>
        <div className="flex gap-2">
          <button 
            onClick={() => {}}
            className="btn btn-outline" style={{padding: '0.5rem 1rem'}}
            disabled
          >
            Previous
          </button>
          <button 
            onClick={() => {}}
            className="btn btn-outline" style={{padding: '0.5rem 1rem'}}
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Component: Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles = {
    PendingPayment: 'status-pending',
    PaymentSubmitted: 'status-pending',
    DownloadReady: 'status-approved',
    Building: 'status-building',
    Live: 'status-approved',
    Failed: 'status-rejected',
    PaymentApproved: 'status-approved',
    PaymentRejected: 'status-rejected',
  } as const;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'status-pending'}`}>
      {status}
    </span>
  );
}

// Component: Search Input
function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="px-4 py-2 bg-cipher-bg border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all"
    />
  );
}

// Component: Select Input
function SelectInput({ label, options }: { label: string; options: any[] }) {
  return (
    <div className="relative">
      <select className="appearance-none px-4 py-2 bg-cipher-bg border border-gray-600 rounded-lg text-white focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all pr-8 cursor-pointer">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {label === "" ? option.label : option.value}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        ▾
      </div>
    </div>
  );
}
