"use client"

import useSWR from "swr"
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleOnScroll } from "@/components/scroll-animations"
import { Award, ExternalLink } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Certification {
  _id: string
  title: string
  issuer: string
  date: string
  imageUrl?: string
  link?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function CertificationsSection() {
  const { data: certifications, isLoading } = useSWR<Certification[]>(
    "/api/certifications",
    fetcher,
    { revalidateOnFocus: false }
  )

  if (!isLoading && (!certifications || certifications.length === 0)) return null;

  return (
    <section id="certifications" className="py-32 px-6 relative border-t border-primary/10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
              Licenses & <span className="text-primary glow-text">Certifications</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
              Professional credentials and verified skills.
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
            {certifications?.map((cert) => (
              <StaggerItem key={cert._id}>
                <div className="h-full p-6 rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] flex flex-col group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    {cert.imageUrl && (
                      <img src={cert.imageUrl} alt={cert.title} className="w-16 h-16 object-contain rounded-md border border-border/50 bg-white/5 p-1" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cert.title}</h3>
                  <div className="text-muted-foreground font-mono text-sm mb-4">
                    {cert.issuer} • {cert.date}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border/50 flex justify-end">
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary flex items-center gap-2 hover:underline">
                        <ExternalLink className="w-4 h-4" /> Verify Credential
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  )
}
