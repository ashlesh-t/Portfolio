import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ashlesh | Software Engineer I | Backend, Distributed Systems & AI',
  description: 'Portfolio of Ashlesh, a Software Engineer I specializing in backend engineering, distributed systems, and AI systems (LLMs & RAG). Building scalable, production-grade systems with Go, React, and Apache Spark.',
  keywords: ['Ashlesh', 'Software Engineer', 'Fullstack Developer', 'Go Developer', 'React Developer', 'Apache Spark', 'Distributed Systems', 'Backend Engineer', 'AI Researcher', 'LLM', 'RAG'],
  authors: [{ name: 'Ashlesh' }],
  creator: 'Ashlesh',
  metadataBase: new URL('https://ashlesh.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ashlesh | Software Engineer I | Backend, Distributed Systems & AI',
    description: 'Portfolio of Ashlesh, a Software Engineer I specializing in backend engineering, distributed systems, and AI systems (LLMs & RAG).',
    url: 'https://ashlesh.co.in',
    siteName: 'Ashlesh Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashlesh | Software Engineer I | Backend, Distributed Systems & AI',
    description: 'Software Engineer I specializing in backend engineering, distributed systems, and AI systems (LLMs & RAG).',
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
  jobTitle: 'Software Engineer I',
  description: 'Software Engineer I specializing in backend engineering, distributed systems, and AI systems (LLMs & RAG).',
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
