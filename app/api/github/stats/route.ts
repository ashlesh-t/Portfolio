import { NextResponse } from "next/server"
import { fetchGitHubProfile } from "@/lib/github"

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || "ashlesh"
    const profile = await fetchGitHubProfile(username)
    
    if (!profile) {
        throw new Error("Failed to fetch profile")
    }

    // Adapt profile to the format expected by the frontend
    return NextResponse.json({
      totalStars: profile.totalStars,
      totalRepos: profile.publicRepos,
      totalForks: 0, // Profile API doesn't give total forks easily, can mock or skip
      languages: {
        Python: 65,
        TypeScript: 15,
        Rust: 10,
        Jupyter: 8,
        Go: 2,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    
    // Return mock data for demo
    return NextResponse.json({
      totalStars: 5916,
      totalForks: 1145,
      totalRepos: 42,
      languages: {
        Python: 65,
        TypeScript: 15,
        Rust: 10,
        Jupyter: 8,
        Go: 2,
      },
    })
  }
}
