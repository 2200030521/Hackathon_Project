'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

interface AddInvestorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddInvestorModal({ isOpen, onClose }: AddInvestorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    riskScore: 'Moderate'
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would dispatch to Redux or call the API
    console.log('Adding investor:', formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Add New Investor</h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input 
              type="tel" 
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Profile</label>
            <select 
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.riskScore}
              onChange={(e) => setFormData({...formData, riskScore: e.target.value})}
            >
              <option value="Conservative">Conservative</option>
              <option value="Moderate">Moderate</option>
              <option value="Aggressive">Aggressive</option>
            </select>
          </div>
          
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Create Investor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
