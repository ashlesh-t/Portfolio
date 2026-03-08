"use client"

import useSWR from "swr"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations"
import { ArchitectureDiagram, DetailedArchitecture } from "@/components/architecture-diagram"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Project {
  _id: string
  title: string
  shortDescription: string
  fullDescription: string
  category: string
  technologies: string[]
  status: string
  metrics: {
    accuracy?: number
    performance?: string
    impact?: string
  }
  githubUrl?: string
  demoUrl?: string
  paperUrl?: string
  architecture: {
    name: string
    components: string[]
  }[]
  featured: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const categories = ["All", "Computer Vision", "NLP", "Deep Learning", "MLOps"]

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  
  const { data: projects, isLoading } = useSWR<Project[]>(
    "/api/projects",
    fetcher,
    { revalidateOnFocus: false }
  )
  
  const filteredProjects = projects?.filter(
    p => selectedCategory === "All" || p.category === selectedCategory
  )
  
  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Research <span className="text-primary">Projects</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Cutting-edge AI implementations with real-world impact
            </p>
            
            {/* Category filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat 
                    ? "bg-primary text-primary-foreground" 
                    : "border-border/50 hover:border-primary/50"
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </ScrollReveal>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <StaggerContainer className="space-y-8" staggerDelay={0.15}>
            {filteredProjects.map((project) => (
              <StaggerItem key={project._id}>
                <ProjectCard
                  project={project}
                  isExpanded={expandedProject === project._id}
                  onToggle={() => setExpandedProject(
                    expandedProject === project._id ? null : project._id
                  )}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No projects found for this category.
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ 
  project, 
  isExpanded, 
  onToggle 
}: { 
  project: Project
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      layout
      className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-colors"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {project.featured && (
                <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                  Featured
                </span>
              )}
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                {project.category}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === "Completed" 
                  ? "bg-green-500/20 text-green-400"
                  : project.status === "In Progress"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              {project.title}
            </h3>
            <p className="text-muted-foreground">{project.shortDescription}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/50">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/50">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        
        {/* Architecture Diagram - Always visible */}
        <div className="mb-6">
          <ArchitectureDiagram />
        </div>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm rounded-full border border-border/50 text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Metrics */}
        {project.metrics && (
          <div className="flex flex-wrap gap-4 mb-4">
            {project.metrics.accuracy && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{project.metrics.accuracy}%</span>
                <span className="text-sm text-muted-foreground">Accuracy</span>
              </div>
            )}
            {project.metrics.performance && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-accent">{project.metrics.performance}</span>
                <span className="text-sm text-muted-foreground">Performance</span>
              </div>
            )}
            {project.metrics.impact && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{project.metrics.impact}</span>
                <span className="text-sm text-muted-foreground">Impact</span>
              </div>
            )}
          </div>
        )}
        
        {/* Expand button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full mt-2 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              View Architecture Details
            </>
          )}
        </Button>
        
        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-border/50 mt-6">
                <p className="text-muted-foreground mb-6">{project.fullDescription}</p>
                
                {project.architecture && project.architecture.length > 0 && (
                  <DetailedArchitecture
                    title="Model Architecture"
                    layers={project.architecture}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
