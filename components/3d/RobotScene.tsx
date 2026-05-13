'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export const ROBOT_MODEL_PATH = '/models/robot.glb'

export type RobotEmotion = 'idle' | 'happy' | 'thinking' | 'waving'

const ACCENT = '#6366f1'
const BODY = '#27272a'
const GLOW = '#818cf8'

const WANDER_BOUNDS_X = 2.2
const WANDER_SPEED = 0.55
const TARGET_THRESHOLD = 0.1

// Perimeter waypoints: top-right → bottom-right → bottom-left → top-left → ...
const PERIMETER_WAYPOINTS = [
  new THREE.Vector2( 2.0,  1.35),
  new THREE.Vector2( 2.0, -1.35),
  new THREE.Vector2(-2.0, -1.35),
  new THREE.Vector2(-2.0,  1.35),
]
const PERIMETER_SPEED = 0.9
const PERIMETER_THRESHOLD = 0.12

function randomWanderTarget() {
  return (Math.random() - 0.5) * 2 * WANDER_BOUNDS_X
}

interface PlaceholderRobotProps {
  emotion: RobotEmotion
  targetX?: number
  flyTrigger?: number
  perimeter?: boolean
}

function PlaceholderRobot({ emotion, targetX, flyTrigger, perimeter }: PlaceholderRobotProps) {
  const groupRef    = useRef<THREE.Group>(null)
  const headRef     = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftArmRef  = useRef<THREE.Group>(null)
  const leftLegRef  = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  // Wander mode state
  const wanderTargetX = useRef(0)
  const enteredRef    = useRef(false)
  const flyTargetRef  = useRef<number | null>(null)

  // Perimeter mode state
  const waypointIdx = useRef(0)
  const perimeterReady = useRef(false)

  useEffect(() => {
    if (!perimeter && targetX !== undefined) {
      flyTargetRef.current = targetX
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTrigger])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    const pos  = groupRef.current.position

    if (perimeter) {
      // ── Perimeter walk ────────────────────────────────────
      const target = PERIMETER_WAYPOINTS[waypointIdx.current]

      if (!perimeterReady.current) {
        // Slide to first waypoint on load
        pos.x = THREE.MathUtils.lerp(pos.x, target.x, delta * 2.5)
        pos.y = THREE.MathUtils.lerp(pos.y, target.y, delta * 2.5)
        if (Math.abs(pos.x - target.x) < 0.2 && Math.abs(pos.y - target.y) < 0.2) {
          perimeterReady.current = true
        }
      } else {
        const dx = target.x - pos.x
        const dy = target.y - pos.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < PERIMETER_THRESHOLD) {
          waypointIdx.current = (waypointIdx.current + 1) % PERIMETER_WAYPOINTS.length
        } else {
          const nx = dx / dist
          const ny = dy / dist
          pos.x += nx * PERIMETER_SPEED * delta
          pos.y += ny * PERIMETER_SPEED * delta

          // Face direction of travel
          const targetRY = Math.atan2(-nx, 0)
          groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            nx > 0.3 ? -0.35 : nx < -0.3 ? 0.35 : 0,
            delta * 5
          )

          // Head bobs opposite to travel direction slightly
          if (headRef.current) {
            headRef.current.rotation.z = THREE.MathUtils.lerp(
              headRef.current.rotation.z, nx * 0.08, delta * 4
            )
          }
        }
      }

      // Walking leg swing
      const walkCycle = Math.sin(time * 7)
      if (leftLegRef.current)  leftLegRef.current.rotation.x  =  walkCycle * 0.38
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.38

      // Arm swing while walking
      const rArm = rightArmRef.current
      const lArm = leftArmRef.current
      if (rArm) { rArm.rotation.z = THREE.MathUtils.lerp(rArm.rotation.z, -0.25, delta * 4); rArm.rotation.x =  walkCycle * 0.3 }
      if (lArm) { lArm.rotation.z = THREE.MathUtils.lerp(lArm.rotation.z,  0.25, delta * 4); lArm.rotation.x = -walkCycle * 0.3 }
      return
    }

    // ── Wander mode ──────────────────────────────────────────
    if (!enteredRef.current) {
      pos.x = THREE.MathUtils.lerp(pos.x, 0, delta * 3)
      if (Math.abs(pos.x) < 0.06) {
        enteredRef.current = true
        wanderTargetX.current = randomWanderTarget()
      }
    } else if (flyTargetRef.current !== null) {
      pos.x = THREE.MathUtils.lerp(pos.x, flyTargetRef.current, delta * 5)
      const dir = Math.sign(flyTargetRef.current - pos.x)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, dir > 0 ? 0.2 : -0.2, delta * 8
      )
      if (Math.abs(pos.x - flyTargetRef.current) < 0.12) {
        flyTargetRef.current = null
        wanderTargetX.current = randomWanderTarget()
      }
    } else {
      const dist = Math.abs(pos.x - wanderTargetX.current)
      if (dist < TARGET_THRESHOLD) {
        wanderTargetX.current = randomWanderTarget()
      } else {
        const dir = Math.sign(wanderTargetX.current - pos.x)
        pos.x += dir * WANDER_SPEED * delta
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y, dir > 0 ? 0.18 : -0.18, delta * 4
        )
      }
    }

    // ── Emotion animations (wander mode) ─────────────────────
    const head = headRef.current
    const rArm = rightArmRef.current
    const lArm = leftArmRef.current

    switch (emotion) {
      case 'happy':
        pos.y = Math.sin(time * 4.5) * 0.1
        if (rArm) { rArm.rotation.z = THREE.MathUtils.lerp(rArm.rotation.z, -0.9, delta * 6); rArm.rotation.x = THREE.MathUtils.lerp(rArm.rotation.x, 0, delta * 6) }
        if (lArm)  lArm.rotation.z  = THREE.MathUtils.lerp(lArm.rotation.z,  0.9, delta * 6)
        if (head) { head.rotation.z = Math.sin(time * 6) * 0.06; head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0, delta * 4) }
        break
      case 'thinking':
        pos.y = Math.sin(time * 0.7) * 0.04
        if (head) { head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, -0.18, delta * 3); head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.1, delta * 3) }
        if (rArm) { rArm.rotation.z = THREE.MathUtils.lerp(rArm.rotation.z, 0.55, delta * 4);  rArm.rotation.x = THREE.MathUtils.lerp(rArm.rotation.x, -0.45, delta * 4) }
        if (lArm)  lArm.rotation.z  = THREE.MathUtils.lerp(lArm.rotation.z,  0, delta * 4)
        break
      case 'waving':
        pos.y = Math.sin(time * 1.1) * 0.06
        if (rArm) { rArm.rotation.z = Math.sin(time * 6) * 1.0 - 0.05; rArm.rotation.x = THREE.MathUtils.lerp(rArm.rotation.x, 0, delta * 4) }
        if (lArm)  lArm.rotation.z  = THREE.MathUtils.lerp(lArm.rotation.z,  0, delta * 4)
        if (head) { head.rotation.y = Math.sin(time * 2.2) * 0.14; head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, 0, delta * 4); head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0, delta * 4) }
        break
      default:
        pos.y = Math.sin(time * 0.9) * 0.07
        if (rArm) { rArm.rotation.z = Math.sin(time * 3.5) * 0.55 - 0.25; rArm.rotation.x = THREE.MathUtils.lerp(rArm.rotation.x, 0, delta * 3) }
        if (lArm)  lArm.rotation.z  = THREE.MathUtils.lerp(lArm.rotation.z,  0, delta * 3)
        if (head) { head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, 0, delta * 3); head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, 0, delta * 3); head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0, delta * 3) }
        break
    }
  })

  return (
    <group ref={groupRef} position={[perimeter ? 2.0 : 4.5, perimeter ? 1.35 : 0, 0]}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.62, 0.82, 0.36]} />
        <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.17, 16]} />
        <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.29, 32, 32]} />
        <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Eye left */}
      <mesh position={[-0.1, 0.9, 0.27]}>
        <sphereGeometry args={[0.052, 16, 16]} />
        <meshStandardMaterial color={ACCENT} emissive={GLOW} emissiveIntensity={2.5} />
      </mesh>
      {/* Eye right */}
      <mesh position={[0.1, 0.9, 0.27]}>
        <sphereGeometry args={[0.052, 16, 16]} />
        <meshStandardMaterial color={ACCENT} emissive={GLOW} emissiveIntensity={2.5} />
      </mesh>
      {/* Chest glow */}
      <mesh position={[0, 0.1, 0.19]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color={ACCENT} emissive={GLOW} emissiveIntensity={1.5} />
      </mesh>
      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.48, 0.29, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.17, 0.57, 0.17]} />
          <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.61, 0]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
      {/* Right arm */}
      <group ref={rightArmRef} position={[0.48, 0.29, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.17, 0.57, 0.17]} />
          <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.61, 0]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.17, -0.7, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.17, -0.7, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  )
}

export interface RobotSceneProps {
  className?: string
  emotion?: RobotEmotion
  targetX?: number
  flyTrigger?: number
  perimeter?: boolean
}

export function RobotScene({ className = '', emotion = 'idle', targetX, flyTrigger, perimeter }: RobotSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} castShadow />
        <pointLight position={[-4, 4, -4]} intensity={0.6} color="#818cf8" />
        <pointLight position={[0, -2, 3]} intensity={0.3} color="#6366f1" />
        <PlaceholderRobot
          emotion={emotion}
          targetX={targetX}
          flyTrigger={flyTrigger}
          perimeter={perimeter}
        />
      </Canvas>
    </div>
  )
}
