"use client"

import useSWR from "swr"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ChevronDown, ChevronUp, Link as LinkIcon, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Project {
  _id: string
  title: string
  shortDescription: string
  fullDescription: string
  categories: string[]
  technologies: string[]
  status: string
  metrics?: {
    accuracy?: number
    performance?: string
    impact?: string
  }
  githubUrl?: string
  demoUrl?: string
  projectUrl?: string
  paperUrl?: string
  architectureString?: string
  images?: string[]
  featured: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  
  const { data: projects, isLoading } = useSWR<Project[]>(
    "/api/projects",
    fetcher,
    { revalidateOnFocus: false }
  )

  // Extract unique categories
  const allCategories = projects 
    ? Array.from(new Set(projects.flatMap(p => p.categories || []))) 
    : []
  const filterCategories = ["All", ...allCategories]
  
  const filteredProjects = projects?.filter(
    p => selectedCategory === "All" || (p.categories && p.categories.includes(selectedCategory))
  )
  
  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono text-primary">
              &gt; _projects
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Production-grade systems, AI models, and software architectures.
            </p>
            
            {/* Category filters */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {filterCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat 
                      ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,255,65,0.5)]" 
                      : "border-primary/30 text-foreground hover:border-primary/80 hover:text-primary bg-background/50"
                    }
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
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
            No projects found. Add some from the admin dashboard.
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
  const parseArchitecture = (arch: string) => {
    if (!arch) return []
    // Split by -> and clean quotes if any
    return arch.split("->").map(step => step.trim().replace(/^["']|["']$/g, ''))
  }

  const architectureFlow = project.architectureString ? parseArchitecture(project.architectureString) : []
  const hasImages = project.images && project.images.length > 0
  const [currentImgIdx, setCurrentImgIdx] = useState(0)

  const nextImg = () => {
    if(project.images) setCurrentImgIdx((p) => (p + 1) % project.images!.length)
  }
  const prevImg = () => {
    if(project.images) setCurrentImgIdx((p) => (p - 1 + project.images!.length) % project.images!.length)
  }

  return (
    <motion.div
      layout
      className="rounded-2xl border border-primary/20 bg-card/10 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] group"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.featured && (
                <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30 font-mono">
                  ★ Featured
                </span>
              )}
              {project.categories?.map(cat => (
                <span key={cat} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30 font-mono">
                  {cat}
                </span>
              ))}
              {project.status && (
                <span className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-full border ${
                  project.status.toLowerCase() === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  project.status.toLowerCase() === 'in progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    project.status.toLowerCase() === 'completed' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' :
                    project.status.toLowerCase() === 'in progress' ? 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]' :
                    'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]'
                  }`} />
                  {project.status}
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground">{project.shortDescription}</p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild className="border-primary/30 hover:border-primary hover:text-primary bg-background/50">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="View Source">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
            {project.projectUrl && (
              <Button variant="outline" size="sm" asChild className="border-primary/30 hover:border-primary hover:text-primary bg-background/50">
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" title="Project Link">
                  <LinkIcon className="w-4 h-4" />
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button variant="outline" size="sm" asChild className="border-primary/30 hover:border-primary hover:text-primary bg-background/50">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {/* Expand button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full mt-2 text-primary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all font-mono"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              hide_details()
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              show_details()
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
              <div className="pt-6 border-t border-primary/20 mt-6 space-y-8">
                {/* Full Description */}
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {project.fullDescription.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Architecture Flow */}
                {architectureFlow.length > 0 && (
                  <div className="bg-background/50 p-6 rounded-xl border border-primary/20">
                    <h4 className="text-sm font-bold text-primary mb-4 font-mono uppercase tracking-wider">System Flow</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {architectureFlow.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-card rounded-lg border border-border/50 text-sm font-mono whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                            {step}
                          </div>
                          {idx < architectureFlow.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Image Carousel */}
                {hasImages && project.images && (
                  <div className="relative rounded-xl overflow-hidden border border-border/50 bg-black/50 aspect-video flex items-center justify-center group/carousel">
                    <img 
                      src={project.images[currentImgIdx]} 
                      alt={`${project.title} screenshot ${currentImgIdx + 1}`} 
                      className="max-w-full max-h-full object-contain"
                    />
                    
                    {project.images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImg}
                          className="absolute left-4 p-2 rounded-full bg-background/80 text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={nextImg}
                          className="absolute right-4 p-2 rounded-full bg-background/80 text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {project.images.map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`w-2 h-2 rounded-full transition-all ${idx === currentImgIdx ? 'bg-primary scale-125' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
