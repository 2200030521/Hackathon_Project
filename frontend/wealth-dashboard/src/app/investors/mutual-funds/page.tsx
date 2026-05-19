'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MutualFundCard } from '@/components/cards/MutualFundCard'
import { MutualFundsTable } from '@/components/tables/MutualFundsTable'
import { StatCard } from '@/components/cards/StatCard'
import { Briefcase, TrendingUp, DollarSign, Zap, ArrowLeft } from 'lucide-react'
import { equityApi } from '@/services/api'

interface MutualFund {
  id: string
  customer_funds_id: string
  scheme_code: string
  scheme_name: string
  amc_name: string
  units_held: number
  invested_amount: number
  nav_value: number
  current_value: number
  status: string
}

export default function MutualFundsPage() {
  const [funds, setFunds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [totalValue, setTotalValue] = useState(0)
  const [totalGains, setTotalGains] = useState(0)
  const [investorId] = useState('1') // This would come from auth context

  const fetchMutualFunds = async () => {
    try {
      setLoading(true)
      // Using a sample customer ref - this should come from auth context
      const res = await equityApi.get(`/mf/funds/${investorId}`)
      
      if (res.data.success) {
        const mappedFunds = res.data.data.map((fund: any, idx: number) => {
          const currentValue = fund.units_held * fund.nav_value
          const invested = fund.invested_amount || (fund.units_held * 100) // Mock if not available
          const gain = currentValue - invested
          const returnPercentage = (gain / invested) * 100

          return {
            id: fund.customer_funds_id || idx.toString(),
            schemeCode: fund.scheme_code,
            name: fund.scheme_name,
            amcName: fund.amc_name,
            amount: currentValue,
            navValue: fund.nav_value,
            returnPercentage: isNaN(returnPercentage) ? 0 : returnPercentage,
            units: fund.units_held,
            status: (fund.status || 'active').toLowerCase() as 'active' | 'inactive' | 'pending',
            investedAmount: invested
          }
        })

        setFunds(mappedFunds)

        // Calculate totals
        const total = mappedFunds.reduce((sum, f) => sum + f.amount, 0)
        const totalInvested = mappedFunds.reduce((sum, f) => sum + f.investedAmount, 0)
        const gains = total - totalInvested

        setTotalValue(total)
        setTotalGains(gains)
      }
    } catch (err) {
      console.error('Failed to fetch mutual funds:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMutualFunds()
  }, [])

  const totalInvested = funds.reduce((sum, f) => sum + (f.investedAmount || 0), 0)
  const gainsPercentage = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0
  const activeCount = funds.filter(f => f.status === 'active').length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/investors" className="p-2 border border-border rounded-md hover:bg-secondary transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mutual Funds Portfolio</h2>
          <p className="text-muted-foreground">View and manage your mutual fund investments (Investors Only)</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'grid'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'table'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Table View
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(totalValue)}
          icon={<DollarSign className="w-5 h-5" />}
          trend={totalGains >= 0 ? 'up' : 'down'}
          trendValue={`${totalGains >= 0 ? '+' : ''}${formatCurrency(totalGains)}`}
        />
        <StatCard
          title="Total Gains/Loss"
          value={formatCurrency(totalGains)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={totalGains >= 0 ? 'up' : 'down'}
          trendValue={`${gainsPercentage >= 0 ? '+' : ''}${gainsPercentage.toFixed(2)}%`}
        />
        <StatCard
          title="Active Holdings"
          value={activeCount.toString()}
          icon={<Briefcase className="w-5 h-5" />}
          trend="neutral"
          trendValue={`of ${funds.length}`}
        />
        <StatCard
          title="Total Invested"
          value={formatCurrency(totalInvested)}
          icon={<Zap className="w-5 h-5" />}
          trend={totalValue >= totalInvested ? 'up' : 'down'}
          trendValue={totalValue >= totalInvested ? '+' : '-'}
        />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && funds.length > 0 ? (
            funds.map((fund) => (
              <MutualFundCard
                key={fund.id}
                id={fund.id}
                name={fund.name}
                amcName={fund.amcName}
                amount={fund.amount}
                navValue={fund.navValue}
                returnPercentage={fund.returnPercentage}
                units={fund.units}
                status={fund.status}
              />
            ))
          ) : null}
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <MutualFundsTable funds={funds} loading={loading} />
        </div>
      )}

      {!loading && funds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-border bg-card">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No Mutual Funds</p>
          <p className="text-muted-foreground">You don't have any mutual fund investments yet</p>
        </div>
      )}
    </div>
  )
}
