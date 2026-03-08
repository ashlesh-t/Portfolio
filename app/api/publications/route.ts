import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { PublicationModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    
    const publications = await PublicationModel.find({})
      .sort({ year: -1, citations: -1 })
      .lean()
    
    if (publications.length === 0) {
      return NextResponse.json([])
    }
    
    return NextResponse.json(publications)
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    const newPub = await PublicationModel.create(body)
    return NextResponse.json(newPub, { status: 201 })
  } catch (error) {
    console.error("Error creating publication:", error)
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 })
  }
}
