'use client'
import Link from 'next/link'
import { ArrowRight, BarChart3, ShieldCheck, Layers, PieChart, Activity, Globe, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Public Navbar */}
      <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              WI
            </div>
            <span className="text-xl font-bold tracking-tight">WealthIntel Pro</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
            <Link href="#security" className="hover:text-foreground transition-colors">Security</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors mr-2"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link 
              href="/login" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border border-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Introducing Unified Wealth Aggregation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Enterprise Wealth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Intelligence Platform</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A highly scalable microservices architecture for multi-asset wealth management. Aggregate equities, mutual funds, and real estate in real-time.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link 
                href="/login" 
                className="flex items-center gap-2 text-base font-medium bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-colors shadow-xl shadow-primary/20"
              >
                Access Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#features" 
                className="flex items-center gap-2 text-base font-medium bg-secondary text-secondary-foreground px-8 py-4 rounded-full hover:bg-secondary/80 transition-colors border border-border"
              >
                View Features
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Aggregation Engine</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Built on a robust microservices architecture handling millions of transactions with sub-millisecond latency.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Layers className="w-6 h-6" />, title: "Cross-Service Aggregation", desc: "Unified APIs seamlessly blend data from Equity, SIP, and Real Estate systems." },
                { icon: <Activity className="w-6 h-6" />, title: "Real-time Operations", desc: "Monitor SIP failures, Redis cache hit ratios, and API latency live via WebSockets." },
                { icon: <ShieldCheck className="w-6 h-6" />, title: "Enterprise RBAC", desc: "Strict Role-Based Access Control ensuring secure routing for Admins and Investors." },
                { icon: <PieChart className="w-6 h-6" />, title: "Advanced Analytics", desc: "Deep insights into asset allocation, wealth growth, and property rental yields." },
                { icon: <Globe className="w-6 h-6" />, title: "Highly Scalable", desc: "Engineered with circuit breakers, retry logic, and graceful degradation." },
                { icon: <BarChart3 className="w-6 h-6" />, title: "Immutable Audit Logs", desc: "Track every login, sensitive operation, and API request for full compliance." }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              WI
            </div>
            <span className="text-base font-bold tracking-tight">WealthIntel Pro</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Built for the Unified Wealth Hackathon. Microservices Architecture & Next.js 15.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
