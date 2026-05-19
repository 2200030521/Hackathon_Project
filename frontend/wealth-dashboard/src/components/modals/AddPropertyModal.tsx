'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Commercial',
    valuation: '',
    rentalYield: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would dispatch to Redux or call the API
    console.log('Adding property:', formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Property Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. TechPark Tower A"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input 
              type="text" 
              required
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Whitefield, Bengaluru"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Property Type</label>
            <select 
              className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valuation (₹)</label>
              <input 
                type="number" 
                required
                className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="35000000"
                value={formData.valuation}
                onChange={(e) => setFormData({...formData, valuation: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rental Yield (%)</label>
              <input 
                type="number" 
                step="0.1"
                required
                className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="8.2"
                value={formData.rentalYield}
                onChange={(e) => setFormData({...formData, rentalYield: e.target.value})}
              />
            </div>
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
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
