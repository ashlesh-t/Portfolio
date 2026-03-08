import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ProjectModel, PublicationModel, ResearchModel } from "@/lib/models"

const mockProjects = [
  {
    title: "Vision Transformer for Medical Imaging",
    shortDescription: "State-of-the-art ViT architecture achieving 98.7% accuracy in tumor detection",
    fullDescription: "Developed a custom Vision Transformer architecture specifically optimized for medical imaging applications. The model processes high-resolution CT scans and MRI images to detect various types of tumors with unprecedented accuracy. Implemented attention visualization for interpretability, crucial for medical applications.",
    category: "Computer Vision",
    technologies: ["PyTorch", "ViT", "CUDA", "TensorRT", "ONNX"],
    status: "Completed",
    metrics: {
      accuracy: 98.7,
      performance: "15ms inference",
      impact: "50K+ scans analyzed"
    },
    githubUrl: "https://github.com/example/medical-vit",
    demoUrl: "https://demo.example.com/medical-vit",
    architecture: [
      { name: "Input Layer", components: ["Image Preprocessing", "Patch Embedding", "Position Encoding"] },
      { name: "Transformer Blocks", components: ["Multi-Head Attention", "MLP", "Layer Norm"] },
      { name: "Classification Head", components: ["Global Average Pool", "Dense Layers", "Softmax"] }
    ],
    featured: true,
    order: 1
  },
  {
    title: "Large Language Model Fine-tuning Pipeline",
    shortDescription: "Efficient LoRA-based fine-tuning system for domain-specific LLMs",
    fullDescription: "Built a comprehensive pipeline for fine-tuning large language models using LoRA and QLoRA techniques. The system reduces training costs by 90% while maintaining model quality. Includes automated evaluation, A/B testing framework, and deployment infrastructure.",
    category: "NLP",
    technologies: ["Transformers", "LoRA", "DeepSpeed", "Ray", "Weights & Biases"],
    status: "In Progress",
    metrics: {
      accuracy: 94.2,
      performance: "90% cost reduction",
      impact: "10B tokens processed"
    },
    githubUrl: "https://github.com/example/llm-pipeline",
    architecture: [
      { name: "Data Pipeline", components: ["Dataset Curation", "Tokenization", "Batching"] },
      { name: "Training", components: ["LoRA Adapters", "Gradient Checkpointing", "Mixed Precision"] },
      { name: "Evaluation", components: ["Perplexity", "BLEU Score", "Human Eval"] }
    ],
    featured: true,
    order: 2
  },
  {
    title: "Real-time Object Detection System",
    shortDescription: "Edge-optimized YOLO variant running at 120 FPS on mobile devices",
    fullDescription: "Engineered a highly optimized object detection model designed for mobile and edge deployment. The architecture combines neural architecture search with knowledge distillation to achieve state-of-the-art speed-accuracy tradeoffs on resource-constrained devices.",
    category: "Computer Vision",
    technologies: ["TensorFlow Lite", "CoreML", "NNAPI", "Quantization", "Pruning"],
    status: "Completed",
    metrics: {
      accuracy: 91.5,
      performance: "120 FPS on mobile",
      impact: "1M+ daily users"
    },
    githubUrl: "https://github.com/example/edge-detection",
    demoUrl: "https://demo.example.com/edge-detection",
    architecture: [
      { name: "Backbone", components: ["MobileNetV3", "Feature Pyramid Network"] },
      { name: "Neck", components: ["PANet", "SPP"] },
      { name: "Head", components: ["Anchor-free Detection", "NMS"] }
    ],
    featured: false,
    order: 3
  },
  {
    title: "Distributed Training Framework",
    shortDescription: "Scalable infrastructure for training models across 1000+ GPUs",
    fullDescription: "Designed and implemented a distributed training framework that enables efficient model training across thousands of GPUs. Features automatic checkpoint management, fault tolerance, and dynamic resource allocation. Reduced training time for 100B parameter models from weeks to days.",
    category: "MLOps",
    technologies: ["PyTorch", "NCCL", "Kubernetes", "Slurm", "Prometheus"],
    status: "Completed",
    metrics: {
      performance: "95% GPU utilization",
      impact: "100B+ parameters trained"
    },
    githubUrl: "https://github.com/example/distributed-training",
    architecture: [
      { name: "Orchestration", components: ["Job Scheduler", "Resource Manager", "Health Monitor"] },
      { name: "Communication", components: ["All-Reduce", "Ring Topology", "Gradient Compression"] },
      { name: "Storage", components: ["Distributed Checkpointing", "Data Sharding", "Caching"] }
    ],
    featured: true,
    order: 4
  },
  {
    title: "Neural Architecture Search AutoML",
    shortDescription: "Automated discovery of optimal architectures for specific tasks",
    fullDescription: "Developed an AutoML system using neural architecture search to automatically discover optimal model architectures for given tasks. The system has discovered architectures that outperform hand-designed models on multiple benchmarks while requiring minimal human intervention.",
    category: "Deep Learning",
    technologies: ["JAX", "Optuna", "Ray Tune", "Neural Networks", "Genetic Algorithms"],
    status: "In Progress",
    metrics: {
      accuracy: 96.8,
      performance: "10x faster search",
      impact: "15 novel architectures"
    },
    architecture: [
      { name: "Search Space", components: ["Operation Types", "Connection Patterns", "Hyperparameters"] },
      { name: "Search Strategy", components: ["Evolutionary Search", "Reinforcement Learning", "Differentiable"] },
      { name: "Evaluation", components: ["Weight Sharing", "Early Stopping", "Proxy Tasks"] }
    ],
    featured: false,
    order: 5
  }
]

