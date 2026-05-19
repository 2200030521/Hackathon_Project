'use client'
import { useState } from 'react'
import { InvestorTable } from '@/components/tables/InvestorTable'
import { StatCard } from '@/components/cards/StatCard'
import { AddInvestorModal } from '@/components/modals/AddInvestorModal'
import { Users, TrendingUp, ShieldAlert, UserPlus } from 'lucide-react'

export default function InvestorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investors Directory</h2>
          <p className="text-muted-foreground">Manage and view unified investor profiles and their aggregated wealth</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <UserPlus className="w-4 h-4" />
          Add Investor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Investors" 
          value="1,248" 
          icon={<Users className="w-5 h-5" />}
          trend="up"
          trendValue="+12"
        />
        <StatCard 
          title="Avg. Net Worth" 
          value="₹1.3 Cr" 
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          trendValue="+4.2%"
        />
        <StatCard 
          title="KYC Pending" 
          value="34" 
          icon={<ShieldAlert className="w-5 h-5" />}
          trend="down"
          trendValue="-5"
        />
      </div>

      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <InvestorTable />
      </div>

      <AddInvestorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
