import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { renderContactNotificationEmail } from "@/lib/email-template"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, type } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const gmailUser = process.env.GMAIL_USER
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailAppPassword) {
      console.error("Contact form: GMAIL_USER / GMAIL_APP_PASSWORD are not configured")
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    const { html, text } = renderContactNotificationEmail({ name, email, subject, message, type })

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `[Portfolio] ${type ? `${type.toUpperCase()}: ` : ""}${subject}`,
      text,
      html,
    })

    return NextResponse.json({ success: true, message: "Message sent" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
