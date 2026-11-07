'use client';

import { useState } from 'react';

export default function Verifications() {
  const [hashes] = useState([
    { id: 1, orderCode: "CODE-ABC12", amount: 0.00543210, coin: "BTC", hash: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
    { id: 2, orderCode: "CODE-DEF34", amount: 0.32456789, coin: "ETH", hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" },
    { id: 3, orderCode: "CODE-GHI56", amount: 45.00, coin: "USDT-TRC20", hash: "TXYZabcdefghij1234567890abcdefghij1234567890abcd" },
    { id: 4, orderCode: "CODE-JKL78", amount: 0.00123456, coin: "BTC", hash: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" },
    { id: 5, orderCode: "CODE-MNO90", amount: 2.5, coin: "ETH", hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Verification Queue</h1>
        <span className="px-4 py-2 bg-cipher-warning/20 text-cipher-warning rounded-full font-semibold">
          {hashes.length} pending
        </span>
      </div>

      {/* Pending Payments Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600/50">
              <th className="text-left py-3 px-4">Order Code</th>
              <th className="text-left py-3 px-4">Project</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-center py-3 px-4">Network</th>
              <th className="text-left py-3 px-4">Wallet Address</th>
              <th className="text-right py-3 px-4">Submitted Hash</th>
              <th className="text-center py-3 px-4">Explorer</th>
              <th className="text-center py-3 px-4">Quote Expires</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hashes.map((hash) => (
              <tr key={hash.id} className="border-b border-gray-600/50 hover:bg-cipher-bg/50 transition-colors">
                <td className="py-3 px-4 font-semibold">{hash.orderCode}</td>
                <td className="py-3 px-4 text-cipher-text-muted">Project #{hash.id}</td>
                <td className="text-right py-3 px-4 font-mono font-medium">
                  {coinAmount(hash.coin, hash.amount)}
                </td>
                <td className="text-center py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${networkColor(hash.coin)}`}>
                    {hash.coin}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-xs max-w-xs truncate">{hash.hash.substring(0, 30)}...</td>
                <td className="text-right py-3 px-4">
                  <button 
                    onClick={() => copyToClipboard(hash.hash)}
                    className="text-cipher-primary hover:text-blue-400 transition-colors text-sm"
                  >
                    Copy Hash
                  </button>
                </td>
                <td className="text-center py-3 px-4">
                  <a 
                    href={`https://blockchain.info/tx/${hash.hash}?tab=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cipher-primary hover:text-blue-400 transition-colors text-sm"
                  >
                    Explorer →
                  </a>
                </td>
                <td className="text-center py-3 px-4 text-cipher-warning">28:15</td>
                <td className="text-center py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <button className="btn btn-success" style={{padding: '0.5rem 1rem'}}>Approve</button>
                    <button className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Reject</button>
                    <button className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Info</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="primary" onClick={() => {}}>Process All Approved</Button>
        <Button variant="secondary" onClick={() => {}}>Export Report</Button>
      </div>
    </div>
  );
}

// Helper: Format coin amount with proper decimals
function coinAmount(coin: string, amount: number): string {
  switch (coin.toLowerCase()) {
    case "btc": return `${amount.toFixed(8)} BTC`;
    case "eth": return `${amount.toFixed(6)} ETH`;
    default: return `${amount.toFixed(2)} ${coin}`;
  }
}

// Helper: Get network color
function networkColor(coin: string): string {
  const colors = {
    BTC: 'bg-yellow-500/20 text-yellow-400',
    ETH: 'bg-purple-500/20 text-purple-400',
    USDT: 'bg-green-500/20 text-green-400',
  } as const;
  
  return colors[coin.toUpperCase()] || "bg-gray-500/20 text-gray-400";
}

// Helper: Copy to clipboard
function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
  alert('Hash copied to clipboard!');
}

// Component: Button
function Button({ 
  variant = 'secondary',
  onClick,
  children
}: { 
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: 'bg-cipher-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-cipher-secondary hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
    outline: 'border-2 border-cipher-primary text-cipher-primary hover:bg-cipher-primary/10',
  } as const;

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
