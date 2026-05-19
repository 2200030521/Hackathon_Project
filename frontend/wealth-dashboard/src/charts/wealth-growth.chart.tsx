'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', wealth: 11000000 },
  { name: 'Feb', wealth: 11500000 },
  { name: 'Mar', wealth: 11200000 },
  { name: 'Apr', wealth: 12500000 },
  { name: 'May', wealth: 13200000 },
  { name: 'Jun', wealth: 14100000 },
  { name: 'Jul', wealth: 16300000 },
]

export function WealthGrowthChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value as number)}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
          />
          <Area type="monotone" dataKey="wealth" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorWealth)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
