"use client"

import { motion } from "framer-motion"
import { FloatingElement, GlowText, Typewriter } from "@/components/scroll-animations"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI/ML Researcher & Engineer
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <GlowText className="text-foreground">
              <Typewriter text="Dr. Sarah Chen" delay={0.5} />
            </GlowText>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Building the future of artificial intelligence through{" "}
            <span className="text-primary">deep learning</span>,{" "}
            <span className="text-accent">computer vision</span>, and{" "}
            <span className="text-primary">neural architectures</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Mail className="w-4 h-4" />
              Get in Touch
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
              <Github className="w-4 h-4" />
              View GitHub
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.6 }}
            className="flex items-center justify-center gap-6"
          >
            <SocialLink href="https://github.com" icon={<Github className="w-5 h-5" />} />
            <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-5 h-5" />} />
            <SocialLink href="mailto:sarah@example.com" icon={<Mail className="w-5 h-5" />} />
          </motion.div>
        </motion.div>
        
        <FloatingElement className="absolute bottom-12 left-1/2 -translate-x-1/2" duration={2} distance={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </FloatingElement>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.a>
  )
}
