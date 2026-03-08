"use client"

import useSWR from "swr"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations"
import { Briefcase, Calendar } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Experience {
  _id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
  technologies: string[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ExperienceSection() {
  const { data: experience, isLoading } = useSWR<Experience[]>(
    "/api/experience",
    fetcher,
    { revalidateOnFocus: false }
  )

  return (
    <section id="experience" className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Work <span className="text-primary">Experience</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              My professional journey in software engineering and AI
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : experience && experience.length > 0 ? (
          <StaggerContainer className="relative border-l border-border/50 ml-4 md:ml-8 space-y-12">
            {experience.map((exp, idx) => (
              <StaggerItem key={exp._id || idx} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[17px] md:-left-[21px] top-1 p-2 rounded-full bg-card border border-border/50 text-primary">
                  <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                
                <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                      <div className="text-primary font-medium">{exp.company}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full w-fit">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                  </div>
                  
                  {exp.description && exp.description.length > 0 && (
                    <ul className="space-y-3 mb-6 text-muted-foreground list-disc list-inside ml-4">
                      {exp.description.map((item, i) => (
                        <li key={i} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  )}
                  
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map(tech => (
                        <span key={tech} className="px-3 py-1 text-xs rounded-full border border-border/50 text-muted-foreground bg-background/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No experience data found.
          </div>
        )}
      </div>
    </section>
  )
}