const mockPublications = [
  {
    title: "Scaling Vision Transformers to 22 Billion Parameters",
    authors: ["Sarah Chen", "et al."],
    venue: "NeurIPS",
    year: 2024,
    abstract: "We present ViT-22B, the largest dense Vision Transformer model to date. We demonstrate that scaling up the model leads to improved performance on a variety of vision benchmarks while maintaining computational efficiency through novel architectural innovations.",
    citations: 234,
    doi: "10.1234/example",
    links: {
      paper: "https://arxiv.org/example",
      code: "https://github.com/example/vit-22b"
    },
    tags: ["Vision Transformer", "Scaling", "Computer Vision"]
  },
  {
    title: "Efficient Attention Mechanisms for Long Sequences",
    authors: ["Sarah Chen", "John Smith", "Alice Johnson"],
    venue: "ICML",
    year: 2024,
    abstract: "We introduce a novel attention mechanism that reduces computational complexity from O(n²) to O(n log n) while preserving model quality. Our approach enables processing of sequences up to 1M tokens on consumer hardware.",
    citations: 456,
    doi: "10.1234/example2",
    links: {
      paper: "https://arxiv.org/example",
      code: "https://github.com/example/efficient-attention"
    },
    tags: ["Attention", "Transformers", "Efficiency"]
  },
  {
    title: "Self-Supervised Learning for Medical Image Analysis",
    authors: ["Sarah Chen", "Medical AI Team"],
    venue: "Nature Machine Intelligence",
    year: 2023,
    abstract: "We present a self-supervised learning framework specifically designed for medical imaging that achieves state-of-the-art results on tumor detection, segmentation, and classification tasks with 90% less labeled data.",
    citations: 789,
    doi: "10.1038/example",
    links: {
      paper: "https://nature.com/example"
    },
    tags: ["Medical AI", "Self-Supervised Learning", "Healthcare"]
  },
  {
    title: "Neural Architecture Search: A Comprehensive Survey",
    authors: ["Sarah Chen", "David Lee"],
    venue: "JMLR",
    year: 2023,
    abstract: "A comprehensive survey of neural architecture search methods, covering search spaces, search strategies, and performance estimation. We analyze over 500 papers and provide guidelines for practitioners.",
    citations: 1234,
    doi: "10.1234/example4",
    links: {
      paper: "https://jmlr.org/example"
    },
    tags: ["AutoML", "NAS", "Survey"]
  },
  {
    title: "Multimodal Foundation Models for Scientific Discovery",
    authors: ["Sarah Chen", "Science AI Consortium"],
    venue: "Science",
    year: 2023,
    abstract: "We introduce a multimodal foundation model trained on scientific literature, experimental data, and domain knowledge. The model accelerates scientific discovery by predicting experimental outcomes and suggesting novel hypotheses.",
    citations: 567,
    doi: "10.1126/example",
    links: {
      paper: "https://science.org/example",
      code: "https://github.com/example/sci-foundation"
    },
    tags: ["Foundation Models", "Science AI", "Multimodal"]
  }
]

