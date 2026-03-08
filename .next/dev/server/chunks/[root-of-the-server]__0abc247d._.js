module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.warn('MONGODB_URI environment variable not set. Using mock data.');
}
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectToDatabase() {
    if (!MONGODB_URI) {
        return null;
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectToDatabase;
}),
"[project]/lib/models/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExperienceModel",
    ()=>ExperienceModel,
    "ProfileModel",
    ()=>ProfileModel,
    "ProjectModel",
    ()=>ProjectModel,
    "PublicationModel",
    ()=>PublicationModel,
    "ResearchModel",
    ()=>ResearchModel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// ============================================
// Mongoose Schema Definitions (for server-side)
// ============================================
const ProfileSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    bio: [
        String
    ],
    email: String,
    phone: String,
    location: String,
    github: String,
    linkedin: String,
    skills: [
        {
            name: String,
            category: String,
            level: Number
        }
    ],
    highlights: [
        {
            label: String,
            value: String,
            icon: String
        }
    ]
}, {
    timestamps: true
});
const ExperienceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: String,
    current: {
        type: Boolean,
        default: false
    },
    description: [
        String
    ],
    technologies: [
        String
    ],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const ProjectSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    fullDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    technologies: [
        String
    ],
    status: {
        type: String
    },
    metrics: {
        accuracy: Number,
        performance: String,
        impact: String
    },
    githubUrl: String,
    demoUrl: String,
    paperUrl: String,
    architecture: [
        {
            name: String,
            components: [
                String
            ]
        }
    ],
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const PublicationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    title: {
        type: String,
        required: true
    },
    authors: [
        String
    ],
    venue: String,
    year: {
        type: Number,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    citations: Number,
    doi: String,
    links: {
        paper: String,
        code: String
    },
    tags: [
        String
    ]
}, {
    timestamps: true
});
const ResearchSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    venue: String,
    authors: [
        String
    ],
    citations: Number,
    links: {
        paper: String,
        code: String,
        slides: String,
        video: String
    }
}, {
    timestamps: true
});
const ProfileModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Profile || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Profile', ProfileSchema);
const ExperienceModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Experience || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Experience', ExperienceSchema);
const ProjectModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Project || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Project', ProjectSchema);
const PublicationModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Publication || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Publication', PublicationSchema);
const ResearchModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Research || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Research', ResearchSchema);
}),
"[project]/app/api/admin/seed/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/index.ts [app-route] (ecmascript)");
;
;
;
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
        {
            name: "Java & Spring",
            category: "Backend",
            level: 90,
            icon: "Code"
        },
        {
            name: "Python & ML",
            category: "ML",
            level: 85,
            icon: "Brain"
        },
        {
            name: "Distributed Systems",
            category: "Architecture",
            level: 80,
            icon: "Database"
        },
        {
            name: "Docker & K8s",
            category: "DevOps",
            level: 85,
            icon: "Cpu"
        }
    ],
    highlights: [
        {
            icon: "GraduationCap",
            label: "PES University",
            value: "B.Tech CS"
        },
        {
            icon: "Award",
            label: "Published Paper",
            value: "VISAPP '26"
        },
        {
            icon: "Code",
            label: "LeetCode",
            value: "600+"
        },
        {
            icon: "Briefcase",
            label: "Internships",
            value: "2+"
        }
    ]
};
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
        technologies: [
            "Java",
            "Python",
            "Concurrency",
            "Boomi Atomsphere",
            "Spring Framework"
        ],
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
        technologies: [
            "Java (Spring Boot)",
            "Python",
            "FastAPI",
            "React.js",
            "MongoDB",
            "Docker",
            "Microservices"
        ],
        order: 2
    }
];
const myProjects = [
    {
        title: "sparkSential – AI-Powered Credit Card Fraud Detection",
        shortDescription: "Production-grade fraud detection using PySpark, Kafka, and Deep Learning",
        fullDescription: "Built a production-grade fraud detection system leveraging PySpark for distributed ML and Kafka for real-time data streaming. Engineered a multi-layer ensemble combining XGBoost gradient boosting, deep neural networks, and statistical models to achieve 98%+ fraud classification accuracy. Designed microservice architecture for model serving with containerized inference and future MCP server integration for extensible anomaly detection.",
        category: "Machine Learning",
        technologies: [
            "PySpark",
            "Kafka",
            "XGBoost",
            "TensorFlow",
            "Python",
            "Microservices",
            "Docker",
            "Kubernetes"
        ],
        status: "Completed",
        metrics: {
            accuracy: 98,
            performance: "Real-time streaming",
            impact: "High"
        },
        featured: true,
        order: 1
    },
    {
        title: "Distributed Log & Node Monitoring System",
        shortDescription: "Scalable real-time log ingestion and node health monitoring",
        fullDescription: "A scalable system for real-time log ingestion and node health monitoring using Kafka and Fluentd. Implemented heartbeat-based failure detection with RabbitMQ and used NoSQL storage for anomaly tracking and diagnostic reporting. Evolving into a production-grade PaaS solution with NGINX and Kubernetes.",
        category: "Distributed Systems",
        technologies: [
            "Python",
            "Kafka",
            "Fluentd",
            "RabbitMQ",
            "Elasticsearch",
            "Docker",
            "React"
        ],
        status: "Completed",
        featured: true,
        order: 2
    },
    {
        title: "MyPay – UPI-Inspired Payment System",
        shortDescription: "Microservice-based UPI payment simulation",
        fullDescription: "Developed a microservice-based UPI payment simulation replicating real NPCI transaction flows. Implemented Spring Security with JWT and OAuth for secure API communication, and containerized services with Docker for deployment scalability.",
        category: "Backend",
        technologies: [
            "Java",
            "Spring Boot",
            "MongoDB",
            "Docker",
            "MVC"
        ],
        status: "Completed",
        featured: false,
        order: 3
    },
    {
        title: "EcoAssist – Carbon Footprint Tracker",
        shortDescription: "ML-powered app estimating carbon footprints",
        fullDescription: "Engineered an ML-powered app to estimate individual carbon footprints based on lifestyle inputs. Integrated a LLaMA chatbot to provide personalized eco-friendly recommendations, and applied XGBoost for predictive analysis.",
        category: "Full Stack ML",
        technologies: [
            "Python",
            "XGBoost",
            "Next.js",
            "LLaMA",
            "PostgreSQL",
            "SQLite"
        ],
        status: "Completed",
        featured: false,
        order: 4
    }
];
const myResearch = [
    {
        title: "Unveiling AI Manipulated Medical Images: Detection and Localization",
        description: "Developed a dual-stream deep learning framework for detecting and precisely localizing AI-manipulated regions in medical imaging (lung CT scans). Engineered ensemble architecture combining DenseNet-121, EfficientNet-B4, FFT-based frequency analysis, and Error Level Analysis (ELA) for robust artifact detection. Implemented GAN-based augmentation with pseudo-labeling to enhance generalization; conducted explainability analysis for publication readiness.",
        date: "2026-01-01",
        type: "paper",
        venue: "VISAPP 2026 (Accepted)",
        authors: [
            "Ashlesh T",
            "et al."
        ],
        links: {
            code: "https://github.com/ashlesh"
        }
    },
    {
        title: "IAPP – Iterative Alignment Pseudo Pairing",
        description: "Self-learning model for image-text pairing using EfficientNet and FAISS similarity scoring. Achieved accuracy comparable to OpenAI's CLIP without supervised pre-training, demonstrating the viability of unsupervised multimodal learning.",
        date: "2025-01-01",
        type: "paper",
        venue: "Independent Research",
        authors: [
            "Ashlesh T"
        ],
        links: {
            code: "https://github.com/ashlesh"
        }
    }
];
async function POST() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Clear existing data
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProjectModel"].deleteMany({});
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PublicationModel"].deleteMany({});
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ResearchModel"].deleteMany({});
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProfileModel"].deleteMany({});
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ExperienceModel"].deleteMany({});
        // Insert user specific data
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProfileModel"].create(myProfile);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ExperienceModel"].insertMany(myExperience);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProjectModel"].insertMany(myProjects);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ResearchModel"].insertMany(myResearch);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Database seeded successfully with Ashlesh's real data!"
        });
    } catch (error) {
        console.error("Error seeding database:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to seed database"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0abc247d._.js.map