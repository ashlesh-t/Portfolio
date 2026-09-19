import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProjectModel } from "@/lib/models"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params
    await ProjectModel.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = await req.json()
    const updated = await ProjectModel.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
