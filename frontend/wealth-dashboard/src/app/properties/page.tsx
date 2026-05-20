'use client'
import { useState } from 'react'
import { StatCard } from '@/components/cards/StatCard'
import { PropertyCard } from '@/components/cards/PropertyCard'
import { PropertyValuationChart } from '@/charts/property-valuation.chart'
import { AddPropertyModal } from '@/components/modals/AddPropertyModal'
import { Building2, IndianRupee, Map, Home, Plus } from 'lucide-react'

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const properties = [
    { name: 'TechPark Tower A', location: 'Whitefield, Bengaluru', type: 'Commercial' as const, valuation: 35000000, rentalYield: 8.2, investors: 145 },
    { name: 'Marina Bay Residences', location: 'Worli, Mumbai', type: 'Residential' as const, valuation: 22000000, rentalYield: 4.5, investors: 42 },
    { name: 'Cyber Hub Complex', location: 'DLF Phase 2, Gurugram', type: 'Commercial' as const, valuation: 18000000, rentalYield: 7.8, investors: 89 },
    { name: 'Azure Warehouses', location: 'Bhiwandi, Maharashtra', type: 'Commercial' as const, valuation: 10000000, rentalYield: 9.1, investors: 210 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Real Estate Assets</h2>
          <p className="text-muted-foreground">Property valuation, rental income analytics, and ownership tracking</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total RE Valuation" 
          value="₹8.5 Cr" 
          icon={<Building2 className="w-5 h-5" />}
          trend="up"
          trendValue="+18.4%"
        />
        <StatCard 
          title="Avg. Rental Yield" 
          value="7.4%" 
          icon={<IndianRupee className="w-5 h-5" />}
          trend="up"
          trendValue="+0.6%"
        />
        <StatCard 
          title="Total Properties" 
          value="14" 
          icon={<Map className="w-5 h-5" />}
          trend="up"
          trendValue="+2"
        />
        <StatCard 
          title="Fractional Owners" 
          value="892" 
          icon={<Home className="w-5 h-5 text-purple-500" />}
          trend="up"
          trendValue="+124"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Portfolio Valuation Growth</h3>
            <p className="text-sm text-muted-foreground">Historical appreciation of aggregated real estate assets</p>
          </div>
          <PropertyValuationChart />
        </div>
        
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Top Yielding Assets</h3>
            <p className="text-sm text-muted-foreground">Highest rental ROI</p>
          </div>
          <div className="space-y-4 flex-1">
            {properties.sort((a, b) => b.rentalYield - a.rentalYield).slice(0, 4).map((prop, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border bg-secondary/20">
                <div>
                  <p className="font-medium text-sm">{prop.name}</p>
                  <p className="text-xs text-muted-foreground">{prop.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">{prop.rentalYield}%</p>
                  <p className="text-xs text-muted-foreground">Yield</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 mt-8">Asset Directory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, idx) => (
            <PropertyCard key={idx} {...property} />
          ))}
        </div>
      </div>

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
