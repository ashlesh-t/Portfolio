import mongoose, { Schema, Model } from 'mongoose'

// ============================================
// Type Definitions
// ============================================

export interface Profile {
  _id?: string
  name: string
  title: string
  designations: string[] // e.g. "Developer", "Backend", "Distributed Systems"
  bio: string[]
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  resumeBase64?: string // Storing CV pdf as base64 string
  skills: { name: string; category?: string; level?: number }[]
  highlights: { label: string; value: string; icon: string }[]
  aboutTags?: string[]
  impactMetrics?: {
    id: string
    label: string
    value: number
    suffix: string
    icon: string
    color: string
    description: string
  }[]
  performanceMetrics?: {
    label: string
    value: number
    unit: string
    target: number
    better: "higher" | "lower"
  }[]
  researchActivity?: {
    month: string
    count: number
  }[]
}

export interface Experience {
  _id?: string
  company: string
  role: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
  technologies: string[]
  order: number
}

export interface Project {
  _id?: string
  title: string
  shortDescription: string
  fullDescription: string
  categories: string[] // Multiple categories
  technologies: string[] // Tags
  status?: string
  metrics?: {
    accuracy?: number
    performance?: string
    impact?: string
  }
  githubUrl?: string
  projectUrl?: string // Alternate URL
  demoUrl?: string
  paperUrl?: string
  images?: string[] // URLs or base64
  architectureString?: string // "A->B->C" format
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
  status: 'Published' | 'Accepted'
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
  impact?: string
  links?: {
    paper?: string
    code?: string
    slides?: string
    video?: string
  }
}

export interface Achievement {
  _id?: string
  title: string
  description: string
  date: string
  icon?: string
  link?: string
  order?: number
}

export interface Certification {
  _id?: string
  title: string
  issuer: string
  date: string
  imageUrl?: string
  link?: string
  order?: number
}

// ============================================
// Mongoose Schema Definitions (for server-side)
// ============================================


const ProfileSchema = new Schema<Profile>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  designations: [String],
  bio: [String],
  email: String,
  phone: String,
  location: String,
  github: String,
  linkedin: String,
  resumeBase64: String,
  skills: [{ name: String, category: String, level: Number }],
  highlights: [{ label: String, value: String, icon: String }],
  aboutTags: [String],
  impactMetrics: [{
    id: String,
    label: String,
    value: Number,
    suffix: String,
    icon: String,
    color: String,
    description: String
  }],
  performanceMetrics: [{
    label: String,
    value: Number,
    unit: String,
    target: Number,
    better: { type: String, enum: ["higher", "lower"] }
  }],
  researchActivity: [{
    month: String,
    count: Number
  }]
}, { timestamps: true })

const ExperienceSchema = new Schema<Experience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: String,
  current: { type: Boolean, default: false },
  description: [String],
  technologies: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true })

const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  categories: [String],
  technologies: [String],
  status: { type: String },
  metrics: {
    accuracy: Number,
    performance: String,
    impact: String
  },
  githubUrl: String,
  projectUrl: String,
  demoUrl: String,
  paperUrl: String,
  images: [String],
  architectureString: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true })

const PublicationSchema = new Schema<Publication>({
  title: { type: String, required: true },
  authors: [String],
  venue: String,
  year: { type: Number, required: true },
  abstract: { type: String, required: true },
  citations: Number,
  doi: String,
  status: { type: String, enum: ['Published', 'Accepted'], default: 'Published' },
  links: {
    paper: String,
    code: String
  },
  tags: [String]
}, { timestamps: true })

const ResearchSchema = new Schema<Research>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  venue: String,
  authors: [String],
  citations: Number,
  impact: String,
  links: {
    paper: String,
    code: String,
    slides: String,
    video: String
  }
}, { timestamps: true })

const AchievementSchema = new Schema<Achievement>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  icon: String,
  link: String,
  order: { type: Number, default: 0 }
}, { timestamps: true })

const CertificationSchema = new Schema<Certification>({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: String,
  link: String,
  order: { type: Number, default: 0 }
}, { timestamps: true })

export const ProfileModel: Model<Profile> = mongoose.models.Profile || mongoose.model<Profile>('Profile', ProfileSchema)
export const ExperienceModel: Model<Experience> = mongoose.models.Experience || mongoose.model<Experience>('Experience', ExperienceSchema)
export const ProjectModel: Model<Project> = mongoose.models.Project || mongoose.model<Project>('Project', ProjectSchema)
export const PublicationModel: Model<Publication> = mongoose.models.Publication || mongoose.model<Publication>('Publication', PublicationSchema)
export const ResearchModel: Model<Research> = mongoose.models.Research || mongoose.model<Research>('Research', ResearchSchema)
export const AchievementModel: Model<Achievement> = mongoose.models.Achievement || mongoose.model<Achievement>('Achievement', AchievementSchema)
export const CertificationModel: Model<Certification> = mongoose.models.Certification || mongoose.model<Certification>('Certification', CertificationSchema)
