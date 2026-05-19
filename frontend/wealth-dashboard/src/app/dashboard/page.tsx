import { StatCard } from '@/components/cards/StatCard'
import { AssetAllocationChart } from '@/charts/asset-allocation.chart'
import { WealthGrowthChart } from '@/charts/wealth-growth.chart'
import { Wallet, Users, Activity, Building2, TrendingUp, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Unified Wealth Platform Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-md text-sm font-medium border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All Systems Operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total AUM" 
          value="₹16.3 Cr" 
          icon={<Wallet className="w-5 h-5" />}
          trend="up"
          trendValue="+14.2%"
        />
        <StatCard 
          title="Active Investors" 
          value="1,248" 
          icon={<Users className="w-5 h-5" />}
          trend="up"
          trendValue="+5.1%"
        />
        <StatCard 
          title="Real Estate Value" 
          value="₹8.5 Cr" 
          icon={<Building2 className="w-5 h-5" />}
          trend="up"
          trendValue="+2.4%"
        />
        <StatCard 
          title="System Latency" 
          value="42ms" 
          icon={<Activity className="w-5 h-5" />}
          trend="down"
          trendValue="-12ms"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Wealth Growth Analytics</h3>
            <p className="text-sm text-muted-foreground">Aggregated across Equity, MF, and Real Estate</p>
          </div>
          <WealthGrowthChart />
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Asset Allocation</h3>
            <p className="text-sm text-muted-foreground">Current portfolio distribution</p>
          </div>
          <AssetAllocationChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Recent Activities</h3>
              <p className="text-sm text-muted-foreground">Latest transactions and updates</p>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">SIP SIP-00{i} Executed Successfully</p>
                  <p className="text-xs text-muted-foreground">Investor ID: INV-293{i} • ₹10,000</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                  {i * 15} mins ago
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Operational Alerts</h3>
              <p className="text-sm text-muted-foreground">System health and service failures</p>
            </div>
            <button className="text-xs text-primary font-medium">View All</button>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-start gap-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-destructive">BSE Equity API High Latency</p>
                <p className="text-xs text-muted-foreground">Downstream service taking &gt; 500ms</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                Just now
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-500">Cache Hit Ratio Dropped</p>
                <p className="text-xs text-muted-foreground">Redis hit ratio below 85% threshold</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                1 hour ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
