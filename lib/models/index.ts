import mongoose, { Schema, Model } from 'mongoose'

// ============================================
// Type Definitions
// ============================================

export interface Project {
  _id?: string
  title: string
  shortDescription: string
  fullDescription: string
  category: string
  technologies: string[]
  status: string
  metrics?: {
    accuracy?: number
    performance?: string
    impact?: string
  }
  githubUrl?: string
  demoUrl?: string
  paperUrl?: string
  architecture?: {
    name: string
    components: string[]
  }[]
  featured: boolean
  order?: number
}

export interface Publication {
  _id?: string
  title: string
  authors: string[]
  venue?: string
  year: number
  abstract: string
  citations?: number
  doi?: string
  links?: {
    paper?: string
    code?: string
  }
  tags?: string[]
}

export interface Research {
  _id?: string
  title: string
  description: string
  date: string
  type: string
  venue?: string
  authors?: string[]
  citations?: number
  links?: {
    paper?: string
    code?: string
    slides?: string
    video?: string
  }
}

// ============================================
// Mongoose Schema Definitions (for server-side)
// ============================================

// Project Schema
const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { type: String, required: true },
  technologies: [String],
  status: { type: String, required: true },
  metrics: {
    accuracy: Number,
    performance: String,
    impact: String
  },
  githubUrl: String,
  demoUrl: String,
  paperUrl: String,
  architecture: [{
    name: String,
    components: [String]
  }],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true })

// Publication Schema
const PublicationSchema = new Schema<Publication>({
  title: { type: String, required: true },
  authors: [String],
  venue: String,
  year: { type: Number, required: true },
  abstract: { type: String, required: true },
  citations: Number,
  doi: String,
  links: {
    paper: String,
    code: String
  },
  tags: [String]
}, { timestamps: true })

// Research Schema
const ResearchSchema = new Schema<Research>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  venue: String,
  authors: [String],
  citations: Number,
  links: {
    paper: String,
    code: String,
    slides: String,
    video: String
  }
}, { timestamps: true })

// Model exports (check if already registered to prevent errors in hot reload)
export const ProjectModel: Model<Project> = mongoose.models.Project || mongoose.model<Project>('Project', ProjectSchema)
export const PublicationModel: Model<Publication> = mongoose.models.Publication || mongoose.model<Publication>('Publication', PublicationSchema)
export const ResearchModel: Model<Research> = mongoose.models.Research || mongoose.model<Research>('Research', ResearchSchema)
