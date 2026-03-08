import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProjectModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    
    // Fetch projects, sorting by featured first, then by order
    const projects = await ProjectModel.find({})
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean()
    
    // Provide a safe fallback if DB is completely empty and no seed was run
    if (projects.length === 0) {
      return NextResponse.json([])
    }
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects from MongoDB:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    const newProject = await ProjectModel.create(body)
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
