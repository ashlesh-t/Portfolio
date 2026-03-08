import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { CertificationModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    const data = await CertificationModel.find({}).sort({ order: 1, date: -1 }).lean()
    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const newDoc = await CertificationModel.create(body)
    return NextResponse.json(newDoc, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 })
  }
}
