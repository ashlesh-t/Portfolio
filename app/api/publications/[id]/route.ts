import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { PublicationModel } from "@/lib/models"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    await PublicationModel.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const updated = await PublicationModel.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
