'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, User as UserIcon, Lock, Mail, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'

export default function LoginPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [role, setRole] = useState<'admin' | 'investor'>('admin')
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login routing
    if (role === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/investors/INV-1001') // Redirect investor to their specific portfolio view
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleTheme}
          className="p-3 bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors shadow-sm"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />

      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">WealthIntel Pro</h1>
          <p className="text-muted-foreground">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-secondary rounded-lg mb-8">
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              role === 'admin' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin / Manager
          </button>
          <button
            onClick={() => setRole('investor')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              role === 'investor' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Investor
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" required className="w-full bg-secondary/30 border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="John Doe" />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" required className="w-full bg-secondary/30 border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder={role === 'admin' ? 'admin@wealthintel.com' : 'investor@example.com'} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              Password
              {isLogin && <a href="#" className="text-primary text-xs hover:underline">Forgot password?</a>}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="password" required className="w-full bg-secondary/30 border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full py-2.5 mt-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
