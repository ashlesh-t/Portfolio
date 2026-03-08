import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProjectModel, PublicationModel, ResearchModel, ProfileModel, ExperienceModel } from "@/lib/models"

const myProfile = {
  name: "Ashlesh T",
  title: "Computer Science Engineering student with hands-on experience in Distributed Systems, full-stack development, machine learning, and cloud-native tools.",
  bio: [
    "Computer Science Engineering student at PES University (CGPA 8.71) with a passion for solving real-world engineering problems at scale.",
    "I have hands-on experience in Distributed Systems, full-stack development, machine learning, and cloud-native tools.",
    "Published researcher (VISAPP 2026) with a track record of building production-grade systems."
  ],
  email: "ashleshat5@gmail.com",
  phone: "(+91) 7483611935",
  location: "Bengaluru, India",
  github: "https://github.com/ashlesh",
  linkedin: "https://linkedin.com/in/ashlesh",
  skills: [
    { name: "Java & Spring", category: "Backend", level: 90, icon: "Code" },
    { name: "Python & ML", category: "ML", level: 85, icon: "Brain" },
    { name: "Distributed Systems", category: "Architecture", level: 80, icon: "Database" },
    { name: "Docker & K8s", category: "DevOps", level: 85, icon: "Cpu" }
  ],
  highlights: [
    { icon: "GraduationCap", label: "PES University", value: "B.Tech CS" },
    { icon: "Award", label: "Published Paper", value: "VISAPP '26" },
    { icon: "Code", label: "LeetCode", value: "600+" },
    { icon: "Briefcase", label: "Internships", value: "2+" }
  ]
}

const myExperience = [
  {
    company: "Boomi Software",
    role: "Software Development Intern",
    startDate: "Jan 2026",
    endDate: "",
    current: true,
    description: [
      "Identified and resolved critical production defect in concurrent architecture caused by non-daemon thread lifecycle management, preventing potential memory leaks in customer-facing systems.",
      "Engineered automated Python-based pipeline for regression test branch discovery and health monitoring across Boomi Atomsphere environment, enabling faster CI/CD validation cycles."
    ],
    technologies: ["Java", "Python", "Concurrency", "Boomi Atomsphere", "Spring Framework"],
    order: 1
  },
  {
    company: "GOwarm.ai",
    role: "Software Development Intern",
    startDate: "June 2025",
    endDate: "Dec 2025",
    current: false,
    description: [
      "Developed and optimized RESTful APIs and backend services in Java (Spring Boot) and Python, improving system performance and scalability.",
      "Optimized MongoDB aggregation pipelines, reducing average query latency from 5s to 1.2s for high-volume data retrieval.",
      "Built Salesforce and Zoho CRM connectors supporting bulk API queries and batch-based composite operations, improving integration efficiency and reducing API overhead.",
      "Implemented frontend automation tools including a React.js Chrome extension and optimized bulk-select operations using JavaScript Sets, reducing lookup complexity from O(n) to O(1) for 1000+ records."
    ],
    technologies: ["Java (Spring Boot)", "Python", "FastAPI", "React.js", "MongoDB", "Docker", "Microservices"],
    order: 2
  }
]

const myProjects = [
  {
    title: "sparkSential – AI-Powered Credit Card Fraud Detection",
    shortDescription: "Production-grade fraud detection using PySpark, Kafka, and Deep Learning",
    fullDescription: "Built a production-grade fraud detection system leveraging PySpark for distributed ML and Kafka for real-time data streaming. Engineered a multi-layer ensemble combining XGBoost gradient boosting, deep neural networks, and statistical models to achieve 98%+ fraud classification accuracy. Designed microservice architecture for model serving with containerized inference and future MCP server integration for extensible anomaly detection.",
    category: "Machine Learning",
    technologies: ["PySpark", "Kafka", "XGBoost", "TensorFlow", "Python", "Microservices", "Docker", "Kubernetes"],
    status: "Completed",
    metrics: { accuracy: 98, performance: "Real-time streaming", impact: "High" },
    featured: true,
    order: 1
  },
  {
    title: "Distributed Log & Node Monitoring System",
    shortDescription: "Scalable real-time log ingestion and node health monitoring",
    fullDescription: "A scalable system for real-time log ingestion and node health monitoring using Kafka and Fluentd. Implemented heartbeat-based failure detection with RabbitMQ and used NoSQL storage for anomaly tracking and diagnostic reporting. Evolving into a production-grade PaaS solution with NGINX and Kubernetes.",
    category: "Distributed Systems",
    technologies: ["Python", "Kafka", "Fluentd", "RabbitMQ", "Elasticsearch", "Docker", "React"],
    status: "Completed",
    featured: true,
    order: 2
  },
  {
    title: "MyPay – UPI-Inspired Payment System",
    shortDescription: "Microservice-based UPI payment simulation",
    fullDescription: "Developed a microservice-based UPI payment simulation replicating real NPCI transaction flows. Implemented Spring Security with JWT and OAuth for secure API communication, and containerized services with Docker for deployment scalability.",
    category: "Backend",
    technologies: ["Java", "Spring Boot", "MongoDB", "Docker", "MVC"],
    status: "Completed",
    featured: false,
    order: 3
  },
  {
    title: "EcoAssist – Carbon Footprint Tracker",
    shortDescription: "ML-powered app estimating carbon footprints",
    fullDescription: "Engineered an ML-powered app to estimate individual carbon footprints based on lifestyle inputs. Integrated a LLaMA chatbot to provide personalized eco-friendly recommendations, and applied XGBoost for predictive analysis.",
    category: "Full Stack ML",
    technologies: ["Python", "XGBoost", "Next.js", "LLaMA", "PostgreSQL", "SQLite"],
    status: "Completed",
    featured: false,
    order: 4
  }
]

const myResearch = [
  {
    title: "Unveiling AI Manipulated Medical Images: Detection and Localization",
    description: "Developed a dual-stream deep learning framework for detecting and precisely localizing AI-manipulated regions in medical imaging (lung CT scans). Engineered ensemble architecture combining DenseNet-121, EfficientNet-B4, FFT-based frequency analysis, and Error Level Analysis (ELA) for robust artifact detection. Implemented GAN-based augmentation with pseudo-labeling to enhance generalization; conducted explainability analysis for publication readiness.",
    date: "2026-01-01",
    type: "paper",
    venue: "VISAPP 2026 (Accepted)",
    authors: ["Ashlesh T", "et al."],
    links: { code: "https://github.com/ashlesh" }
  },
  {
    title: "IAPP – Iterative Alignment Pseudo Pairing",
    description: "Self-learning model for image-text pairing using EfficientNet and FAISS similarity scoring. Achieved accuracy comparable to OpenAI's CLIP without supervised pre-training, demonstrating the viability of unsupervised multimodal learning.",
    date: "2025-01-01",
    type: "paper",
    venue: "Independent Research",
    authors: ["Ashlesh T"],
    links: { code: "https://github.com/ashlesh" }
  }
]

export async function POST() {
  try {
    await connectToDatabase()

    // Clear existing data
    await ProjectModel.deleteMany({})
    await PublicationModel.deleteMany({})
    await ResearchModel.deleteMany({})
    await ProfileModel.deleteMany({})
    await ExperienceModel.deleteMany({})

    // Insert user specific data
    await ProfileModel.create(myProfile)
    await ExperienceModel.insertMany(myExperience)
    await ProjectModel.insertMany(myProjects)
    await ResearchModel.insertMany(myResearch)

    return NextResponse.json({ message: "Database seeded successfully with Ashlesh's real data!" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
