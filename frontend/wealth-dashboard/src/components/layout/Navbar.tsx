'use client'
import { Search, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/investors?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search investors, transactions, alerts... (Press Enter)" 
          className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </form>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  )
}
