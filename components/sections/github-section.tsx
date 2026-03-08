"use client"

import useSWR from "swr"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations"
import { Star, GitFork, Eye, ExternalLink, Activity, GitCommit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string
  topics: string[]
}

interface GitHubStats {
  totalStars: number
  totalForks: number
  totalRepos: number
  languages: Record<string, number>
}

interface ContributionDay {
  date: string
  count: number
  level: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function GitHubSection() {
  const { data: repos, error: reposError, isLoading: reposLoading } = useSWR<GitHubRepo[]>(
    "/api/github/repos",
    fetcher,
    { revalidateOnFocus: false }
  )
  
  const { data: stats, isLoading: statsLoading } = useSWR<GitHubStats>(
    "/api/github/stats",
    fetcher,
    { revalidateOnFocus: false }
  )
  
  const { data: contributions } = useSWR<ContributionDay[]>(
    "/api/github/contributions",
    fetcher,
    { revalidateOnFocus: false }
  )
  
  return (
    <section id="github" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              GitHub <span className="text-primary">Activity</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Open source contributions and research implementations
            </p>
          </div>
        </ScrollReveal>
        
        {/* Stats Overview */}
        {statsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : stats && (
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard icon={<Star className="w-5 h-5" />} label="Total Stars" value={stats.totalStars} />
              <StatCard icon={<GitFork className="w-5 h-5" />} label="Total Forks" value={stats.totalForks} />
              <StatCard icon={<Eye className="w-5 h-5" />} label="Repositories" value={stats.totalRepos} />
              <StatCard icon={<Activity className="w-5 h-5" />} label="Languages" value={Object.keys(stats.languages).length} />
            </div>
          </ScrollReveal>
        )}
        
        {/* Contribution Graph */}
        {contributions && contributions.length > 0 && (
          <ScrollReveal delay={0.2}>
            <div className="mb-12 p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <GitCommit className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Contribution Activity</h3>
              </div>
              <ContributionGraph contributions={contributions} />
            </div>
          </ScrollReveal>
        )}
        
        {/* Repository Grid */}
        {reposLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : reposError ? (
          <div className="text-center py-12 text-muted-foreground">
            Unable to load repositories. Please try again later.
          </div>
        ) : repos && repos.length > 0 && (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {repos.slice(0, 6).map((repo) => (
              <StaggerItem key={repo.id}>
                <RepoCard repo={repo} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
        
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild className="gap-2 border-primary/30 hover:bg-primary/10">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                View All Repositories
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm text-center">
      <div className="flex items-center justify-center gap-2 text-primary mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const languageColors: Record<string, string> = {
    Python: "#3572A5",
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Jupyter: "#DA5B0B",
    Rust: "#dea584",
    Go: "#00ADD8",
    C: "#555555",
    "C++": "#f34b7d",
  }
  
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 transition-all group"
    >
      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {repo.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {repo.description || "No description available"}
      </p>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          {repo.forks_count}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColors[repo.language] || "#6e7681" }}
            />
            {repo.language}
          </span>
        )}
      </div>
      
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}

function ContributionGraph({ contributions }: { contributions: ContributionDay[] }) {
  const weeks = []
  const daysInWeek = 7
  
  for (let i = 0; i < contributions.length; i += daysInWeek) {
    weeks.push(contributions.slice(i, i + daysInWeek))
  }
  
  const levelColors = [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
  ]
  
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.slice(-26).map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={`w-3 h-3 rounded-sm ${levelColors[day.level]} transition-colors hover:ring-1 hover:ring-primary`}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        {levelColors.map((color, idx) => (
          <div key={idx} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
