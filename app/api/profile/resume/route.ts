import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProfileModel } from "@/lib/models"

export async function GET() {
  try {
    await connectToDatabase()
    const profile = await ProfileModel.findOne({}).lean()
    if (!profile || !profile.resumeBase64) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ resume: profile.resumeBase64 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { resumeBase64 } = await req.json()
    await connectToDatabase()
    const profile = await ProfileModel.findOne({})
    if (profile) {
      profile.resumeBase64 = resumeBase64
      await profile.save()
    } else {
      await ProfileModel.create({ name: "Ashlesh T", title: "Developer", resumeBase64 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error uploading resume:", error)
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 })
  }
}
