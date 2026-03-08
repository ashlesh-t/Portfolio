import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ExperienceModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    const experience = await ExperienceModel.find({}).sort({ order: 1, startDate: -1 }).lean()
    return NextResponse.json(experience || [])
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const newExp = await ExperienceModel.create(body)
    return NextResponse.json(newExp, { status: 201 })
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
