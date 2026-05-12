import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { BlogPostModel } from "@/lib/models/index"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const blog = await BlogPostModel.findById(params.id).lean()
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const blog = await BlogPostModel.findByIdAndUpdate(params.id, body, { new: true })
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    await BlogPostModel.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
