import { NeuralNetworkBackground } from "@/components/neural-network-background"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ResearchSection } from "@/components/sections/research-section"
import { PublicationsSection } from "@/components/sections/publications-section"
import { MetricsSection } from "@/components/sections/metrics-section"
import { GitHubSection } from "@/components/sections/github-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* 3D Neural Network Background */}
      <NeuralNetworkBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <MetricsSection />
        <ProjectsSection />
        <ResearchSection />
        <PublicationsSection />
        <GitHubSection />
        <ContactSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
