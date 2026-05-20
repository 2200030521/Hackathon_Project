import Link from 'next/link'
import { Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/components/cards/StatCard'

const mockInvestors = [
  { id: 'INV-1001', name: 'Aarav Sharma', email: 'aarav.s@example.com', totalWealth: 45000000, riskScore: 'Aggressive', status: 'Active', trend: 'up', kyc: true },
  { id: 'INV-1002', name: 'Priya Patel', email: 'priya.p@example.com', totalWealth: 12500000, riskScore: 'Moderate', status: 'Active', trend: 'up', kyc: true },
  { id: 'INV-1003', name: 'Vikram Singh', email: 'v.singh@example.com', totalWealth: 8900000, riskScore: 'Conservative', status: 'Inactive', trend: 'down', kyc: false },
  { id: 'INV-1004', name: 'Neha Gupta', email: 'neha.g@example.com', totalWealth: 34000000, riskScore: 'Aggressive', status: 'Active', trend: 'up', kyc: true },
  { id: 'INV-1005', name: 'Rahul Desai', email: 'r.desai@example.com', totalWealth: 5600000, riskScore: 'Moderate', status: 'Active', trend: 'down', kyc: true },
]

export function InvestorTable() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Investor</th>
              <th className="px-6 py-3 font-medium">Risk Profile</th>
              <th className="px-6 py-3 font-medium">Total Wealth (Aggregated)</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {mockInvestors.map((investor) => (
              <tr key={investor.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {investor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {investor.name}
                        {investor.kyc && <ShieldCheck className="w-3 h-3 text-green-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{investor.id} • {investor.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", {
                    'bg-red-500/10 text-red-500': investor.riskScore === 'Aggressive',
                    'bg-blue-500/10 text-blue-500': investor.riskScore === 'Moderate',
                    'bg-green-500/10 text-green-500': investor.riskScore === 'Conservative',
                  })}>
                    {investor.riskScore}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(investor.totalWealth)}
                    </span>
                    {investor.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", investor.status === 'Active' ? "bg-green-500" : "bg-muted-foreground")} />
                    {investor.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/investors/${investor.id}`} className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors mr-2">
                    View Portfolio
                  </Link>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
