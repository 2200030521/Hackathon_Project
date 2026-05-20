import { MapPin, Building, TrendingUp } from 'lucide-react'

interface PropertyCardProps {
  name: string
  location: string
  type: 'Commercial' | 'Residential'
  valuation: number
  rentalYield: number
  investors: number
  image?: string
}

export function PropertyCard({ name, location, type, valuation, rentalYield, investors }: PropertyCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
      <div className="h-32 bg-secondary/80 relative flex items-center justify-center">
        <Building className="w-10 h-10 text-muted-foreground/30" />
        <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium border border-border">
          {type}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 mb-4">
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Valuation</p>
            <p className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(valuation)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Rental Yield</p>
            <p className="font-semibold text-green-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {rentalYield}%
            </p>
          </div>
          <div className="col-span-2 pt-3 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Fractional Ownership</span>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
              {investors} Investors
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
