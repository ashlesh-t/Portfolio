"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

function NeuralNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const { nodes, connections, linePositions } = useMemo(() => {
    const nodeCount = 80
    const nodes: THREE.Vector3[] = []
    const connections: [number, number][] = []
    
    // Create nodes in layered structure (like neural network layers)
    const layers = 5
    const nodesPerLayer = Math.floor(nodeCount / layers)
    
    for (let layer = 0; layer < layers; layer++) {
      const x = (layer - layers / 2) * 4
      for (let i = 0; i < nodesPerLayer; i++) {
        const y = (Math.random() - 0.5) * 12
        const z = (Math.random() - 0.5) * 8 - 5
        nodes.push(new THREE.Vector3(x, y, z))
      }
    }
    
    // Create connections between adjacent layers
    for (let layer = 0; layer < layers - 1; layer++) {
      const startIdx = layer * nodesPerLayer
      const endIdx = (layer + 1) * nodesPerLayer
      
      for (let i = startIdx; i < startIdx + nodesPerLayer; i++) {
        // Connect to 2-3 random nodes in next layer
        const connectionCount = 2 + Math.floor(Math.random() * 2)
        for (let c = 0; c < connectionCount; c++) {
          const targetIdx = endIdx + Math.floor(Math.random() * nodesPerLayer)
          if (targetIdx < nodes.length) {
            connections.push([i, targetIdx])
          }
        }
      }
    }
    
    // Create line positions array
    const linePositions = new Float32Array(connections.length * 6)
    connections.forEach((conn, idx) => {
      const start = nodes[conn[0]]
      const end = nodes[conn[1]]
      linePositions[idx * 6] = start.x
      linePositions[idx * 6 + 1] = start.y
      linePositions[idx * 6 + 2] = start.z
      linePositions[idx * 6 + 3] = end.x
      linePositions[idx * 6 + 4] = end.y
      linePositions[idx * 6 + 5] = end.z
    })
    
    return { nodes, connections, linePositions }
  }, [])
  
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const pulseOffsets = useMemo(() => 
    nodes.map(() => Math.random() * Math.PI * 2), 
  [nodes])
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    
    const time = clock.getElapsedTime()
    
    nodes.forEach((node, i) => {
      dummy.position.copy(node)
      // Gentle floating animation
      dummy.position.y += Math.sin(time * 0.5 + pulseOffsets[i]) * 0.1
      
      // Pulsing scale
      const scale = 0.08 + Math.sin(time * 2 + pulseOffsets[i]) * 0.02
      dummy.scale.setScalar(scale)
      
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    
    // Update line positions for floating effect
    if (linesRef.current) {
      const positions = linesRef.current.geometry.attributes.position.array as Float32Array
      connections.forEach((conn, idx) => {
        const start = nodes[conn[0]].clone()
        const end = nodes[conn[1]].clone()
        start.y += Math.sin(time * 0.5 + pulseOffsets[conn[0]]) * 0.1
        end.y += Math.sin(time * 0.5 + pulseOffsets[conn[1]]) * 0.1
        
        positions[idx * 6] = start.x
        positions[idx * 6 + 1] = start.y
        positions[idx * 6 + 2] = start.z
        positions[idx * 6 + 3] = end.x
        positions[idx * 6 + 4] = end.y
        positions[idx * 6 + 5] = end.z
      })
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group>
      {/* Neural nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </instancedMesh>
      
      {/* Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length * 2}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}

function DataFlowParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const { positions, velocities, paths } = useMemo(() => {
    const count = 100
    const positions = new Float32Array(count * 3)
    const velocities: number[] = []
    const paths: { start: THREE.Vector3; end: THREE.Vector3; progress: number }[] = []
    
    for (let i = 0; i < count; i++) {
      const startX = -10 + Math.random() * 2
      const endX = 8 + Math.random() * 2
      const y = (Math.random() - 0.5) * 12
      const z = (Math.random() - 0.5) * 8 - 5
      
      positions[i * 3] = startX
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      velocities.push(0.002 + Math.random() * 0.003)
      paths.push({
        start: new THREE.Vector3(startX, y, z),
        end: new THREE.Vector3(endX, y + (Math.random() - 0.5) * 2, z),
        progress: Math.random()
      })
    }
    
    return { positions, velocities, paths }
  }, [])
  
  useFrame(() => {
    if (!particlesRef.current) return
    
    const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    paths.forEach((path, i) => {
      path.progress += velocities[i]
      if (path.progress > 1) {
        path.progress = 0
        path.start.y = (Math.random() - 0.5) * 12
        path.end.y = path.start.y + (Math.random() - 0.5) * 2
      }
      
      const pos = path.start.clone().lerp(path.end, path.progress)
      positionArray[i * 3] = pos.x
      positionArray[i * 3 + 1] = pos.y
      positionArray[i * 3 + 2] = pos.z
    })
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a855f7"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, -5]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshBasicMaterial
        color="#00f0ff"
        wireframe
        transparent
        opacity={0.05}
      />
    </mesh>
  )
}

export function NeuralNetworkBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)" }}
      >
        <ambientLight intensity={0.5} />
        <NeuralNodes />
        <DataFlowParticles />
        <GridPlane />
      </Canvas>
    </div>
  )
}
