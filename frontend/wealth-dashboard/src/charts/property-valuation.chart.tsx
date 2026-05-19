'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { year: '2019', valuation: 45000000 },
  { year: '2020', valuation: 48000000 },
  { year: '2021', valuation: 55000000 },
  { year: '2022', valuation: 62000000 },
  { year: '2023', valuation: 71000000 },
  { year: '2024', valuation: 85000000 },
]

export function PropertyValuationChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(value as number)}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
          />
          <Area type="monotone" dataKey="valuation" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValuation)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
