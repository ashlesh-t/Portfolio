import { ReactNode } from "react"
import Link from "next/link"

export const metadata = {
  title: "Admin Mode",
  description: "Portfolio Admin Dashboard",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col gap-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Admin Mode</h2>
          <p className="text-sm text-muted-foreground">Manage your portfolio</p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/" className="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            &larr; Back to Site
          </Link>
          <Link href="/adminmode" className="px-4 py-2 bg-primary/10 text-primary rounded-md transition-colors">
            Dashboard
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-auto">
        {children}
      </main>
    </div>
  )
}
