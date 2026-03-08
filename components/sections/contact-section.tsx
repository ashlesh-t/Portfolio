"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ScrollReveal, PulseGlow } from "@/components/scroll-animations"
import { Button } from "@/components/ui/button"
import { Send, Mail, MapPin, Linkedin, Github, CheckCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  type: "collaboration" | "speaking" | "consulting" | "other"
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  type: "collaboration"
}

const contactTypes = [
  { value: "collaboration", label: "Research Collaboration" },
  { value: "speaking", label: "Speaking Engagement" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
]

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const subject = encodeURIComponent(`${formData.type.toUpperCase()}: ${formData.subject}`)
      const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`)
      window.location.href = `mailto:ashleshat5@gmail.com?subject=${subject}&body=${body}`
      
      setIsSubmitted(true)
      setFormData(initialFormData)
    } catch (err) {
      setError("Failed to open email client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="text-primary">Touch</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Interested in collaboration, speaking engagements, or consulting? Let's connect.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Let's Collaborate
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm always excited to discuss new research opportunities, 
                  potential collaborations, or speaking engagements. Whether 
                  you're working on cutting-edge AI projects or need expert 
                  consulting, I'd love to hear from you.
                </p>
              </div>
              
              <div className="space-y-4">
                <ContactItem
                  icon={<Mail className="w-5 h-5" />}
                  label="Email"
                  value="ashleshat5@gmail.com"
                  href="mailto:ashleshat5@gmail.com"
                />
                <ContactItem
                  icon={<MapPin className="w-5 h-5" />}
                  label="Location"
                  value="Bengaluru, India"
                />
                <ContactItem
                  icon={<Linkedin className="w-5 h-5" />}
                  label="LinkedIn"
                  value="linkedin.com/in/ashlesh"
                  href="https://www.linkedin.com/in/ashlesha-t-752823269/"
                />
                <ContactItem
                  icon={<Github className="w-5 h-5" />}
                  label="GitHub"
                  value="github.com/ashlesh-t"
                  href="https://github.com/ashlesh-t"
                />
              </div>
              
              {/* Availability indicator */}
              <PulseGlow className="inline-block rounded-full" color="rgba(34, 197, 94, 0.5)">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-400">Available for new projects</span>
                </div>
              </PulseGlow>
            </div>
          </ScrollReveal>
          
          {/* Contact Form */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="border-border/50"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      What brings you here?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {contactTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value as FormData["type"] })}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            formData.type === type.value
                              ? "bg-primary text-primary-foreground"
                              : "border border-border/50 text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Brief subject"
                    />
                  </div>
                  
                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell me about your project or inquiry..."
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-400 text-sm">{error}</div>
                  )}
                  
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

function ContactItem({ 
  icon, 
  label, 
  value, 
  href 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-foreground font-medium">{value}</div>
      </div>
    </div>
  )
  
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  
  return content
}
