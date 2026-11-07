'use client';

import { useState } from 'react';

export default function Deployments() {
  const [deployments] = useState([
    { id: 1, orderCode: "CODE-ABC12", status: "Queued" as const, liveUrl: "" },
    { id: 2, orderCode: "CODE-DEF34", status: "Building" as const, liveUrl: "" },
    { id: 3, orderCode: "CODE-GHI56", status: "Live" as const, liveUrl: "https://app.subdomain.com" },
    { id: 4, orderCode: "CODE-JKL78", status: "Failed" as const, liveUrl: "" },
    { id: 5, orderCode: "CODE-MNO90", status: "Queued" as const, liveUrl: "" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deployment Queue</h1>
        <span className="px-4 py-2 bg-cipher-primary/20 text-cipher-primary rounded-full font-semibold">
          {deployments.filter(d => d.status === "Queued").length} queued
        </span>
      </div>

      {/* Deployments Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600/50">
              <th className="text-left py-3 px-4">Order Code</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Subdomain/Domain</th>
              <th className="text-left py-3 px-4">Region</th>
              <th className="text-center py-3 px-4">Live URL</th>
              <th className="text-center py-3 px-4">Logs</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <tr key={deployment.id} className="border-b border-gray-600/50 hover:bg-cipher-bg/50 transition-colors">
                <td className="py-3 px-4 font-semibold">{deployment.orderCode}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={deployment.status} />
                </td>
                <td className="py-3 px-4 text-cipher-text-muted">{deployment.liveUrl || "N/A"}</td>
                <td className="py-3 px-4 text-cipher-text-muted">auto</td>
                <td className="text-center py-3 px-4">
                  {deployment.liveUrl ? (
                    <a 
                      href={deployment.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cipher-primary hover:text-blue-400 transition-colors text-sm"
                    >
                      View →
                    </a>
                  ) : '-'}
                </td>
                <td className="text-center py-3 px-4">
                  <button 
                    onClick={() => {}}
                    className="text-cipher-primary hover:text-blue-400 transition-colors text-sm"
                  >
                    View Logs
                  </button>
                </td>
                <td className="text-center py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    {deployment.status !== "Live" && (
                      <button className="btn btn-success" style={{padding: '0.5rem 1rem'}}>
                        Deploy
                      </button>
                    )}
                    {deployment.status === "Queued" && (
                      <button className="btn btn-warning" style={{padding: '0.5rem 1rem'}}>
                        Retry
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deployment Controls */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Deployment Settings</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <SettingField label="Default Region" value="auto" />
          <SettingField label="Auto-delete after" value="never" />
          <SettingField label="Timeout (minutes)" value="30" />
          <SettingField label="Health Check Path" value="/health" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Deployment Activity</h2>
        <div className="space-y-3">
          <ActivityItem 
            message="Deployment for CODE-ABC12 completed successfully" 
            type="success"
            time="5 minutes ago"
          />
          <ActivityItem 
            message="Deployment failed: Build timeout exceeded 30 minutes" 
            type="error"
            time="1 hour ago"
          />
          <ActivityItem 
            message="Deployment queued for CODE-DEF34" 
            type="info"
            time="2 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

// Component: Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles = {
    Queued: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Building: 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse',
    Live: 'bg-green-500/20 text-green-400 border-green-500/30',
    Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  } as const;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

// Component: Setting Field
function SettingField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-cipher-text-muted">{label}</label>
      <span className="font-mono text-cipher-primary">{value}</span>
    </div>
  );
}

// Component: Activity Item
function ActivityItem({ 
  message, 
  type,
  time 
}: { 
  message: string; 
  type: 'success' | 'error' | 'info';
  time: string;
}) {
  const typeStyles = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
  } as const;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/50">
      <span className={`text-lg ${typeStyles[type]}`}>
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
      </span>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-cipher-text-muted mt-1">{time}</p>
      </div>
    </div>
  );
}
