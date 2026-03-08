import { NextResponse } from "next/server"
import { fetchGitHubRepos } from "@/lib/github"

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || "ashlesh"
    const repos = await fetchGitHubRepos(username)
    
    if (!repos) {
      throw new Error("Failed to fetch repos")
    }
    
    return NextResponse.json(repos)
  } catch (error) {
    console.error("Error fetching repos:", error)
    
    // Return mock data for demo
    return NextResponse.json([
      {
        id: 1,
        name: "neural-transformer-xl",
        description: "State-of-the-art transformer architecture for large-scale NLP tasks",
        url: "https://github.com/example/neural-transformer-xl",
        stars: 1234,
        forks: 256,
        watchers: 89,
        language: "Python",
        topics: ["deep-learning", "nlp", "transformer"],
      },
      {
        id: 2,
        name: "vision-attention-network",
        description: "Attention mechanisms for computer vision applications",
        url: "https://github.com/example/vision-attention-network",
        stars: 892,
        forks: 167,
        watchers: 45,
        language: "Python",
        topics: ["computer-vision", "attention", "pytorch"],
      }
    ])
  }
}
