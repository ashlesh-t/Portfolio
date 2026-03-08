"use client"

import useSWR from "swr"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations"
import { BookOpen, Users, Quote, ExternalLink, FileText, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface Publication {
  _id: string
  title: string
  authors: string[]
  venue: string
  year: number
  abstract: string
  citations: number
  doi?: string
  links: {
    paper?: string
    code?: string
    slides?: string
  }
  tags: string[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function PublicationsSection() {
  const { data: publications, isLoading } = useSWR<Publication[]>(
    "/api/publications",
    fetcher,
    { revalidateOnFocus: false }
  )
  
  const totalCitations = publications?.reduce((sum, p) => sum + p.citations, 0) || 0
  
  return (
    <section id="publications" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Selected <span className="text-primary">Publications</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Peer-reviewed research in top AI/ML venues
            </p>
            
            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{publications?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Papers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{totalCitations.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Citations</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : publications && publications.length > 0 ? (
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            {publications.map((pub) => (
              <StaggerItem key={pub._id}>
                <PublicationCard publication={pub} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No publications found.
          </div>
        )}
      </div>
    </section>
  )
}

function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
            {publication.title}
          </h3>
          
          {/* Authors */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{publication.authors.join(", ")}</span>
          </div>
          
          {/* Venue and Year */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <span className="text-primary font-medium">{publication.venue}</span>
            <span className="text-muted-foreground">{publication.year}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Quote className="w-3 h-3" />
              {publication.citations} citations
            </span>
          </div>
          
          {/* Abstract excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {publication.abstract}
          </p>
          
          {/* Tags and Links */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {publication.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {publication.links.paper && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs border-border/50 hover:border-primary/50"
                >
                  <a href={publication.links.paper} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
                  </a>
                </Button>
              )}
              {publication.links.code && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs border-border/50 hover:border-primary/50"
                >
                  <a href={publication.links.code} target="_blank" rel="noopener noreferrer">
                    <Code className="w-3 h-3 mr-1" />
                    Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
