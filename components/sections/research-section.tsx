"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleOnScroll } from "@/components/scroll-animations"
import { Calendar, BookOpen, Award, Users, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface ResearchItem {
  _id: string
  title: string
  description: string
  date: string
  type: "paper" | "talk" | "award" | "milestone"
  venue?: string
  authors?: string[]
  citations?: number
  links?: {
    paper?: string
    slides?: string
    video?: string
    code?: string
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const typeConfig = {
  paper: { icon: BookOpen, color: "#00f0ff", label: "Publication" },
  talk: { icon: Users, color: "#a855f7", label: "Talk" },
  award: { icon: Award, color: "#f59e0b", label: "Award" },
  milestone: { icon: Calendar, color: "#22c55e", label: "Milestone" },
}

export function ResearchSection() {
  const { data: research, isLoading } = useSWR<ResearchItem[]>(
    "/api/research",
    fetcher,
    { revalidateOnFocus: false }
  )
  
  return (
    <section id="research" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Research <span className="text-primary">Timeline</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A journey through publications, talks, and research milestones
            </p>
          </div>
        </ScrollReveal>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : research && research.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50" />
            
            <div className="space-y-12">
              {research.map((item, index) => (
                <TimelineItem key={item._id} item={item} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No research items found.
          </div>
        )}
      </div>
    </section>
  )
}

function TimelineItem({ item, index }: { item: ResearchItem; index: number }) {
  const config = typeConfig[item.type]
  const isEven = index % 2 === 0
  
  return (
    <ScaleOnScroll>
      <div className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
        {/* Timeline dot */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full border-2 bg-background z-10"
          style={{ borderColor: config.color }}
        />
        
        {/* Content */}
        <div className={`w-full md:w-1/2 ${isEven ? "md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <config.icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDate(item.date)}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            
            {/* Venue */}
            {item.venue && (
              <p className="text-sm text-primary mb-2">{item.venue}</p>
            )}
            
            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3">
              {item.description}
            </p>
            
            {/* Authors */}
            {item.authors && item.authors.length > 0 && (
              <p className="text-xs text-muted-foreground mb-3">
                {item.authors.join(", ")}
              </p>
            )}
            
            {/* Citations & Links */}
            <div className="flex items-center justify-between">
              {item.citations !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {item.citations} citations
                </span>
              )}
              
              {item.links && (
                <div className="flex items-center gap-2">
                  {item.links.paper && (
                    <LinkButton href={item.links.paper} label="Paper">
                      <FileText className="w-3 h-3" />
                    </LinkButton>
                  )}
                  {item.links.code && (
                    <LinkButton href={item.links.code} label="Code">
                      <ExternalLink className="w-3 h-3" />
                    </LinkButton>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ScaleOnScroll>
  )
}

function LinkButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
    >
      <a href={href} target="_blank" rel="noopener noreferrer" title={label}>
        {children}
      </a>
    </Button>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}
