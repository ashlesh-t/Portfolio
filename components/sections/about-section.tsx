"use client"

import useSWR from "swr"
import { ScrollReveal, StaggerContainer, StaggerItem, Parallax } from "@/components/scroll-animations"
import { Brain, Code, Database, Cpu, GraduationCap, Award, Terminal, Sparkles, User, ShieldCheck } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import type { Profile, Project, Research } from "@/lib/models"
import { motion } from "framer-motion"

const iconMap: Record<string, React.ElementType> = {
  Brain, Code, Database, Cpu, GraduationCap, Award, Terminal, Sparkles
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function AboutSection() {
  const { data: profile, isLoading: isProfileLoading } = useSWR<Profile>("/api/profile", fetcher, { revalidateOnFocus: false })

  if (isProfileLoading) {
    return (
      <section id="about" className="py-32 px-6 relative flex justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </section>
    )
  }

  const bio = profile?.bio && profile.bio.length > 0 ? profile.bio : [
    "I am an AI/ML Researcher and Engineer dedicated to building next-generation artificial intelligence systems.",
    "My passion lies in bridging the gap between theoretical research and practical, real-world implementations."
  ]

  const highlights = profile?.highlights && profile.highlights.length > 0 ? profile.highlights : [
    { icon: "GraduationCap", label: "University", value: "Computer Science" },
    { icon: "Award", label: "Experience", value: "3+ Years" },
    { icon: "Brain", label: "Models Built", value: `2+` },
    { icon: "Database", label: "Research", value: `2+` },
  ]

  const aboutTags = profile?.aboutTags && profile.aboutTags.length > 0 ? profile.aboutTags : [
    "Neural Architectures", "Distributed Systems", "RAG & Agentic AI"
  ]

  return (
    <section id="about" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col items-center mb-16">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
                <User className="w-3 h-3" />
                <span>IDENTITY_VERIFIED</span>
             </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-mono tracking-tighter text-center">
              WHO<span className="text-primary glow-text">AMI</span>
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Card */}
          <div className="lg:col-span-8">
            <ScrollReveal>
              <div className="h-full p-8 md:p-12 rounded-[2.5rem] border border-primary/20 bg-card/10 backdrop-blur-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -ml-32 -mb-32 transition-all group-hover:bg-accent/10" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4 border-b border-primary/10 pb-8">
                     <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                        <Brain className="w-10 h-10 text-primary" />
                     </div>
                     <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground font-mono tracking-tight">{profile?.name || "ASHLESH"}</h3>
                        <p className="text-primary font-mono text-sm tracking-widest uppercase">{profile?.title || "AI RESEARCHER & ENGINEER"}</p>
                     </div>
                  </div>

                  <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed font-sans">
                    {bio.map((paragraph, idx) => (
                      <p key={idx} className="relative pl-6">
                        <span className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00ff41]" />
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="pt-8 flex flex-wrap gap-4">
                     {aboutTags.map((tag) => (
                       <div key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-mono text-muted-foreground">{tag}</span>
                       </div>
                     ))}
                  </div>

                  {profile?.education && profile.education.length > 0 && (
                    <div className="pt-8 space-y-4 border-t border-primary/10">
                       <h4 className="text-sm font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Education_Experience
                       </h4>
                       <div className="grid gap-4">
                          {profile.education.map((edu, idx) => (
                            <div key={idx} className="relative pl-6 border-l border-primary/20">
                               <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-primary/40" />
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                  <div className="font-bold text-foreground">{edu.school}</div>
                                  <div className="text-xs font-mono text-muted-foreground">{edu.startYear} — {edu.endYear}</div>
                               </div>
                               <div className="text-sm text-primary/80">{edu.degree} in {edu.field}</div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {highlights.map((item, idx) => {
              const Icon = iconMap[item.icon as string] || Code;
              return (
                <ScrollReveal key={item.label} delay={idx * 0.1}>
                  <div className="p-6 rounded-[2rem] border border-primary/10 bg-card/10 backdrop-blur-xl hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.05)] group relative overflow-hidden h-full flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground font-mono">{item.value}</div>
                      <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{item.label}</div>
                    </div>
                    <div className="absolute right-0 bottom-0 w-12 h-12 bg-primary/5 rounded-tl-full opacity-50" />
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
