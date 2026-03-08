"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({ projects: 0, publications: 0, research: 0 })
  const { toast } = useToast()

  const fetchStats = async () => {
    try {
      const [projRes, pubRes, resRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/publications"),
        fetch("/api/research")
      ])
      const projects = await projRes.json()
      const publications = await pubRes.json()
      const research = await resRes.json()
      
      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        publications: Array.isArray(publications) ? publications.length : 0,
        research: Array.isArray(research) ? research.length : 0
      })
    } catch (err) {
      console.error("Failed to fetch stats", err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleSeedDatabase = async () => {
    if (!confirm("Are you sure? This will delete existing data and insert mock data.")) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST"
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Database seeded successfully!",
        })
        fetchStats()
      } else {
        throw new Error("Seed failed")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to seed database. Make sure MONGODB_URI is configured.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Total portfolio projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{stats.projects}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
            <CardDescription>Total research papers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{stats.publications}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research</CardTitle>
            <CardDescription>Research entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{stats.research}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>
              Initialize your database with demo content or manage current connections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Clicking the button below will clear the current database collections for Projects, Publications, and Research, and seed them with the default mock data.
            </p>
            <Button 
              onClick={handleSeedDatabase} 
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              Seed Mock Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
