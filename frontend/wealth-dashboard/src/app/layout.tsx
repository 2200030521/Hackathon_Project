'use client'
import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Hide dashboard sidebar/navbar on public routes
  const isPublicRoute = pathname === '/login' || pathname === '/'

  return (
    <html lang="en" className="dark">
      <head>
        <title>Unified Wealth Intelligence Platform</title>
      </head>
      <body className={`${inter.className} bg-background text-foreground h-screen flex overflow-hidden`}>
        <ThemeProvider>
          {isPublicRoute ? (
            <main className="w-full h-full overflow-y-auto">
              {children}
            </main>
          ) : (
            <>
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-auto p-6">
                  {children}
                </main>
              </div>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
