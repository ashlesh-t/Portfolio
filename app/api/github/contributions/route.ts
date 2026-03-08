import { NextResponse } from "next/server"
import { fetchGitHubContributions } from "@/lib/github"

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || "ashlesh"
    const activity = await fetchGitHubContributions(username)
    
    if (!activity) {
        throw new Error("Failed to fetch activity")
    }

    return NextResponse.json(activity.contributions)
  } catch (error) {
    console.error("Error fetching contributions:", error)
    
    // Generate mock contribution data for the last 182 days (26 weeks)
    const contributions = []
    const today = new Date()
    
    for (let i = 181; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const count = Math.floor(Math.random() * 5)
      let level = 0
      if (count > 0) level = 1
      if (count > 2) level = 2
      if (count > 4) level = 3
      
      contributions.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      })
    }
    
    return NextResponse.json(contributions)
  }
}
