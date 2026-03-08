"use client"

import { ScrollReveal, StaggerContainer, StaggerItem, Parallax } from "@/components/scroll-animations"
import { Brain, Code, Database, Cpu, GraduationCap, Award } from "lucide-react"

const skills = [
  { name: "Deep Learning", icon: Brain, level: 95 },
  { name: "Computer Vision", icon: Cpu, level: 90 },
  { name: "NLP", icon: Code, level: 88 },
  { name: "Big Data", icon: Database, level: 85 },
]

const highlights = [
  { icon: GraduationCap, label: "PhD Stanford", value: "AI/ML" },
  { icon: Award, label: "Publications", value: "45+" },
  { icon: Brain, label: "Models Built", value: "120+" },
  { icon: Database, label: "Datasets", value: "50TB+" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-primary">Me</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pioneering AI research at the intersection of theory and application
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Parallax offset={30}>
            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I am a Senior AI Research Scientist with over 8 years of experience in developing 
                  state-of-the-art machine learning models. My work focuses on advancing neural 
                  network architectures for computer vision and natural language understanding.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Currently leading research initiatives at a Fortune 500 tech company, where I 
                  design and implement scalable AI solutions that process petabytes of data daily.
                </p>
                
                {/* Skill bars */}
                <div className="space-y-4 pt-6">
                  {skills.map((skill, idx) => (
                    <SkillBar key={skill.name} skill={skill} delay={idx * 0.1} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </Parallax>
          
          <StaggerContainer className="grid grid-cols-2 gap-6" staggerDelay={0.15}>
            {highlights.map((item) => (
              <StaggerItem key={item.label}>
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}

function SkillBar({ skill, delay }: { skill: typeof skills[0]; delay: number }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <skill.icon className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{skill.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">{skill.level}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
            style={{ width: `${skill.level}%` }}
          />
        </div>
      </div>
    </ScrollReveal>
  )
}
