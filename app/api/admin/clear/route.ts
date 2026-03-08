import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProjectModel, PublicationModel, ResearchModel, ProfileModel, ExperienceModel, AchievementModel, CertificationModel } from "@/lib/models"

export async function POST() {
  try {
    await connectToDatabase()

    // Clear existing data from all collections
    await ProjectModel.deleteMany({})
    await PublicationModel.deleteMany({})
    await ResearchModel.deleteMany({})
    await ProfileModel.deleteMany({})
    await ExperienceModel.deleteMany({})
    await AchievementModel.deleteMany({})
    await CertificationModel.deleteMany({})

    return NextResponse.json({ message: "Database cleared successfully!" })
  } catch (error) {
    console.error("Error clearing database:", error)
    return NextResponse.json({ error: "Failed to clear database" }, { status: 500 })
  }
}
