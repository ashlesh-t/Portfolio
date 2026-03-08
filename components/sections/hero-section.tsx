"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingElement, GlowText, Typewriter } from "@/components/scroll-animations"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Terminal } from "lucide-react"

const defaultDesignations = [
  "Developer",
  "Backend",
  "Distributed Systems",
  "AI Systems",
  "RAG and Agentic AI",
  "Deep Learning",
  "AI Researcher"
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function HeroSection() {
  const { data: profile } = useSWR("/api/profile", fetcher)
  const designations = profile?.designations && profile.designations.length > 0 
    ? profile.designations 
    : defaultDesignations

  const [currentDesig, setCurrentDesig] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDesig((prev) => (prev + 1) % designations.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [designations.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff4110_1px,transparent_1px),linear-gradient(to_bottom,#00ff4110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-sm md:text-base font-medium shadow-[0_0_15px_rgba(0,255,65,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ff41]" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentDesig}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[200px]"
                >
                  {designations[currentDesig]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight mb-6 font-mono text-primary drop-shadow-[0_0_20px_rgba(0,255,65,0.4)]">
            <Typewriter text="Ashlesh" delay={0.5} />
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed font-mono"
          >
            Building the future of artificial intelligence through{" "}
            <span className="text-primary glow-text">deep learning</span>,{" "}
            <span className="text-accent">distributed systems</span>, and{" "}
            <span className="text-primary glow-text">scalable backend architectures</span>.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12 font-mono"
          >
            <Button size="lg" className="gap-2 bg-primary/20 border border-primary hover:bg-primary text-primary hover:text-primary-foreground shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all">
              <Mail className="w-4 h-4" />
              <a href="#contact">init_contact()</a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary/50 text-foreground hover:bg-primary/10 hover:text-primary transition-all">
              <Github className="w-4 h-4" />
              <a href="https://github.com/ashlesh-t" target="_blank" rel="noopener noreferrer">fetch_repos()</a>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.6 }}
            className="flex items-center justify-center gap-6"
          >
            <SocialLink href="https://github.com/ashlesh-t" icon={<Github className="w-5 h-5" />} />
            <SocialLink href="https://www.linkedin.com/in/ashlesha-t-752823269/" icon={<Linkedin className="w-5 h-5" />} />
            <SocialLink href="mailto:ashleshat5@gmail.com" icon={<Mail className="w-5 h-5" />} />
          </motion.div>
        </motion.div>
        
        <FloatingElement className="absolute bottom-12 left-1/2 -translate-x-1/2" duration={2} distance={8}>
          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="flex flex-col items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <span className="text-xs font-mono">scroll_down()</span>
            <ArrowDown className="w-6 h-6 animate-bounce shadow-[0_0_10px_rgba(0,255,65,0.5)] rounded-full" />
          </motion.a>
        </FloatingElement>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full border border-primary/30 text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all bg-background/50 backdrop-blur-sm"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.a>
  )
}

