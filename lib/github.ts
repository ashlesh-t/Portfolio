import type { GitHubProfile, GitHubRepo, GitHubContribution, GitHubActivity } from './models'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'octocat'

const headers: HeadersInit = GITHUB_TOKEN
  ? {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  : {
      'Accept': 'application/vnd.github.v3+json',
    }

export async function fetchGitHubProfile(username?: string): Promise<GitHubProfile | null> {
  const user = username || GITHUB_USERNAME
  
  try {
    const response = await fetch(`https://api.github.com/users/${user}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('GitHub API error:', response.status)
      return null
    }
    
    const data = await response.json()
    
    // Fetch repos to calculate total stars
    const repos = await fetchGitHubRepos(user)
    const totalStars = repos?.reduce((sum, repo) => sum + repo.stars, 0) || 0
    
    return {
      username: data.login,
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      totalStars,
    }
  } catch (error) {
    console.error('Error fetching GitHub profile:', error)
    return null
  }
}

export async function fetchGitHubRepos(username?: string): Promise<GitHubRepo[] | null> {
  const user = username || GITHUB_USERNAME
  
  try {
    const response = await fetch(
      `https://api.github.com/users/${user}/repos?sort=updated&per_page=100`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    )
    
    if (!response.ok) {
      console.error('GitHub API error:', response.status)
      return null
    }
    
    const data = await response.json()
    
    return data.map((repo: Record<string, unknown>) => ({
      id: repo.id as number,
      name: repo.name as string,
      fullName: repo.full_name as string,
      description: repo.description as string | undefined,
      url: repo.html_url as string,
      homepage: repo.homepage as string | undefined,
      language: repo.language as string | undefined,
      stars: repo.stargazers_count as number,
      forks: repo.forks_count as number,
      watchers: repo.watchers_count as number,
      topics: (repo.topics as string[]) || [],
      createdAt: repo.created_at as string,
      updatedAt: repo.updated_at as string,
      pushedAt: repo.pushed_at as string,
    }))
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return null
  }
}

export async function fetchGitHubContributions(username?: string): Promise<GitHubActivity | null> {
  const user = username || GITHUB_USERNAME
  
  // GitHub's GraphQL API for contribution data
  if (!GITHUB_TOKEN) {
    // Return mock data if no token
    return generateMockContributions()
  }
  
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `
  
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username: user } }),
      next: { revalidate: 3600 },
    })
    
    if (!response.ok) {
      console.error('GitHub GraphQL API error:', response.status)
      return generateMockContributions()
    }
    
    const data = await response.json()
    
    if (data.errors) {
      console.error('GitHub GraphQL errors:', data.errors)
      return generateMockContributions()
    }
    
    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar
    
    if (!calendar) {
      return generateMockContributions()
    }
    
    const contributions: GitHubContribution[] = []
    
    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        })
      }
    }
    
    // Calculate streaks
    const { longestStreak, currentStreak } = calculateStreaks(contributions)
    
    return {
      totalContributions: calendar.totalContributions,
      contributions,
      longestStreak,
      currentStreak,
    }
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    return generateMockContributions()
  }
}

function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

function calculateStreaks(contributions: GitHubContribution[]): { longestStreak: number; currentStreak: number } {
  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0
  
  // Sort by date (newest first for current streak)
  const sorted = [...contributions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // Calculate current streak (from today backwards)
  for (const contrib of sorted) {
    if (contrib.count > 0) {
      currentStreak++
    } else {
      break
    }
  }
  
  // Calculate longest streak
  const chronological = [...contributions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  for (const contrib of chronological) {
    if (contrib.count > 0) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }
  
  return { longestStreak, currentStreak }
}

function generateMockContributions(): GitHubActivity {
  const contributions: GitHubContribution[] = []
  const today = new Date()
  
  // Generate 365 days of mock data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Generate random contribution count with some patterns
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseCount = isWeekend ? 2 : 5
    const randomFactor = Math.random()
    
    let count = 0
    if (randomFactor > 0.3) {
      count = Math.floor(Math.random() * baseCount) + 1
    }
    if (randomFactor > 0.85) {
      count = Math.floor(Math.random() * 10) + 5
    }
    
    contributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level: getContributionLevel(count),
    })
  }
  
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0)
  const { longestStreak, currentStreak } = calculateStreaks(contributions)
  
  return {
    totalContributions,
    contributions,
    longestStreak,
    currentStreak,
  }
}

// Auto-sync function to fetch and cache GitHub data
export async function syncGitHubData(username?: string) {
  const [profile, repos, activity] = await Promise.all([
    fetchGitHubProfile(username),
    fetchGitHubRepos(username),
    fetchGitHubContributions(username),
  ])
  
  return {
    profile,
    repos,
    activity,
    syncedAt: new Date().toISOString(),
  }
}
