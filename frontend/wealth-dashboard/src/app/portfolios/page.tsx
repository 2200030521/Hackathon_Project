import { StatCard } from '@/components/cards/StatCard'
import { AssetAllocationChart } from '@/charts/asset-allocation.chart'
import { PortfolioPerformanceChart } from '@/charts/portfolio-performance.chart'
import { PieChart, TrendingUp, Layers, RefreshCw } from 'lucide-react'

export default function PortfoliosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Aggregated Portfolios</h2>
          <p className="text-muted-foreground">Cross-asset wealth analytics and performance metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Sync All Assets
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Aggregated Value" 
          value="₹16.3 Cr" 
          icon={<PieChart className="w-5 h-5" />}
          trend="up"
          trendValue="+14.2%"
        />
        <StatCard 
          title="Overall XIRR" 
          value="14.8%" 
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          trendValue="+1.2%"
        />
        <StatCard 
          title="Asset Classes" 
          value="4 Active" 
          icon={<Layers className="w-5 h-5" />}
          trend="neutral"
        />
        <StatCard 
          title="Total Unlinked Accounts" 
          value="12" 
          icon={<RefreshCw className="w-5 h-5 text-orange-500" />}
          trend="down"
          trendValue="-3 resolved"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">System-Wide Asset Allocation</h3>
            <p className="text-sm text-muted-foreground">Distribution across all 1,248 investors</p>
          </div>
          <AssetAllocationChart />
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Average Annualized Returns</h3>
              <p className="text-sm text-muted-foreground">Performance by asset class</p>
            </div>
          </div>
          <PortfolioPerformanceChart />
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Top Performing Asset Strategies</h3>
          <p className="text-sm text-muted-foreground">Best returning aggregated portfolios this year</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Strategy Type</th>
                <th className="px-6 py-3 font-medium">Investors Enrolled</th>
                <th className="px-6 py-3 font-medium">Total AUM</th>
                <th className="px-6 py-3 font-medium">1Y Return</th>
                <th className="px-6 py-3 font-medium">Risk Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Equity Heavy (80/20)</td>
                <td className="px-6 py-4">425</td>
                <td className="px-6 py-4">₹7.2 Cr</td>
                <td className="px-6 py-4 text-green-500 font-medium">+21.4%</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">Aggressive</span></td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Balanced Growth (60/40)</td>
                <td className="px-6 py-4">512</td>
                <td className="px-6 py-4">₹5.8 Cr</td>
                <td className="px-6 py-4 text-green-500 font-medium">+14.2%</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">Moderate</span></td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Real Estate Centric</td>
                <td className="px-6 py-4">89</td>
                <td className="px-6 py-4">₹2.1 Cr</td>
                <td className="px-6 py-4 text-green-500 font-medium">+11.8%</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">Conservative</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