const mockResearch = [
  {
    title: "Attention Is All You Need: Transformer Architecture Improvements",
    description: "Presented novel improvements to transformer attention mechanisms, achieving 15% faster training while maintaining accuracy.",
    date: "2024-11-15",
    type: "paper",
    venue: "NeurIPS 2024",
    authors: ["Sarah Chen", "John Smith", "Alice Johnson"],
    citations: 127,
    links: {
      paper: "https://arxiv.org/example",
      code: "https://github.com/example/transformer-improvements"
    }
  },
  {
    title: "Best Paper Award - ICML 2024",
    description: "Recognized for groundbreaking work on efficient neural architecture search methods.",
    date: "2024-07-20",
    type: "award",
    venue: "ICML 2024"
  },
  {
    title: "Scaling Laws for Vision Transformers",
    description: "Comprehensive study on how vision transformer performance scales with model size and training data.",
    date: "2024-05-10",
    type: "paper",
    venue: "CVPR 2024",
    authors: ["Sarah Chen", "Michael Brown", "Emma Davis"],
    citations: 234,
    links: {
      paper: "https://arxiv.org/example",
      slides: "https://slides.example.com"
    }
  },
  {
    title: "Keynote: The Future of AI Systems",
    description: "Delivered keynote on emerging trends in AI systems design and the path toward more efficient models.",
    date: "2024-03-15",
    type: "talk",
    venue: "AI Summit 2024",
    links: {
      video: "https://youtube.com/example"
    }
  },
  {
    title: "Efficient Fine-tuning of Foundation Models",
    description: "Novel parameter-efficient techniques for adapting large models to downstream tasks with minimal compute.",
    date: "2023-12-01",
    type: "paper",
    venue: "EMNLP 2023",
    authors: ["Sarah Chen", "David Lee", "Rachel Kim"],
    citations: 456,
    links: {
      paper: "https://arxiv.org/example",
      code: "https://github.com/example/efficient-finetuning"
    }
  },
  {
    title: "Research Lead - AI Lab",
    description: "Promoted to Research Lead, overseeing a team of 15 researchers working on next-generation AI systems.",
    date: "2023-09-01",
    type: "milestone"
  },
  {
    title: "Multi-modal Learning Without Labels",
    description: "Self-supervised approach for learning joint representations across vision and language modalities.",
    date: "2023-06-20",
    type: "paper",
    venue: "ICLR 2023",
    authors: ["Sarah Chen", "James Wilson"],
    citations: 789,
    links: {
      paper: "https://arxiv.org/example",
      code: "https://github.com/example/multimodal-ssl"
    }
  }
]

export async function POST() {
  try {
    await connectToDatabase()

    // Clear existing data
    await ProjectModel.deleteMany({})
    await PublicationModel.deleteMany({})
    await ResearchModel.deleteMany({})

    // Insert mock data
    await ProjectModel.insertMany(mockProjects)
    await PublicationModel.insertMany(mockPublications)
    await ResearchModel.insertMany(mockResearch)

    return NextResponse.json({ message: "Database seeded successfully with mock data!" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
