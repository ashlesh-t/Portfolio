"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import { ScrollReveal, ScaleOnScroll } from "@/components/scroll-animations"
import { Trophy, ExternalLink } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Achievement {
  _id: string
  title: string
  description: string
  date: string
  link?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function AchievementsSection() {
  const { data: achievements, isLoading } = useSWR<Achievement[]>(
    "/api/achievements",
    fetcher,
    { revalidateOnFocus: false }
  )

  return (
    <section id="achievements" className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Key <span className="text-primary">Achievements</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Milestones and recognition
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : achievements && achievements.length > 0 ? (
          <div className="relative space-y-8">
            {achievements.map((item, idx) => (
              <ScaleOnScroll key={item._id}>
                <div className="flex gap-4 items-start p-6 rounded-2xl border border-primary/20 bg-card/10 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0 mt-1">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      <span className="text-sm font-mono text-primary px-3 py-1 rounded-full bg-primary/10">{item.date}</span>
                    </div>
                    <p className="text-muted-foreground mt-3 leading-relaxed">
                      {item.description}
                    </p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline">
                        <ExternalLink className="w-4 h-4" /> View Details
                      </a>
                    )}
                  </div>
                </div>
              </ScaleOnScroll>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No achievements recorded yet.
          </div>
        )}
      </div>
    </section>
  )
}
