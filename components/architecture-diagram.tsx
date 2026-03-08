"use client"

import { motion } from "framer-motion"
import { Database, Brain, Cpu, Zap, BarChart3, ArrowRight } from "lucide-react"

interface ArchitectureNode {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

const pipelineStages: ArchitectureNode[] = [
  { id: "dataset", label: "Dataset", icon: Database, color: "#00f0ff" },
  { id: "model", label: "Model", icon: Brain, color: "#a855f7" },
  { id: "training", label: "Training", icon: Cpu, color: "#00f0ff" },
  { id: "inference", label: "Inference", icon: Zap, color: "#a855f7" },
  { id: "results", label: "Results", icon: BarChart3, color: "#00f0ff" },
]

export function ArchitectureDiagram() {
  return (
    <div className="relative py-8">
      {/* Main pipeline */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {pipelineStages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center border-2 bg-background/80 backdrop-blur-sm"
                style={{ borderColor: stage.color }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: `0 0 20px ${stage.color}40`
                }}
              >
                <stage.icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: stage.color }} />
              </motion.div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                {stage.label}
              </span>
            </motion.div>
            
            {index < pipelineStages.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                viewport={{ once: true }}
                className="mx-1 md:mx-2"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {/* Animated data flow line */}
      <svg className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 -z-10 overflow-visible">
        <motion.line
          x1="7%"
          y1="0"
          x2="93%"
          y2="0"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

interface DetailedArchitectureProps {
  title: string
  layers: {
    name: string
    components: string[]
  }[]
}

export function DetailedArchitecture({ title, layers }: DetailedArchitectureProps) {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
      <h4 className="font-semibold text-foreground mb-4">{title}</h4>
      <div className="space-y-3">
        {layers.map((layer, layerIdx) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: layerIdx * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">{layer.name}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {layer.components.map((comp) => (
                  <span
                    key={comp}
                    className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
