module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/github.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchGitHubContributions",
    ()=>fetchGitHubContributions,
    "fetchGitHubProfile",
    ()=>fetchGitHubProfile,
    "fetchGitHubRepos",
    ()=>fetchGitHubRepos,
    "syncGitHubData",
    ()=>syncGitHubData
]);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'octocat';
const headers = GITHUB_TOKEN ? {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
} : {
    'Accept': 'application/vnd.github.v3+json'
};
async function fetchGitHubProfile(username) {
    const user = username || GITHUB_USERNAME;
    try {
        const response = await fetch(`https://api.github.com/users/${user}`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!response.ok) {
            console.error('GitHub API error:', response.status);
            return null;
        }
        const data = await response.json();
        // Fetch repos to calculate total stars
        const repos = await fetchGitHubRepos(user);
        const totalStars = repos?.reduce((sum, repo)=>sum + repo.stars, 0) || 0;
        return {
            username: data.login,
            name: data.name,
            bio: data.bio,
            avatarUrl: data.avatar_url,
            publicRepos: data.public_repos,
            followers: data.followers,
            following: data.following,
            totalStars
        };
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        return null;
    }
}
async function fetchGitHubRepos(username) {
    const user = username || GITHUB_USERNAME;
    try {
        const response = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=100`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!response.ok) {
            console.error('GitHub API error:', response.status);
            return null;
        }
        const data = await response.json();
        return data.map((repo)=>({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                url: repo.html_url,
                homepage: repo.homepage,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                watchers: repo.watchers_count,
                topics: repo.topics || [],
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                pushedAt: repo.pushed_at
            }));
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return null;
    }
}
async function fetchGitHubContributions(username) {
    const user = username || GITHUB_USERNAME;
    // GitHub's GraphQL API for contribution data
    if (!GITHUB_TOKEN) {
        console.warn("GITHUB_TOKEN is missing! Using mock contributions.");
        return generateMockContributions();
    } else {
        console.log(`Using GITHUB_TOKEN starting with: ${GITHUB_TOKEN.substring(0, 8)}...`);
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
  `;
    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables: {
                    username: user
                }
            }),
            next: {
                revalidate: 3600
            }
        });
        if (!response.ok) {
            console.error('GitHub GraphQL API error:', response.status);
            return generateMockContributions();
        }
        const data = await response.json();
        if (data.errors) {
            console.error('GitHub GraphQL errors:', data.errors);
            return generateMockContributions();
        }
        const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
            return generateMockContributions();
        }
        const contributions = [];
        for (const week of calendar.weeks){
            for (const day of week.contributionDays){
                contributions.push({
                    date: day.date,
                    count: day.contributionCount,
                    level: getContributionLevel(day.contributionCount)
                });
            }
        }
        // Calculate streaks
        const { longestStreak, currentStreak } = calculateStreaks(contributions);
        return {
            totalContributions: calendar.totalContributions,
            contributions,
            longestStreak,
            currentStreak
        };
    } catch (error) {
        console.error('Error fetching GitHub contributions:', error);
        return generateMockContributions();
    }
}
function getContributionLevel(count) {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
}
function calculateStreaks(contributions) {
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    // Sort by date (newest first for current streak)
    const sorted = [
        ...contributions
    ].sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
    // Calculate current streak (from today backwards)
    for (const contrib of sorted){
        if (contrib.count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }
    // Calculate longest streak
    const chronological = [
        ...contributions
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const contrib of chronological){
        if (contrib.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }
    return {
        longestStreak,
        currentStreak
    };
}
function generateMockContributions() {
    const contributions = [];
    const today = new Date();
    // Generate 365 days of mock data
    for(let i = 364; i >= 0; i--){
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        // Generate random contribution count with some patterns
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseCount = isWeekend ? 2 : 5;
        const randomFactor = Math.random();
        let count = 0;
        if (randomFactor > 0.3) {
            count = Math.floor(Math.random() * baseCount) + 1;
        }
        if (randomFactor > 0.85) {
            count = Math.floor(Math.random() * 10) + 5;
        }
        contributions.push({
            date: date.toISOString().split('T')[0],
            count,
            level: getContributionLevel(count)
        });
    }
    const totalContributions = contributions.reduce((sum, c)=>sum + c.count, 0);
    const { longestStreak, currentStreak } = calculateStreaks(contributions);
    return {
        totalContributions,
        contributions,
        longestStreak,
        currentStreak
    };
}
async function syncGitHubData(username) {
    const [profile, repos, activity] = await Promise.all([
        fetchGitHubProfile(username),
        fetchGitHubRepos(username),
        fetchGitHubContributions(username)
    ]);
    return {
        profile,
        repos,
        activity,
        syncedAt: new Date().toISOString()
    };
}
}),
"[project]/app/api/github/contributions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/github.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const username = process.env.GITHUB_USERNAME || "ashlesh";
        const activity = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchGitHubContributions"])(username);
        if (!activity) {
            throw new Error("Failed to fetch activity");
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(activity.contributions);
    } catch (error) {
        console.error("Error fetching contributions:", error);
        // Generate mock contribution data for the last 182 days (26 weeks)
        const contributions = [];
        const today = new Date();
        for(let i = 181; i >= 0; i--){
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const count = Math.floor(Math.random() * 5);
            let level = 0;
            if (count > 0) level = 1;
            if (count > 2) level = 2;
            if (count > 4) level = 3;
            contributions.push({
                date: date.toISOString().split("T")[0],
                count,
                level
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(contributions);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d3cfe15b._.js.map