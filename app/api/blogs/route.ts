import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { BlogPostModel } from "@/lib/models/index"

export async function GET() {
  try {
    await connectToDatabase()
    const blogs = await BlogPostModel.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const blog = await BlogPostModel.create(body)
    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
