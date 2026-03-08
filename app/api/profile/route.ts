import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProfileModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    const profile = await ProfileModel.findOne({}).lean()
    return NextResponse.json(profile || {})
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    // We assume there's only one profile. Overwrite if exists, or create new.
    const existing = await ProfileModel.findOne({})
    let profile
    if (existing) {
      profile = await ProfileModel.findByIdAndUpdate(existing._id, body, { new: true })
    } else {
      profile = await ProfileModel.create(body)
    }
    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error("Error creating/updating profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
