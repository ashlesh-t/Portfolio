import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, type } = body
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }
    
    // In production, this would save to MongoDB:
    // import { connectToDatabase } from "@/lib/mongodb"
    // import { ContactMessage } from "@/lib/models"
    //
    // await connectToDatabase()
    // await ContactMessage.create({
    //   name,
    //   email,
    //   subject,
    //   message,
    //   type,
    //   status: "new"
    // })
    
    // For demo, we just log and return success
    console.log("Contact form submission:", { name, email, subject, message, type })
    
    return NextResponse.json({ success: true, message: "Message received" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
