function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  type: string
}

export function renderContactNotificationEmail(submission: ContactSubmission) {
  const name = escapeHtml(submission.name)
  const email = escapeHtml(submission.email)
  const subject = escapeHtml(submission.subject)
  const type = escapeHtml(submission.type || "general")
  const message = escapeHtml(submission.message).replace(/\n/g, "<br/>")
  const receivedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New portfolio contact message</title>
</head>
<body style="margin:0;padding:0;background-color:#0b0f1a;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f1a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#11162a;border-radius:16px;overflow:hidden;border:1px solid #262c46;">
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:28px 32px;">
              <p style="margin:0;color:#e0e7ff;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Portfolio Contact Form</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700;">New message received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #262c46;">
                    <p style="margin:0;color:#8b93b0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="margin:4px 0 0;color:#f1f3fb;font-size:16px;font-weight:600;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #262c46;">
                    <p style="margin:0;color:#8b93b0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</p>
                    <p style="margin:4px 0 0;color:#a5b4fc;font-size:15px;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #262c46;">
                    <p style="margin:0;color:#8b93b0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Type</p>
                    <span style="display:inline-block;margin-top:6px;padding:4px 12px;background-color:#312e81;color:#c7d2fe;font-size:12px;font-weight:600;border-radius:999px;text-transform:capitalize;">${type}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #262c46;">
                    <p style="margin:0;color:#8b93b0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                    <p style="margin:4px 0 0;color:#f1f3fb;font-size:16px;font-weight:600;">${subject}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;">
              <p style="margin:0 0 8px;color:#8b93b0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
              <div style="background-color:#0b0f1a;border:1px solid #262c46;border-radius:10px;padding:16px 18px;color:#e2e5f1;font-size:15px;line-height:1.6;">
                ${message}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 32px;">
              <a href="mailto:${email}?subject=${encodeURIComponent("Re: " + submission.subject)}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;">Reply to ${name}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#0b0f1a;border-top:1px solid #262c46;">
              <p style="margin:0;color:#5b6280;font-size:12px;">Received ${receivedAt} IST via the portfolio contact form.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `New portfolio contact message

From: ${submission.name} <${submission.email}>
Type: ${submission.type || "general"}
Subject: ${submission.subject}

${submission.message}

Received ${receivedAt} IST via the portfolio contact form.`

  return { html, text }
}
