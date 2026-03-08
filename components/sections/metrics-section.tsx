"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations"
import { TrendingUp, Brain, Database, FlaskConical, Target, Zap, BarChart3, LineChart, Cpu, Terminal } from "lucide-react"
import useSWR from "swr"
import type { Profile } from "@/lib/models"
import { Spinner } from "@/components/ui/spinner"

interface Metric {
  id: string
  label: string
  value: number
  suffix: string
  icon: string
  color: string
  description: string
}

const iconMap: Record<string, any> = {
  Brain, Database, Target, FlaskConical, Zap, Cpu, Terminal, TrendingUp
}

const defaultImpactMetrics: Metric[] = [
  {
    id: "models",
    label: "Total Models Built",
    value: 127,
    suffix: "+",
    icon: "Brain",
    color: "#00f0ff",
    description: "Production-ready AI models deployed"
  },
  {
    id: "datasets",
    label: "Datasets Processed",
    value: 50,
    suffix: "TB+",
    icon: "Database",
    color: "#a855f7",
    description: "Training data curated and processed"
  },
  {
    id: "accuracy",
    label: "Accuracy Improvements",
    value: 23,
    suffix: "%",
    icon: "Target",
    color: "#22c55e",
    description: "Average improvement over baselines"
  },
  {
    id: "experiments",
    label: "Research Experiments",
    value: 2500,
    suffix: "+",
    icon: "FlaskConical",
    color: "#f59e0b",
    description: "Controlled experiments conducted"
  },
]

const defaultPerformanceMetrics = [
  { label: "Inference Latency", value: 15, unit: "ms", target: 20, better: "lower" as const },
  { label: "Training Efficiency", value: 94, unit: "%", target: 90, better: "higher" as const },
  { label: "Model Accuracy", value: 98.7, unit: "%", target: 95, better: "higher" as const },
  { label: "GPU Utilization", value: 96, unit: "%", target: 85, better: "higher" as const },
]

const defaultResearchActivity = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 19 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 25 },
  { month: "May", count: 22 },
  { month: "Jun", count: 30 },
  { month: "Jul", count: 28 },
  { month: "Aug", count: 35 },
  { month: "Sep", count: 40 },
  { month: "Oct", count: 38 },
  { month: "Nov", count: 45 },
  { month: "Dec", count: 52 },
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function MetricsSection() {
  const { data: profile, isLoading } = useSWR<Profile>("/api/profile", fetcher)

  if (isLoading) {
    return (
      <section id="metrics" className="py-32 px-6 flex justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </section>
    )
  }

  const impactMetrics = profile?.impactMetrics && profile.impactMetrics.length > 0 
    ? profile.impactMetrics 
    : defaultImpactMetrics

  const performanceMetrics = profile?.performanceMetrics && profile.performanceMetrics.length > 0 
    ? profile.performanceMetrics 
    : defaultPerformanceMetrics

  const researchActivity = profile?.researchActivity && profile.researchActivity.length > 0 
    ? profile.researchActivity 
    : defaultResearchActivity

  return (
    <section id="metrics" className="py-32 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Research <span className="text-primary">Impact</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quantifying the impact of AI research and engineering
            </p>
          </div>
        </ScrollReveal>
        
        {/* Main metrics grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" staggerDelay={0.1}>
          {impactMetrics.map((metric) => (
            <StaggerItem key={metric.id}>
              <MetricCard metric={metric} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        
        {/* Performance dashboard */}
        <ScrollReveal delay={0.2}>
          <div className="p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Performance Metrics</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {performanceMetrics.map((metric, idx) => (
                <PerformanceBar key={metric.label} metric={metric} delay={idx * 0.1} />
              ))}
            </div>
          </div>
        </ScrollReveal>
        
        {/* Activity graph */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <LineChart className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Research Activity</h3>
            </div>
            <ActivityChart data={researchActivity} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function MetricCard({ metric }: { metric: any }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const Icon = iconMap[metric.icon] || Brain
  
  useEffect(() => {
    if (!isInView) return
    
    const duration = 2000
    const steps = 60
    const increment = metric.value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= metric.value) {
        setCount(metric.value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [isInView, metric.value])
  
  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden group"
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(circle at center, ${metric.color}10 0%, transparent 70%)`
        }}
      />
      
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${metric.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: metric.color }} />
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span 
            className="text-4xl font-bold"
            style={{ color: metric.color }}
          >
            {count}
          </span>
          <span className="text-xl text-muted-foreground">{metric.suffix}</span>
        </div>
        
        <h4 className="font-semibold text-foreground mb-1">{metric.label}</h4>
        <p className="text-sm text-muted-foreground">{metric.description}</p>
      </div>
    </motion.div>
  )
}

function PerformanceBar({ 
  metric, 
  delay 
}: { 
  metric: any
  delay: number 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  
  const percentage = Math.min(100, (metric.value / (metric.target * 1.2)) * 100)
  const isGood = metric.better === "higher" 
    ? metric.value >= metric.target 
    : metric.value <= metric.target
  
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">{metric.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {metric.value}{metric.unit}
          </span>
          {isGood && (
            <TrendingUp className="w-4 h-4 text-green-400" />
          )}
        </div>
      </div>
      
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isGood 
              ? "bg-gradient-to-r from-primary to-accent"
              : "bg-gradient-to-r from-yellow-500 to-orange-500"
          }`}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Target: {metric.target}{metric.unit}</span>
        <span className={isGood ? "text-green-400" : "text-yellow-400"}>
          {isGood ? "On Track" : "Improving"}
        </span>
      </div>
    </div>
  )
}

function ActivityChart({ data }: { data: any[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  
  const maxValue = Math.max(...data.map(d => d.count), 1)
  
  return (
    <div ref={ref} className="h-48">
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, idx) => {
          const height = (item.count / maxValue) * 100
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: `${height}%` } : { height: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="w-full rounded-t-md bg-gradient-to-t from-primary/50 to-primary hover:from-primary hover:to-accent transition-colors cursor-pointer"
                title={`${item.month}: ${item.count} contributions`}
              />
              <span className="text-xs text-muted-foreground">{item.month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
