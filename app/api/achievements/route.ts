import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { AchievementModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    const data = await AchievementModel.find({}).sort({ order: 1, date: -1 }).lean()
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const newDoc = await AchievementModel.create(body)
    return NextResponse.json(newDoc, { status: 201 })
  } catch (error) {
    console.error("Error creating achievement:", error)
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 })
  }
}
