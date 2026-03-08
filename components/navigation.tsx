"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Brain } from "lucide-react"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Publications", href: "#publications" },
  { label: "Achievements", href: "#achievements" },
  { label: "Certifications", href: "#certifications" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, { threshold: 0.2, rootMargin: "-10% 0px -50% 0px" })

    navItems.forEach(item => {
      const el = document.getElementById(item.href.substring(1))
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleDownloadCV = async () => {
    try {
      const res = await fetch("/api/profile/resume")
      if (!res.ok) throw new Error("Not found")
      const data = await res.json()
      if (data.resume) {
        const link = document.createElement('a')
        link.href = data.resume
        link.download = "Ashlesh_CV.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert("CV not uploaded yet.")
      }
    } catch (e) {
      alert("CV not uploaded yet.")
    }
  }
  
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-primary/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-foreground hidden sm:block font-mono tracking-tighter text-lg uppercase">
                Ashlesh
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-lg relative group ${
                      isActive ? "text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(0,255,65,0.2)]" : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(0,255,65,0.8)]"
                      />
                    )}
                  </a>
                )
              })}
            </div>
            
            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button size="sm" onClick={handleDownloadCV} className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono shadow-[0_0_10px_rgba(0,255,65,0.2)] hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all">
                &gt; get_cv.sh
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </nav>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-card border-l border-primary/30 shadow-[-10px_0_30px_rgba(0,255,65,0.1)] z-50 lg:hidden font-mono"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-primary">~/menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-primary/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.href.substring(1)
                          ? "bg-primary/20 text-primary border-l-2 border-primary"
                          : "text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      $ cd {item.href.substring(1)}
                    </a>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button onClick={() => { handleDownloadCV(); setIsMobileMenuOpen(false); }} className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono">
                    &gt; ./download_cv
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
