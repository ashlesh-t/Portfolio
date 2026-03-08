import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ResearchModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    
    const research = await ResearchModel.find({})
      .sort({ year: -1, order: 1 })
      .lean()
    
    if (research.length === 0) {
      return NextResponse.json([])
    }
    
    return NextResponse.json(research)
  } catch (error) {
    console.error("Error fetching research:", error)
    return NextResponse.json({ error: "Failed to fetch research" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    const newResearch = await ResearchModel.create(body)
    return NextResponse.json(newResearch, { status: 201 })
  } catch (error) {
    console.error("Error creating research:", error)
    return NextResponse.json({ error: "Failed to create research" }, { status: 500 })
  }
}
