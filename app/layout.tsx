import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ashlesh | SDE Intern & Fullstack Developer (Go, React, Spark)',
  description: 'Portfolio of Ashlesh, a Software Development Engineer Intern and Fullstack Developer specializing in Go, React, and Apache Spark. Expert in building scalable backend architectures and distributed systems.',
  keywords: ['Ashlesh', 'SDE Intern', 'Fullstack Developer', 'Go Developer', 'React Developer', 'Apache Spark', 'Distributed Systems', 'Backend Engineer', 'AI Researcher', 'Software Engineer'],
  authors: [{ name: 'Ashlesh' }],
  creator: 'Ashlesh',
  metadataBase: new URL('https://ashlesh.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ashlesh | SDE Intern & Fullstack Developer (Go, React, Spark)',
    description: 'Portfolio of Ashlesh, a Software Development Engineer Intern and Fullstack Developer specializing in Go, React, and Apache Spark.',
    url: 'https://ashlesh.co.in',
    siteName: 'Ashlesh Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashlesh | SDE Intern & Fullstack Developer (Go, React, Spark)',
    description: 'Software Development Engineer Intern and Fullstack Developer specializing in Go, React, and Apache Spark.',
  },
  icons: {
    icon: '/icon.svg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ashlesh',
  url: 'https://ashlesh.co.in',
  jobTitle: 'SDE Intern & Fullstack Developer',
  description: 'Software Development Engineer Intern specializing in Go, React, and Spark.',
  sameAs: [
    'https://github.com/ashlesh-t',
    'https://www.linkedin.com/in/ashlesha-t-752823269/',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
