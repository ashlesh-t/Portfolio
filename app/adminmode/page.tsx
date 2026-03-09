"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { TagInput } from "@/components/ui/tag-input"
import { Trash2, Edit, Plus, RefreshCw, Save } from "lucide-react"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({ projects: 0, publications: 0, research: 0, experience: 0, achievements: 0, certifications: 0 })
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("overview")

  const fetchStats = async () => {
    try {
      const [projRes, pubRes, resRes, expRes, achRes, certRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/publications"),
        fetch("/api/research"),
        fetch("/api/experience"),
        fetch("/api/achievements"),
        fetch("/api/certifications")
      ])
      const projects = await projRes.json()
      const publications = await pubRes.json()
      const research = await resRes.json()
      const experience = await expRes.json()
      const achievements = await achRes.json()
      const certifications = await certRes.json()
      
      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        publications: Array.isArray(publications) ? publications.length : 0,
        research: Array.isArray(research) ? research.length : 0,
        experience: Array.isArray(experience) ? experience.length : 0,
        achievements: Array.isArray(achievements) ? achievements.length : 0,
        certifications: Array.isArray(certifications) ? certifications.length : 0
      })
    } catch (err) {
      console.error("Failed to fetch stats", err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleClearDatabase = async () => {
    if (!confirm("Are you sure? This will delete ALL data in the database.")) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/clear", { method: "POST" })
      if (response.ok) {
        toast({ title: "Success", description: "Database cleared!" })
        fetchStats()
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to clear database.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedDatabase = async () => {
    if (!confirm("Are you sure? This will delete existing data and insert Ashlesh's real data.")) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/seed", { method: "POST" })
      if (response.ok) {
        toast({ title: "Success", description: "Database seeded successfully!" })
        fetchStats()
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to seed database.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF.", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      setIsLoading(true)
      try {
        const res = await fetch("/api/profile/resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeBase64: base64 })
        })
        if (res.ok) {
          toast({ title: "Success", description: "CV uploaded successfully!" })
        } else {
          throw new Error("Failed")
        }
      } catch (err) {
        toast({ title: "Error", description: "Could not upload CV.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-10 px-6 font-mono">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary tracking-tighter uppercase">Admin_Center</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-primary/20 pb-4">
        {["overview", "profile", "impact", "performance", "activity", "highlights", "projects", "research", "publications", "experience", "achievements", "certifications"].map(tab => (
          <Button 
            key={tab} 
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className={`capitalize text-xs h-8 ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <StatCard title="Projects" count={stats.projects} />
            <StatCard title="Papers" count={stats.publications} />
            <StatCard title="Research" count={stats.research} />
            <StatCard title="Experience" count={stats.experience} />
            <StatCard title="Achievements" count={stats.achievements} />
            <StatCard title="Certs" count={stats.certifications} />
          </div>

          <Card className="border-primary/20 bg-card/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-primary">SYSTEM_MGMT</CardTitle>
              <CardDescription>Global database operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>UPLOAD_CV (PDF)</Label>
                <Input type="file" accept="application/pdf" onChange={handleCVUpload} disabled={isLoading} className="bg-background/50 border-primary/20 text-xs" />
              </div>
              <div className="pt-4 border-t border-primary/10 flex gap-4">
                <Button onClick={handleSeedDatabase} disabled={isLoading} variant="outline" className="border-primary/50 text-primary text-xs h-9">
                  {isLoading ? <Spinner className="mr-2 h-3 w-3" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                  SEED_DATA
                </Button>
                <Button onClick={handleClearDatabase} disabled={isLoading} variant="destructive" className="bg-destructive/20 hover:bg-destructive text-destructive text-xs h-9">
                  {isLoading ? <Spinner className="mr-2 h-3 w-3" /> : <Trash2 className="mr-2 h-3 w-3" />}
                  PURGE_DB
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "profile" && <ProfileManager />}
      {activeTab === "impact" && <ImpactMetricsManager />}
      {activeTab === "performance" && <PerformanceMetricsManager />}
      {activeTab === "activity" && <ResearchActivityManager />}
      {activeTab === "highlights" && <HighlightsManager />}
      {activeTab === "projects" && <ProjectManager onUpdate={fetchStats} />}
      {activeTab === "experience" && <ExperienceManager onUpdate={fetchStats} />}
      {activeTab === "research" && <ResearchManager onUpdate={fetchStats} />}
      {activeTab === "publications" && <PublicationManager onUpdate={fetchStats} />}
      {activeTab === "achievements" && <AchievementManager onUpdate={fetchStats} />}
      {activeTab === "certifications" && <CertificationManager onUpdate={fetchStats} />}

    </div>
  )
}

function StatCard({ title, count }: { title: string; count: number }) {
  return (
    <Card className="bg-card/20 backdrop-blur-md border-primary/20">
      <CardContent className="pt-6">
        <div className="text-2xl font-bold text-primary">{count}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{title}</div>
      </CardContent>
    </Card>
  )
}

function ProfileManager() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", title: "", email: "", phone: "", location: "", github: "", linkedin: "", bio: "", designations: [] as string[], aboutTags: [] as string[], education: [] as any[] })

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if(data && Object.keys(data).length > 0) {
        setForm({
          name: data.name || "",
          title: data.title || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          bio: data.bio ? data.bio.join("\n\n") : "",
          designations: data.designations || [],
          aboutTags: data.aboutTags || [],
          education: data.education || []
        })
      }
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, bio: form.bio.split("\n\n").filter(Boolean) }
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      })
      if(res.ok) {
        toast({ title: "SUCCESS", description: "Profile configuration updated." })
      } else {
        toast({ title: "ERROR", description: "Failed to update profile.", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "ERROR", description: "Network failure.", variant: "destructive" })
    } finally { setLoading(false) }
  }

  const addEdu = () => setForm({...form, education: [...form.education, { school: "", degree: "", field: "", startYear: "", endYear: "" }]})
  const removeEdu = (idx: number) => setForm({...form, education: form.education.filter((_, i) => i !== idx)})
  const updateEdu = (idx: number, field: string, val: string) => setForm({...form, education: form.education.map((e, i) => i === idx ? { ...e, [field]: val } : e)})

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10 backdrop-blur-md">
        <CardHeader><CardTitle className="text-primary text-sm uppercase">IDENTITY_MGMT</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">FULL_NAME</Label>
                <Input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required className="bg-background/50 border-primary/10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">PRIMARY_TITLE</Label>
                <Input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="bg-background/50 border-primary/10 text-xs" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">SYSTEM_ROLES (Hero Loop)</Label>
              <TagInput tags={form.designations} setTags={t => setForm({...form, designations: t})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">WHOAMI_BIO (Paragraphs split by \n\n)</Label>
              <Textarea rows={6} value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">CAPABILITY_TAGS (WHOAMI Bottom)</Label>
              <TagInput tags={form.aboutTags} setTags={t => setForm({...form, aboutTags: t})} />
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <div className="flex justify-between items-center">
                 <Label className="text-xs uppercase text-primary">Education_Experience</Label>
                 <Button type="button" onClick={addEdu} variant="outline" size="sm" className="h-6 text-[10px] border-primary/20">ADD_EDU</Button>
              </div>
              {form.education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-primary/10 bg-primary/5 space-y-3 relative">
                   <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-destructive" onClick={() => removeEdu(idx)}><Trash2 className="h-3 w-3" /></Button>
                   <Input placeholder="University/School" value={edu.school} onChange={e => updateEdu(idx, "school", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                   <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Degree" value={edu.degree} onChange={e => updateEdu(idx, "degree", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                      <Input placeholder="Field of Study" value={edu.field} onChange={e => updateEdu(idx, "field", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Start Year" value={edu.startYear} onChange={e => updateEdu(idx, "startYear", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                      <Input placeholder="End Year" value={edu.endYear} onChange={e => updateEdu(idx, "endYear", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="EMAIL" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
              <Input placeholder="GITHUB" value={form.github} onChange={e=>setForm({...form, github: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
              <Input placeholder="LOCATION" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
              <Input placeholder="LINKEDIN" value={form.linkedin} onChange={e=>setForm({...form, linkedin: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground h-9 text-xs">
              {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
              COMMIT_CHANGES
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

const defaultImpactMetrics = [
  { id: "models", label: "Total Models Built", value: 127, suffix: "+", icon: "Brain", color: "#00f0ff", description: "Production-ready AI models deployed" },
  { id: "datasets", label: "Datasets Processed", value: 50, suffix: "TB+", icon: "Database", color: "#a855f7", description: "Training data curated and processed" },
  { id: "accuracy", label: "Accuracy Improvements", value: 23, suffix: "%", icon: "Target", color: "#22c55e", description: "Average improvement over baselines" },
  { id: "experiments", label: "Research Experiments", value: 2500, suffix: "+", icon: "FlaskConical", color: "#f59e0b", description: "Controlled experiments conducted" }
]

function ImpactMetricsManager() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if(data?.impactMetrics && data.impactMetrics.length > 0) {
        setMetrics(data.impactMetrics)
      } else {
        setMetrics([])
      }
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ impactMetrics: metrics })
      })
      if(res.ok) {
        toast({ title: "SUCCESS", description: "Impact metrics synchronized." })
      } else {
        toast({ title: "ERROR", description: "Sync failure.", variant: "destructive" })
      }
    } catch (e) { toast({ title: "ERROR", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  const loadDefaults = () => {
    setMetrics(defaultImpactMetrics)
    toast({ title: "LOADED", description: "Default metrics template applied." })
  }

  const addMetric = () => {
    setMetrics([...metrics, { id: Date.now().toString(), label: "NEW_METRIC", value: 0, suffix: "+", icon: "Brain", color: "#00f0ff", description: "DESCRIPTION" }])
  }

  const removeMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id))
  }

  const updateMetric = (id: string, field: string, val: any) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, [field]: val } : m))
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-primary uppercase">Impact_Metrics</h2>
        <div className="flex gap-2">
          <Button onClick={loadDefaults} variant="outline" size="sm" className="text-[10px] h-7 border-primary/30">LOAD_DEFAULTS</Button>
          <Button onClick={addMetric} size="sm" className="bg-primary/20 text-primary border border-primary/50 text-[10px] h-7">
            <Plus className="w-3 h-3 mr-1" /> ADD_NODE
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {metrics.map(m => (
          <Card key={m.id} className="border-primary/10 bg-card/10">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px]">LABEL</Label>
                  <Input value={m.label} onChange={e => updateMetric(m.id, "label", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">VALUE</Label>
                  <Input type="number" value={m.value} onChange={e => updateMetric(m.id, "value", parseFloat(e.target.value))} className="h-7 text-[10px] bg-background/50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">SUFFIX</Label>
                  <Input value={m.suffix} onChange={e => updateMetric(m.id, "suffix", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">COLOR_HEX</Label>
                  <Input value={m.color} onChange={e => updateMetric(m.id, "color", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px]">DESCRIPTION</Label>
                  <Input value={m.description} onChange={e => updateMetric(m.id, "description", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
                <div className="space-y-1 w-24">
                  <Label className="text-[10px]">ICON</Label>
                  <Input value={m.icon} onChange={e => updateMetric(m.id, "icon", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeMetric(m.id)} className="text-destructive h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleSave} disabled={loading} className="w-full text-xs h-9">
        {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
        SYNC_METRICS
      </Button>
    </div>
  )
}

const defaultPerformanceMetrics = [
  { label: "Inference Latency", value: 15, unit: "ms", target: 20, better: "lower" },
  { label: "Training Efficiency", value: 94, unit: "%", target: 90, better: "higher" },
  { label: "Model Accuracy", value: 98.7, unit: "%", target: 95, better: "higher" },
  { label: "GPU Utilization", value: 96, unit: "%", target: 85, better: "higher" }
]

function PerformanceMetricsManager() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if(data?.performanceMetrics) setMetrics(data.performanceMetrics)
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ performanceMetrics: metrics })
      })
      if(res.ok) toast({ title: "SUCCESS", description: "Performance data saved." })
    } catch (e) { toast({ title: "ERROR", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  const loadDefaults = () => {
    setMetrics(defaultPerformanceMetrics)
    toast({ title: "LOADED", description: "Default performance metrics applied." })
  }

  const addMetric = () => {
    setMetrics([...metrics, { label: "NEW_METRIC", value: 0, unit: "%", target: 100, better: "higher" }])
  }

  const removeMetric = (idx: number) => {
    setMetrics(metrics.filter((_, i) => i !== idx))
  }

  const updateMetric = (idx: number, field: string, val: any) => {
    setMetrics(metrics.map((m, i) => i === idx ? { ...m, [field]: val } : m))
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-primary uppercase">Performance_Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={loadDefaults} variant="outline" size="sm" className="text-[10px] h-7 border-primary/30">LOAD_DEFAULTS</Button>
          <Button onClick={addMetric} size="sm" className="bg-primary/20 text-primary border border-primary/50 text-[10px] h-7">
            <Plus className="w-3 h-3 mr-1" /> ADD_CHART
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="border-primary/10 bg-card/10">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-2 space-y-1">
                <Label className="text-[10px]">LABEL</Label>
                <Input value={m.label} onChange={e => updateMetric(idx, "label", e.target.value)} className="h-7 text-[10px] bg-background/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">VALUE</Label>
                <Input type="number" value={m.value} onChange={e => updateMetric(idx, "value", parseFloat(e.target.value))} className="h-7 text-[10px] bg-background/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">UNIT</Label>
                <Input value={m.unit} onChange={e => updateMetric(idx, "unit", e.target.value)} className="h-7 text-[10px] bg-background/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">TARGET</Label>
                <Input type="number" value={m.target} onChange={e => updateMetric(idx, "target", parseFloat(e.target.value))} className="h-7 text-[10px] bg-background/50" />
              </div>
              <div className="flex gap-2">
                <select className="flex h-7 w-full rounded-md border border-input bg-background/50 px-1 py-0 text-[10px]" value={m.better} onChange={e => updateMetric(idx, "better", e.target.value)}>
                   <option value="higher">HI_BETTER</option>
                   <option value="lower">LO_BETTER</option>
                </select>
                <Button variant="ghost" size="icon" onClick={() => removeMetric(idx)} className="text-destructive h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleSave} disabled={loading} className="w-full text-xs h-9">
        {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
        UPDATE_DASHBOARD
      </Button>
    </div>
  )
}

const defaultResearchActivity = [
  { month: "Jan", count: 12 }, { month: "Feb", count: 19 }, { month: "Mar", count: 15 }, { month: "Apr", count: 25 },
  { month: "May", count: 22 }, { month: "Jun", count: 30 }, { month: "Jul", count: 28 }, { month: "Aug", count: 35 },
  { month: "Sep", count: 40 }, { month: "Oct", count: 38 }, { month: "Nov", count: 45 }, { month: "Dec", count: 52 }
]

function ResearchActivityManager() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(res => {
      if(res?.researchActivity && res.researchActivity.length > 0) {
        setData(res.researchActivity)
      } else {
        setData(defaultResearchActivity)
      }
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ researchActivity: data })
      })
      if(res.ok) toast({ title: "SUCCESS", description: "Activity timeline updated." })
    } catch (e) { toast({ title: "ERROR", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  const updateCount = (month: string, val: string) => {
    setData(data.map(d => d.month === month ? { ...d, count: parseInt(val) || 0 } : d))
  }

  const loadDefaults = () => {
    setData(defaultResearchActivity)
    toast({ title: "LOADED", description: "Default activity data applied." })
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-primary uppercase">Activity_Graph</h2>
        <Button onClick={loadDefaults} variant="outline" size="sm" className="text-[10px] h-7 border-primary/30">LOAD_DEFAULTS</Button>
      </div>
      <Card className="border-primary/10 bg-card/10">
        <CardContent className="p-6 grid grid-cols-3 md:grid-cols-6 gap-4">
          {data.map(d => (
            <div key={d.month} className="space-y-2">
              <Label className="text-[10px] font-mono">{d.month.toUpperCase()}</Label>
              <Input type="number" value={d.count} onChange={e => updateCount(d.month, e.target.value)} className="h-7 text-xs bg-background/50 border-primary/10" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={loading} className="w-full text-xs h-9">
        {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
        SYNC_GRAPH
      </Button>
    </div>
  )
}

function HighlightsManager() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if(data?.highlights) setHighlights(data.highlights)
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ highlights })
      })
      if(res.ok) toast({ title: "SUCCESS", description: "Highlights synchronized." })
    } catch (e) { toast({ title: "ERROR", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  const addHighlight = () => {
    setHighlights([...highlights, { label: "NEW_LABEL", value: "VALUE", icon: "Code" }])
  }

  const removeHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx))
  }

  const updateHighlight = (idx: number, field: string, val: string) => {
    setHighlights(highlights.map((h, i) => i === idx ? { ...h, [field]: val } : h))
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-primary uppercase">Profile_Highlights</h2>
        <Button onClick={addHighlight} size="sm" className="bg-primary/20 text-primary border border-primary/50 text-[10px] h-7">
          <Plus className="w-3 h-3 mr-1" /> ADD_ITEM
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {highlights.map((h, idx) => (
          <Card key={idx} className="border-primary/10 bg-card/10">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">VALUE</Label>
                  <Input value={h.value} onChange={e => updateHighlight(idx, "value", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">LABEL</Label>
                  <Input value={h.label} onChange={e => updateHighlight(idx, "label", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px]">ICON (Lucide)</Label>
                  <Input value={h.icon} onChange={e => updateHighlight(idx, "icon", e.target.value)} className="h-7 text-[10px] bg-background/50" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeHighlight(idx)} className="text-destructive h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleSave} disabled={loading} className="w-full text-xs h-9">
        {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
        SAVE_HIGHLIGHTS
      </Button>
    </div>
  )
}

function ProjectManager({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const emptyForm = { title: "", shortDescription: "", fullDescription: "", categories: [] as string[], technologies: [] as string[], status: "Completed", githubUrl: "", projectUrl: "", architectureString: "", images: [] as string[] }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    const res = await fetch("/api/projects")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if(res.ok) {
        toast({ title: "SUCCESS", description: editingId ? "Project updated." : "Project deployed." })
        setForm(emptyForm)
        setEditingId(null)
        loadItems()
        onUpdate()
      }
    } catch (e) { toast({ title: "ERROR", variant: "destructive" }) } 
    finally { setLoading(false) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item._id)
    setForm({ title: item.title||"", shortDescription: item.shortDescription||"", fullDescription: item.fullDescription||"", categories: item.categories||[], technologies: item.technologies||[], status: item.status||"Completed", githubUrl: item.githubUrl||"", projectUrl: item.projectUrl||"", architectureString: item.architectureString||"", images: item.images||[] })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this?")) return
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    toast({ title: "DELETED", description: "Node removed from registry." })
    loadItems()
    onUpdate()
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-primary uppercase text-sm">
            {editingId ? "Edit_Project" : "New_Project"}
            {editingId && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => {setEditingId(null); setForm(emptyForm)}}>CANCEL</Button>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input placeholder="TITLE" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            <Input placeholder="SHORT_DESC" value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            <Textarea placeholder="FULL_DESC" value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[10px]">CATEGORIES</Label><TagInput tags={form.categories} setTags={t => setForm({...form, categories: t})} /></div>
              <div><Label className="text-[10px]">TECH_STACK</Label><TagInput tags={form.technologies} setTags={t => setForm({...form, technologies: t})} /></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="GITHUB_URL" value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="LIVE_URL" value={form.projectUrl} onChange={e => setForm({...form, projectUrl: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
              <select className="flex h-8 w-full rounded-md border border-primary/20 bg-background/50 px-2 py-1 text-xs" value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
                <option value="Completed">COMPLETED</option>
                <option value="In Progress">IN_PROGRESS</option>
                <option value="Planned">PLANNED</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-[10px]">ARCH_FLOW (A-&gt;B-&gt;C)</Label><Input value={form.architectureString} onChange={e => setForm({...form, architectureString: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" /></div>
              <div className="space-y-2"><Label className="text-[10px]">IMG_URLS</Label><TagInput tags={form.images} setTags={t => setForm({...form, images: t})} /></div>
            </div>

            <Button type="submit" disabled={loading} className="w-full text-xs h-9">
              {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
              {editingId ? "UPDATE_NODE" : "REGISTER_PROJECT"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="grid gap-4">
        {items.map(item => (
          <Card key={item._id} className={`flex justify-between items-center p-4 border-primary/10 bg-card/5 ${editingId === item._id ? 'border-primary ring-1 ring-primary' : ''}`}>
            <div><h3 className="font-bold text-xs uppercase tracking-tight">{item.title}</h3><p className="text-[10px] text-muted-foreground">{item.shortDescription}</p></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ExperienceManager({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const emptyForm = { company: "", role: "", startDate: "", endDate: "", current: false, description: "", technologies: [] as string[] }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadItems() }, [])
  const loadItems = async () => {
    const res = await fetch("/api/experience")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, description: form.description.split("\n").filter(Boolean) }
      const url = editingId ? `/api/experience/${editingId}` : "/api/experience"
      const method = editingId ? "PUT" : "POST"
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      toast({ title: "SUCCESS", description: "Registry updated." })
      setForm(emptyForm); setEditingId(null); loadItems(); onUpdate()
    } catch (e) { toast({ title: "ERROR", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item._id)
    setForm({ company: item.company||"", role: item.role||"", startDate: item.startDate||"", endDate: item.endDate||"", current: item.current||false, description: item.description?item.description.join("\n"):"", technologies: item.technologies||[] })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Delete?")) return
    await fetch(`/api/experience/${id}`, { method: "DELETE" }); 
    toast({ title: "DELETED", description: "Node purged." })
    loadItems(); onUpdate()
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-primary uppercase text-sm">
            {editingId ? "Edit_History" : "New_History"}
            {editingId && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => {setEditingId(null); setForm(emptyForm)}}>CANCEL</Button>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="COMPANY" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="ROLE" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <Input placeholder="START_DATE" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="END_DATE" value={form.endDate} disabled={form.current} onChange={e => setForm({...form, endDate: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
              <div className="flex items-center gap-2">
                <Switch checked={form.current} onCheckedChange={c => setForm({...form, current: c, endDate: c ? "" : form.endDate})} />
                <Label className="text-[10px]">CURRENT</Label>
              </div>
            </div>
            <Textarea placeholder="DESC (New line for bullets)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            <Label className="text-[10px]">TECHNOLOGIES</Label>
            <TagInput tags={form.technologies} setTags={t => setForm({...form, technologies: t})} />
            <Button type="submit" disabled={loading} className="w-full text-xs h-9">
              {loading ? <Spinner className="mr-2 h-3 w-3" /> : <Save className="mr-2 h-3 w-3" />}
              {editingId ? "UPDATE_ENTRY" : "SAVE_HISTORY"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {items.map(item => (
          <Card key={item._id} className={`flex justify-between items-center p-4 border-primary/10 bg-card/5 ${editingId === item._id ? 'border-primary ring-1 ring-primary' : ''}`}>
            <div><h3 className="font-bold text-xs uppercase">{item.role} @ {item.company}</h3></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ResearchManager({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const emptyForm = { title: "", description: "", date: "", venue: "", impact: "", type: "paper" }
  const [form, setForm] = useState(emptyForm)
  const { toast } = useToast()

  useEffect(() => { loadItems() }, [])
  const loadItems = async () => {
    const res = await fetch("/api/research")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/research/${editingId}` : "/api/research"
    const method = editingId ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    toast({ title: "SUCCESS", description: "Timeline updated." })
    setForm(emptyForm); setEditingId(null); loadItems(); onUpdate()
  }
  const handleEdit = (item: any) => { setEditingId(item._id); setForm({ title: item.title||"", description: item.description||"", date: item.date||"", venue: item.venue||"", impact: item.impact||"", type: item.type||"paper" }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = async (id: string) => { 
    if(confirm("Delete?")){ 
      await fetch(`/api/research/${id}`, { method: "DELETE" }); 
      toast({ title: "DELETED", description: "Node removed." })
      loadItems(); onUpdate() 
    } 
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10">
        <CardHeader><CardTitle className="flex justify-between items-center text-primary uppercase text-sm">{editingId ? "Edit_Timeline" : "Add_Timeline"} {editingId && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => {setEditingId(null); setForm(emptyForm)}}>CANCEL</Button>}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input placeholder="TITLE" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            <Textarea placeholder="DESCRIPTION" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="VENUE (OPTIONAL)" value={form.venue} onChange={e=>setForm({...form, venue: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px]">IMPACT_METRICS</Label>
              <Input placeholder="E.G. PUBLISHED IN Q1 JOURNAL..." value={form.impact} onChange={e=>setForm({...form, impact: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <Button type="submit" className="w-full text-xs h-9">SYNC_TIMELINE</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {items.map(i => (
          <Card key={i._id} className="flex justify-between items-center p-4 border-primary/10 bg-card/5">
            <div><h3 className="font-bold text-xs uppercase">{i.title}</h3><p className="text-[10px]">{i.date}</p></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(i)} className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(i._id)} className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PublicationManager({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const emptyForm = { title: "", venue: "", year: new Date().getFullYear(), abstract: "", status: "Published", doi: "", citations: 0, tags: [] as string[] }
  const [form, setForm] = useState(emptyForm)
  const { toast } = useToast()

  useEffect(() => { loadItems() }, [])
  const loadItems = async () => {
    const res = await fetch("/api/publications")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/publications/${editingId}` : "/api/publications"
    const method = editingId ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    toast({ title: "SUCCESS", description: "Publication log updated." })
    setForm(emptyForm); setEditingId(null); loadItems(); onUpdate()
  }
  const handleEdit = (item: any) => { setEditingId(item._id); setForm({ title: item.title||"", venue: item.venue||"", year: item.year||new Date().getFullYear(), abstract: item.abstract||"", status: item.status||"Published", doi: item.doi||"", citations: item.citations||0, tags: item.tags||[] }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = async (id: string) => { 
    if(confirm("Delete?")){ 
      await fetch(`/api/publications/${id}`, { method: "DELETE" }); 
      toast({ title: "DELETED", description: "Node purged." })
      loadItems(); onUpdate() 
    } 
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10">
        <CardHeader><CardTitle className="flex justify-between items-center text-primary uppercase text-sm">{editingId ? "Edit_Paper" : "New_Paper"} {editingId && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => {setEditingId(null); setForm(emptyForm)}}>CANCEL</Button>}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input placeholder="PAPER_TITLE" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            <Textarea placeholder="ABSTRACT" value={form.abstract} onChange={e=>setForm({...form, abstract: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="VENUE" value={form.venue} onChange={e=>setForm({...form, venue: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input type="number" placeholder="YEAR" value={form.year} onChange={e=>setForm({...form, year: parseInt(e.target.value)})} className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <select className="flex h-8 w-full rounded-md border border-primary/20 bg-background/50 px-2 py-1 text-xs" value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
                <option value="Published">PUBLISHED</option>
                <option value="Accepted">ACCEPTED</option>
              </select>
              <Input placeholder="DOI" value={form.doi} onChange={e=>setForm({...form, doi: e.target.value})} disabled={form.status === 'Accepted'} className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input type="number" placeholder="CITATIONS" value={form.citations} onChange={e=>setForm({...form, citations: parseInt(e.target.value)})} disabled={form.status === 'Accepted'} className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <Label className="text-[10px]">TAGS</Label>
            <TagInput tags={form.tags} setTags={t => setForm({...form, tags: t})} />
            <Button type="submit" className="w-full text-xs h-9">SYNC_LOG</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {items.map(i => (
          <Card key={i._id} className="flex justify-between items-center p-4 border-primary/10 bg-card/5">
            <div><h3 className="font-bold text-xs uppercase">{i.title}</h3><p className="text-[10px]">{i.venue} ({i.status})</p></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(i)} className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(i._id)} className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AchievementManager({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const emptyForm = { title: "", description: "", date: "", link: "" }
  const [form, setForm] = useState(emptyForm)
  const { toast } = useToast()

  useEffect(() => { loadItems() }, [])
  const loadItems = async () => {
    const res = await fetch("/api/achievements")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/achievements/${editingId}` : "/api/achievements"
    const method = editingId ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    toast({ title: "SUCCESS", description: "Node saved." })
    setForm(emptyForm); setEditingId(null); loadItems(); onUpdate()
  }
  const handleEdit = (item: any) => { setEditingId(item._id); setForm({ title: item.title||"", description: item.description||"", date: item.date||"", link: item.link||"" }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = async (id: string) => { 
    if(confirm("Delete?")){ 
      await fetch(`/api/achievements/${id}`, { method: "DELETE" }); 
      toast({ title: "DELETED", description: "Registry cleaned." })
      loadItems(); onUpdate() 
    } 
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10">
        <CardHeader><CardTitle className="flex justify-between items-center text-primary uppercase text-sm">{editingId ? "Edit_Achv" : "Add_Achv"} {editingId && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => {setEditingId(null); setForm(emptyForm)}}>CANCEL</Button>}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input placeholder="TITLE" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            <Textarea placeholder="DESCRIPTION" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="bg-background/50 border-primary/10 text-xs" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="DATE (E.G. 2026)" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="LINK (OPTIONAL)" value={form.link} onChange={e=>setForm({...form, link: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <Button type="submit" className="w-full text-xs h-9">COMMIT_ACHV</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {items.map(i => (
          <Card key={i._id} className="flex justify-between items-center p-4 border-primary/10 bg-card/5">
            <div><h3 className="font-bold text-xs uppercase">{i.title}</h3><p className="text-[10px]">{i.date}</p></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(i)} className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(i._id)} className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CertificationManager({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const emptyForm = { title: "", issuer: "", date: "", link: "", imageUrl: "" }
  const [form, setForm] = useState(emptyForm)
  const { toast } = useToast()

  useEffect(() => { loadItems() }, [])
  const loadItems = async () => {
    const res = await fetch("/api/certifications")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/certifications/${editingId}` : "/api/certifications"
    const method = editingId ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    toast({ title: "SUCCESS", description: "Credential verified and saved." })
    setForm(emptyForm); setEditingId(null); loadItems(); onUpdate()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm({...form, imageUrl: ev.target?.result as string})
    }
    reader.readAsDataURL(file)
  }

  const handleEdit = (item: any) => { setEditingId(item._id); setForm({ title: item.title||"", issuer: item.issuer||"", date: item.date||"", link: item.link||"", imageUrl: item.imageUrl||"" }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = async (id: string) => { 
    if(confirm("Delete?")){ 
      await fetch(`/api/certifications/${id}`, { method: "DELETE" }); 
      toast({ title: "DELETED", description: "Credential node removed." })
      loadItems(); onUpdate() 
    } 
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <Card className="border-primary/20 bg-card/10">
        <CardHeader><CardTitle className="flex justify-between items-center text-primary uppercase text-sm">{editingId ? "Edit_Cert" : "Add_Cert"} {editingId && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => {setEditingId(null); setForm(emptyForm)}}>CANCEL</Button>}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="CERT_NAME" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="ISSUER" value={form.issuer} onChange={e=>setForm({...form, issuer: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="DATE" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required className="bg-background/50 border-primary/10 text-xs h-8" />
              <Input placeholder="CREDENTIAL_URL" value={form.link} onChange={e=>setForm({...form, link: e.target.value})} className="bg-background/50 border-primary/10 text-xs h-8" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px]">UPLOAD_CERT (IMG)</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-background/50 border-primary/10 text-xs h-8" />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-20 object-contain rounded border border-primary/20 mt-2" />}
            </div>
            <Button type="submit" className="w-full text-xs h-9 text-primary uppercase">Verify_&_Save</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {items.map(i => (
          <Card key={i._id} className="flex justify-between items-center p-4 border-primary/10 bg-card/5">
            <div className="flex items-center gap-4">
              {i.imageUrl && <img src={i.imageUrl} className="w-10 h-10 object-cover rounded" alt="cert" />}
              <div><h3 className="font-bold text-xs uppercase">{i.title}</h3><p className="text-[10px]">{i.issuer} ({i.date})</p></div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(i)} className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(i._id)} className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
