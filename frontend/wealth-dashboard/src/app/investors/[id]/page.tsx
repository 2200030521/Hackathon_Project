import { StatCard } from '@/components/cards/StatCard'
import { AssetAllocationChart } from '@/charts/asset-allocation.chart'
import { ArrowLeft, Briefcase, Building, LineChart, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function InvestorDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/investors" className="p-2 border border-border rounded-md hover:bg-secondary transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Aarav Sharma
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">Active</span>
          </h2>
          <p className="text-muted-foreground">{params.id} • aarav.s@example.com • Aggressive Risk Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Net Worth" value="₹4.5 Cr" icon={<Briefcase className="w-5 h-5" />} trend="up" trendValue="+8.4%" />
        <StatCard title="Equity Holdings" value="₹2.1 Cr" icon={<LineChart className="w-5 h-5" />} />
        <StatCard title="Mutual Funds" value="₹85 L" icon={<CreditCard className="w-5 h-5" />} />
        <StatCard title="Real Estate" value="₹1.55 Cr" icon={<Building className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Unified Holdings Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg border border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500"><LineChart className="w-5 h-5" /></div>
                <div><p className="font-medium">Direct Equity (Demats)</p><p className="text-xs text-muted-foreground">Zerodha, Upstox Aggregated</p></div>
              </div>
              <div className="text-right"><p className="font-bold">₹2,10,00,000</p><p className="text-xs text-green-500">+12.4% XIRR</p></div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg border border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500"><CreditCard className="w-5 h-5" /></div>
                <div><p className="font-medium">Mutual Funds (SIPs)</p><p className="text-xs text-muted-foreground">4 Active SIPs</p></div>
              </div>
              <div className="text-right"><p className="font-bold">₹85,00,000</p><p className="text-xs text-green-500">+15.2% XIRR</p></div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg border border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Building className="w-5 h-5" /></div>
                <div><p className="font-medium">Real Estate Assets</p><p className="text-xs text-muted-foreground">2 Commercial Properties</p></div>
              </div>
              <div className="text-right"><p className="font-bold">₹1,55,00,000</p><p className="text-xs text-muted-foreground">₹1.2L Monthly Rent</p></div>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Investor Allocation</h3>
          <AssetAllocationChart />
        </div>
      </div>
    </div>
  )
}
