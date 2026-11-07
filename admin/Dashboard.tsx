'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenueByCoin: { btc: 0, eth: 0, usdt: 0, total: 0 },
    totalOrders: 0,
    pendingVerifications: 0,
    activeDeployments: 0,
    recentActivity: [] as any[],
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        revenueByCoin: { btc: 1250.50, eth: 890.25, usdt: 4200.00, total: 6340.75 },
        totalOrders: 247,
        pendingVerifications: 8,
        activeDeployments: 15,
        recentActivity: [
          { id: 1, type: 'order', message: 'New order #CODE-ABC12', time: '2 min ago' },
          { id: 2, type: 'deployment', message: 'Deployment #123 live', time: '15 min ago' },
          { id: 3, type: 'payment', message: 'Payment approved for order #XYZ789', time: '1 hour ago' },
        ],
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cipher-text-muted">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="text-cipher-text-muted">CipherCode Admin Portal</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenueByCoin.total.toLocaleString()}`}
          icon="💰"
          trend="+12% from last month"
        />

        <StatCard
          title="BTC Revenue"
          value={`₿${stats.revenueByCoin.btc.toFixed(2)}`}
          icon="₿"
          trend="Most popular coin"
        />

        <StatCard
          title="ETH Revenue"
          value={`Ξ${stats.revenueByCoin.eth.toFixed(2)}`}
          icon="Ξ"
          trend="Growing steadily"
        />

        <StatCard
          title="USDT Revenue"
          value={`₮$${stats.revenueByCoin.usdt.toLocaleString()}`}
          icon="₮"
          trend="Stablecoin favorite"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders Overview */}
        <section className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold mb-4">Orders Overview</h2>
          <div className="space-y-4">
            <OrderSummary 
              count={stats.totalOrders}
              label="Total Orders Processed"
            />
            <OrderSummary 
              count={stats.pendingVerifications}
              label="Pending Payment Verification"
              accent="warning"
            />
            <OrderSummary 
              count={stats.activeDeployments}
              label="Active Deployments"
              accent="info"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity: any) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton href="/admin/projects">Manage Projects</ActionButton>
          <ActionButton href="/admin/verifications">Verify Payments</ActionButton>
          <ActionButton href="/admin/deployments">Manage Deployments</ActionButton>
          <ActionButton href="/admin/orders">View All Orders</ActionButton>
        </div>
      </div>

      {/* Revenue by Coin Chart Placeholder */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Revenue by Coin Type</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <CoinChartItem
            label="Bitcoin (BTC)"
            amount={stats.revenueByCoin.btc.toFixed(2)}
            percentage="38%"
            color="bg-yellow-500"
          />
          <CoinChartItem
            label="Ethereum (ETH)"
            amount={stats.revenueByCoin.eth.toFixed(2)}
            percentage="14%"
            color="bg-purple-500"
          />
          <CoinChartItem
            label="Tether (USDT)"
            amount={stats.revenueByCoin.usdt.toLocaleString()}
            percentage="48%"
            color="bg-green-500"
          />
        </div>
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({ 
  title, 
  value, 
  icon,
  trend 
}: { 
  title: string; 
  value: string; 
  icon: string;
  trend: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-cipher-text-muted">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-cipher-success mt-2">{trend}</p>
    </div>
  );
}

// Component: Order Summary
function OrderSummary({ 
  count,
  label,
  accent = 'default'
}: { 
  count: number;
  label: string;
  accent?: 'warning' | 'info' | 'default';
}) {
  const colors = {
    default: 'text-white',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm text-cipher-text-muted`}>{label}</span>
      <span className={`text-2xl font-bold ${colors[accent]}`}>{count.toLocaleString()}</span>
    </div>
  );
}

// Component: Activity Item
function ActivityItem({ activity }: { activity: any }) {
  const typeColors = {
    order: 'bg-blue-500/20 text-blue-400',
    deployment: 'bg-green-500/20 text-green-400',
    payment: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeColors[activity.type]}`}>
        {activity.type === 'order' && '📦'}
        {activity.type === 'deployment' && '☁️'}
        {activity.type === 'payment' && '💳'}
      </div>
      <div className="flex-1">
        <p className="text-sm">{activity.message}</p>
        <p className="text-xs text-cipher-text-muted mt-1">{activity.time}</p>
      </div>
    </div>
  );
}

// Component: Action Button
function ActionButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="btn btn-outline disabled:opacity-50"
    >
      {children}
    </a>
  );
}

// Component: Coin Chart Item
function CoinChartItem({ 
  label,
  amount,
  percentage,
  color 
}: { 
  label: string;
  amount: string;
  percentage: string;
  color: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className={`text-2xl mb-2 ${color}`}>{amount}</div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between text-xs text-cipher-text-muted">
          <span>{percentage} of total</span>
        </div>
      </div>
    </div>
  );
}
