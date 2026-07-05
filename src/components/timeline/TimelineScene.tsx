"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import type { Mesh } from "three";

function DriftingPetals() {
  return (
    <Sparkles
      count={140}
      scale={[16, 10, 8]}
      size={3}
      speed={0.25}
      opacity={0.7}
      color="#ff6f91"
    />
  );
}

function GlowKnot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08;
      ref.current.rotation.y += delta * 0.12;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={[3.2, 0.4, -4]} scale={1.4}>
        <torusKnotGeometry args={[1, 0.28, 180, 24]} />
        <meshStandardMaterial
          color="#E60026"
          emissive="#8a0018"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function GlowSphere() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.05;
  });
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={1.6}>
      <mesh ref={ref} position={[-3.6, -0.8, -3]} scale={1}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff2f52"
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.4}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function TimelineScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#ff6f91" />
      <pointLight position={[-5, -3, -5]} intensity={20} color="#4d6bff" />
      <fog attach="fog" args={["#0b0710", 6, 16]} />
      <GlowKnot />
      <GlowSphere />
      <DriftingPetals />
    </Canvas>
  );
}
