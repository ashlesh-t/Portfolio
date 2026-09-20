"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-animations"
import {
  Coffee,
  Zap,
  Terminal,
  Layers,
  Server,
  Workflow,
  Database,
  Boxes,
  Container,
  Network,
  Cloud,
  Bot,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

interface SkillNode {
  id: string
  label: string
  tagline: string
  accent: string
  icon: LucideIcon
  domain: string
  usedFor: string
  ecosystem: string[]
  usedIn: string[]
}

const SKILL_NODES: SkillNode[] = [
  {
    id: "java",
    label: "Java",
    tagline: "Backend · JVM",
    accent: "#f89820",
    icon: Coffee,
    domain: "Backend Language",
    usedFor: "Enterprise connector development and JVM concurrency-critical systems",
    ecosystem: ["Spring Boot", "Jakarta EE", "Multithreading", "JDBC"],
    usedIn: ["Boomi enterprise connectors — Database, MQTT, OAuth 2.0"],
  },
  {
    id: "go",
    label: "Go",
    tagline: "Systems · Concurrency",
    accent: "#00add8",
    icon: Zap,
    domain: "Systems Language",
    usedFor: "High-throughput, goroutine-based concurrent services",
    ecosystem: ["Goroutines", "Channels", "Kafka", "Kubernetes"],
    usedIn: ["Distributed Log & Node Monitoring Platform — migrated ingestion path to Go for lower per-connection memory footprint"],
  },
  {
    id: "python",
    label: "Python",
    tagline: "AI/ML · Scripting",
    accent: "#facc15",
    icon: Terminal,
    domain: "Scripting & AI Language",
    usedFor: "Automation pipelines, agentic AI tooling, ML research",
    ecosystem: ["FastAPI", "PyTorch", "LangChain"],
    usedIn: ["Boomi AtomSphere regression automation", "CogniRepo MCP server"],
  },
  {
    id: "spring-boot",
    label: "Spring Boot",
    tagline: "Microservices",
    accent: "#6dba26",
    icon: Layers,
    domain: "Backend Framework",
    usedFor: "Production REST APIs and enterprise service layers",
    ecosystem: ["Jakarta EE", "JDBC", "Microservices"],
    usedIn: ["GOwarm.ai multi-tenant REST APIs"],
  },
  {
    id: "fastapi",
    label: "FastAPI",
    tagline: "Async APIs",
    accent: "#05998b",
    icon: Server,
    domain: "Async Web Framework",
    usedFor: "High-performance Python APIs and WebSocket backends",
    ecosystem: ["WebSockets", "Pydantic", "Uvicorn"],
    usedIn: ["Boomi agentic test-coverage platform backend"],
  },
  {
    id: "kafka",
    label: "Kafka",
    tagline: "Event Streaming",
    accent: "#a78bfa",
    icon: Workflow,
    domain: "Event Streaming",
    usedFor: "Real-time log ingestion and streaming data pipelines",
    ecosystem: ["RabbitMQ", "Fluentd", "Elasticsearch"],
    usedIn: ["Distributed Log & Node Monitoring Platform", "SparkSentinel fraud detection"],
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    tagline: "Relational DB",
    accent: "#4f9fd6",
    icon: Database,
    domain: "Relational Database",
    usedFor: "Transactional persistence for production systems",
    ecosystem: ["JDBC", "MySQL", "SQL Server", "Oracle"],
    usedIn: ["Boomi Database connector", "test-coverage platform persistence layer"],
  },
  {
    id: "mongodb",
    label: "MongoDB",
    tagline: "NoSQL · Data",
    accent: "#47a248",
    icon: Boxes,
    domain: "Document Database",
    usedFor: "Flexible-schema storage and aggregation-heavy workloads",
    ecosystem: ["Aggregation Framework", "Mongoose"],
    usedIn: ["GOwarm.ai — cut aggregation query latency from 5s to 1.2s"],
  },
  {
    id: "docker",
    label: "Docker",
    tagline: "DevOps · Deploy",
    accent: "#2496ed",
    icon: Container,
    domain: "Containerization",
    usedFor: "Reproducible runtime environments and deployment",
    ecosystem: ["Kubernetes", "CI/CD"],
    usedIn: ["Dockerised Boomi runtime execution", "SparkSentinel microservice deployment"],
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    tagline: "Orchestration",
    accent: "#326ce5",
    icon: Network,
    domain: "Container Orchestration",
    usedFor: "Scaling and self-healing distributed node deployments",
    ecosystem: ["Docker", "Elasticsearch"],
    usedIn: ["Distributed Log & Node Monitoring Platform"],
  },
  {
    id: "aws",
    label: "AWS",
    tagline: "Cloud · Infra",
    accent: "#ff9900",
    icon: Cloud,
    domain: "Cloud Infrastructure",
    usedFor: "Compute and storage for deployed services",
    ecosystem: ["EC2", "S3", "IAM"],
    usedIn: ["Cloud-hosted service deployments"],
  },
  {
    id: "mcp",
    label: "MCP",
    tagline: "Agentic AI",
    accent: "#00f0ff",
    icon: Bot,
    domain: "Agentic AI Protocol",
    usedFor: "Tool-using, autonomous multi-step AI pipelines with human approval gates",
    ecosystem: ["Custom skills & plugins", "Approval-gated workflows"],
    usedIn: ["Boomi agentic test-coverage platform", "CogniRepo — published on PyPI and LobeHub"],
  },
  {
    id: "rag",
    label: "RAG",
    tagline: "LLM Grounding",
    accent: "#a855f7",
    icon: Sparkles,
    domain: "Retrieval-Augmented Generation",
    usedFor: "Grounding LLM output in retrieved, verifiable knowledge",
    ecosystem: ["LangChain", "ChromaDB", "FAISS"],
    usedIn: ["CogniRepo — semantic repository memory and hybrid retrieval, cutting LLM token use 70–80%"],
  },
]

const AUTO_CYCLE_MS = 4000
const ELECTRON_ORBIT_RADIUS = 78
const ELECTRON_ORBIT_MS = 7000

const CORE_BASE_COLOR = "#00f0ff"

function ReactorCore({ boosted, impactColor }: { boosted: boolean; impactColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const currentBoost = useRef(1)
  const targetColor = useRef(new THREE.Color(CORE_BASE_COLOR))
  const baseColor = useMemo(() => new THREE.Color(CORE_BASE_COLOR), [])

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 1.5) * 0.08
    currentBoost.current += ((boosted ? 1.5 : 1) - currentBoost.current) * 0.1
    meshRef.current.scale.setScalar(pulse * currentBoost.current)
    meshRef.current.rotation.y += 0.003
    meshRef.current.rotation.x += 0.001

    // Flash to the impacting skill's colour, then ease back to the base cyan.
    targetColor.current.set(boosted ? impactColor : CORE_BASE_COLOR)
    materialRef.current.color.lerp(targetColor.current, boosted ? 0.35 : 0.08)
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.85, 1]} />
      <meshBasicMaterial ref={materialRef} color={baseColor} wireframe transparent opacity={0.55} />
    </mesh>
  )
}

function ReactorRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.15
    if (ring2.current) ring2.current.rotation.z -= delta * 0.1
    if (ring3.current) ring3.current.rotation.x += delta * 0.08
  })

  return (
    <group>
      <mesh ref={ring1}>
        <torusGeometry args={[1.5, 0.01, 8, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[1.95, 0.008, 8, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring3} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

function AmbientParticles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const count = 140
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 1.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.4
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#a855f7" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function ReactorScene({ boosted, impactColor }: { boosted: boolean; impactColor: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <ReactorRings />
      <ReactorCore boosted={boosted} impactColor={impactColor} />
      <AmbientParticles />
    </Canvas>
  )
}

function SkillHud({ node }: { node: SkillNode }) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl border border-primary/20 p-6 md:p-8 font-mono"
    >
      <div className="flex items-center gap-2 mb-4 text-xs text-secondary">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_currentColor]" />
        <span>{`> skill_selected("${node.id}")`}</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight">{node.label}</h3>
      <dl className="space-y-5 text-sm">
        <div>
          <dt className="text-primary text-xs uppercase tracking-widest mb-1.5">Domain</dt>
          <dd className="text-muted-foreground leading-relaxed">{node.domain}</dd>
        </div>
        <div>
          <dt className="text-primary text-xs uppercase tracking-widest mb-1.5">Used For</dt>
          <dd className="text-muted-foreground leading-relaxed">{node.usedFor}</dd>
        </div>
        <div>
          <dt className="text-primary text-xs uppercase tracking-widest mb-1.5">Ecosystem</dt>
          <dd className="flex flex-wrap gap-2 mt-1">
            {node.ecosystem.map((e) => (
              <span key={e} className="px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-secondary text-xs">
                {e}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-primary text-xs uppercase tracking-widest mb-1.5">Used In</dt>
          <dd className="space-y-1.5 mt-1">
            {node.usedIn.map((u) => (
              <div key={u} className="flex gap-2 text-muted-foreground text-sm leading-relaxed">
                <span className="text-accent shrink-0">▸</span>
                <span>{u}</span>
              </div>
            ))}
          </dd>
        </div>
      </dl>
    </motion.div>
  )
}

// Electron sub-orbit: the selected skill's closest ecosystem items, rendered
// as small nodes continuously orbiting it — a secondary "atom" axis around
// whichever primary tech is currently active.
function ElectronOrbit({ node, x, y }: { node: SkillNode; x: number; y: number }) {
  const items = node.ecosystem.slice(0, 4)
  const durationS = ELECTRON_ORBIT_MS / 1000

  return (
    <motion.div
      key={node.id}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[7]"
      style={{ left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span
        className="absolute rounded-full border border-dashed"
        style={{
          left: -ELECTRON_ORBIT_RADIUS,
          top: -ELECTRON_ORBIT_RADIUS,
          width: ELECTRON_ORBIT_RADIUS * 2,
          height: ELECTRON_ORBIT_RADIUS * 2,
          borderColor: `${node.accent}33`,
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: durationS, repeat: Infinity, ease: "linear" }}
      >
        {items.map((label, i) => {
          const angle = (i / items.length) * 360
          return (
            <div
              key={label}
              className="absolute left-0 top-0"
              style={{ transform: `rotate(${angle}deg) translateX(${ELECTRON_ORBIT_RADIUS}px)` }}
            >
              <motion.div
                className="flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{ duration: durationS, repeat: Infinity, ease: "linear" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: node.accent, boxShadow: `0 0 6px 1px ${node.accent}` }}
                />
                <span
                  className="text-[8px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded-full border backdrop-blur-sm"
                  style={{
                    borderColor: `${node.accent}40`,
                    color: node.accent,
                    backgroundColor: "rgba(6, 10, 20, 0.65)",
                  }}
                >
                  {label}
                </span>
              </motion.div>
            </div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

// Numeric 0-100 layout (matches the SVG viewBox) so node badges, connection
// arcs, and the firing particle all share one coordinate space.
function useRadialLayout(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        return { x: 50 + Math.cos(angle) * 40, y: 50 + Math.sin(angle) * 40 }
      }),
    [count]
  )
}

function arcControlPoint(x: number, y: number, i: number) {
  const cx = 50
  const cy = 50
  const mx = (x + cx) / 2
  const my = (y + cy) / 2
  // perpendicular to the node->center vector, alternating side per index
  const dx = cx - x
  const dy = cy - y
  const len = Math.hypot(dx, dy) || 1
  const perpX = (-dy / len) * (i % 2 === 0 ? 1 : -1) * 9
  const perpY = (dx / len) * (i % 2 === 0 ? 1 : -1) * 9
  return { cx: mx + perpX, cy: my + perpY }
}

export function SkillsSection() {
  const [selected, setSelected] = useState<SkillNode>(SKILL_NODES[0])
  const [firingId, setFiringId] = useState<string | null>(null)
  const [boosted, setBoosted] = useState(false)
  const autoIndex = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const positions = useRadialLayout(SKILL_NODES.length)

  const fire = useCallback((node: SkillNode) => {
    setFiringId(node.id)
    const arriveTimer = setTimeout(() => {
      setBoosted(true)
      setTimeout(() => setBoosted(false), 350)
    }, 650)
    const clearTimer = setTimeout(() => setFiringId(null), 750)
    return () => {
      clearTimeout(arriveTimer)
      clearTimeout(clearTimer)
    }
  }, [])

  const restartAutoCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const id = setInterval(() => {
      // Guard against a stale interval (e.g. one already queued in the
      // event loop the instant a click called restartAutoCycle) acting
      // after a newer interval has taken over.
      if (timerRef.current !== id) return
      autoIndex.current = (autoIndex.current + 1) % SKILL_NODES.length
      const node = SKILL_NODES[autoIndex.current]
      setSelected(node)
      fire(node)
    }, AUTO_CYCLE_MS)
    timerRef.current = id
  }, [fire])

  useEffect(() => {
    restartAutoCycle()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [restartAutoCycle])

  const handleNodeClick = (node: SkillNode, idx: number) => {
    autoIndex.current = idx
    setSelected(node)
    fire(node)
    restartAutoCycle()
  }

  const firingIdx = firingId ? SKILL_NODES.findIndex((n) => n.id === firingId) : -1
  const firingPos = firingIdx >= 0 ? positions[firingIdx] : null
  const firingArc = firingIdx >= 0 ? arcControlPoint(firingPos!.x, firingPos!.y, firingIdx) : null
  const impactColor = firingIdx >= 0 ? SKILL_NODES[firingIdx].accent : CORE_BASE_COLOR

  const selectedIdx = SKILL_NODES.findIndex((n) => n.id === selected.id)
  const selectedPos = positions[selectedIdx]

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
              <Terminal className="w-3 h-3" />
              <span>initialize_skill_matrix()</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-mono tracking-tighter">
              ENGINEERING <span className="text-primary text-glow-blue">REACTOR</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm md:text-base">
              // technologies colliding to build real-world systems
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: radial reactor + HUD */}
        <div className="hidden md:grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7 relative aspect-square w-full max-w-[640px] mx-auto">
            {/* Plasma core bloom, tinted to the impacting skill's colour */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
              <motion.div
                className="w-24 h-24 rounded-full blur-3xl"
                animate={{
                  opacity: boosted ? 0.65 : 0.25,
                  scale: boosted ? 1.5 : 1,
                  backgroundColor: impactColor,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="absolute inset-0">
              <ReactorScene boosted={boosted} impactColor={impactColor} />
            </div>

            {/* Persistent curved orbital connections from each node to the core */}
            <svg
              className="absolute inset-0 w-full h-full z-[5] pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {SKILL_NODES.map((node, i) => {
                const pos = positions[i]
                const { cx, cy } = arcControlPoint(pos.x, pos.y, i)
                const isActive = selected.id === node.id
                const d = `M ${pos.x} ${pos.y} Q ${cx} ${cy} 50 50`
                return (
                  <path
                    key={node.id}
                    d={d}
                    fill="none"
                    stroke={node.accent}
                    strokeWidth={isActive ? 0.45 : 0.22}
                    opacity={isActive ? 0.55 : 0.12}
                    style={{ transition: "opacity 0.4s ease, stroke-width 0.4s ease" }}
                  />
                )
              })}
            </svg>

            {/* Firing particle, travels the same arc as the node's connection */}
            <AnimatePresence>
              {firingId && firingPos && firingArc && (
                <motion.div
                  key={firingId}
                  className="absolute w-2 h-2 rounded-full pointer-events-none z-20"
                  style={{
                    marginLeft: -4,
                    marginTop: -4,
                    backgroundColor: SKILL_NODES[firingIdx].accent,
                    boxShadow: `0 0 12px 2px ${SKILL_NODES[firingIdx].accent}`,
                  }}
                  initial={{ left: `${firingPos.x}%`, top: `${firingPos.y}%`, opacity: 1, scale: 1 }}
                  animate={{
                    left: [`${firingPos.x}%`, `${firingArc.cx}%`, "50%"],
                    top: [`${firingPos.y}%`, `${firingArc.cy}%`, "50%"],
                    opacity: [1, 1, 0.2],
                    scale: [1, 1, 0.4],
                  }}
                  transition={{ duration: 0.65, ease: "easeIn", times: [0, 0.55, 1] }}
                />
              )}
            </AnimatePresence>

            {/* Electron sub-orbit: the selected skill's ecosystem, continuously orbiting it */}
            <AnimatePresence>
              {selectedPos && <ElectronOrbit node={selected} x={selectedPos.x} y={selectedPos.y} />}
            </AnimatePresence>

            {SKILL_NODES.map((node, i) => {
              const Icon = node.icon
              const isActive = selected.id === node.id
              return (
                <motion.button
                  key={node.id}
                  onClick={() => handleNodeClick(node, i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1 group cursor-pointer"
                  style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View ${node.label} details`}
                >
                  <span
                    className="w-11 h-11 rounded-xl border flex items-center justify-center backdrop-blur-md transition-all"
                    style={{
                      borderColor: isActive ? node.accent : `${node.accent}33`,
                      backgroundColor: isActive ? `${node.accent}22` : "rgba(15, 20, 35, 0.4)",
                      boxShadow: isActive ? `0 0 16px 1px ${node.accent}66` : "none",
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors"
                      style={{ color: isActive ? node.accent : `${node.accent}99` }}
                    />
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
                      isActive ? "text-foreground" : "text-muted-foreground/70"
                    }`}
                  >
                    {node.label}
                  </span>
                  <span className="text-[8px] font-mono text-muted-foreground/40 whitespace-nowrap">
                    {node.tagline}
                  </span>
                </motion.button>
              )
            })}
          </div>

          <div className="col-span-5">
            <AnimatePresence mode="wait">
              <SkillHud node={selected} />
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile fallback: chip row + HUD, smaller reactor */}
        <div className="md:hidden">
          <div className="relative h-52 mb-8 opacity-70">
            <ReactorScene boosted={boosted} impactColor={impactColor} />
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {SKILL_NODES.map((node, i) => {
              const Icon = node.icon
              const isActive = selected.id === node.id
              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node, i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                    isActive ? "" : "text-muted-foreground"
                  }`}
                  style={{
                    borderColor: isActive ? node.accent : `${node.accent}30`,
                    backgroundColor: isActive ? `${node.accent}22` : "transparent",
                    color: isActive ? node.accent : undefined,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {node.label}
                </button>
              )
            })}
          </div>
          <AnimatePresence mode="wait">
            <SkillHud node={selected} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
