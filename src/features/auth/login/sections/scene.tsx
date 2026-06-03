"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;

void main() {
  // Pass UV coordinates through so the fragment shader can draw per-pixel patterns.
  vUv = uv;

  // Full-screen clip-space quad; no camera transform is needed for the backdrop.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(318.31, 173.17));
  p += dot(p, p + 41.43);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float line(float value, float width) {
  return smoothstep(width, 0.0, abs(value));
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv * 2.0 - 1.0;
  centered.x *= uResolution.x / uResolution.y;

  // A restrained perspective transform makes the field feel architectural.
  vec2 pointer = (uMouse - 0.5) * vec2(0.08, -0.06);
  vec2 p = centered + pointer;
  p.y += p.x * 0.18;

  float time = uTime * 0.18;
  float perspective = mix(0.72, 1.32, smoothstep(-1.0, 1.0, p.y));
  vec2 fieldUv = vec2(p.x * perspective, p.y) + vec2(time * 0.18, -time * 0.08);

  vec2 gridScale = vec2(42.0, 30.0);
  vec2 cell = floor(fieldUv * gridScale);
  vec2 local = fract(fieldUv * gridScale) - 0.5;

  float id = hash(cell);
  float pulse = sin(time * 4.0 + id * 6.2831 + cell.x * 0.17 + cell.y * 0.11);
  float wave = smoothstep(-0.2, 1.0, pulse);
  float terrain = noise(cell * 0.08 + vec2(time * 0.08, -time * 0.04));

  float dotRadius = mix(0.055, 0.16, terrain) + wave * 0.035;
  float dot = smoothstep(dotRadius, dotRadius * 0.42, length(local));

  float largeGradient = smoothstep(-1.25, 1.15, p.x * 0.45 + p.y * 0.25);
  float vignette = smoothstep(1.55, 0.22, length(centered));
  float edgeLight = smoothstep(0.0, 0.55, uv.x) * smoothstep(1.0, 0.45, uv.x);

  float shade = 0.018;
  shade += dot * (0.08 + terrain * 0.22 + wave * 0.08);
  shade += largeGradient * 0.055;
  shade *= vignette * edgeLight;

  float grain = (hash(uv * uResolution + floor(uTime * 24.0)) - 0.5) * 0.01;
  gl_FragColor = vec4(vec3(clamp(shade + grain, 0.0, 0.42)), 1.0);
}
`;

function MinimalShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Keep uniform object identities stable so Three can update values in place.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.height, size.width, uniforms]);

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value.lerp(
      new THREE.Vector2(
        state.pointer.x * 0.5 + 0.5,
        state.pointer.y * 0.5 + 0.5,
      ),
      0.06,
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        depthTest={false}
        depthWrite={false}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

export function Scene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <Canvas className="h-full w-full" dpr={[1, 1.5]}>
        <MinimalShader />
      </Canvas>
      <div className="pointer-events-none absolute bottom-12 left-12 text-xs uppercase tracking-[0.2em] text-white/40">
        ASPIO BOARD - FOCUS ON WHAT MATTERS
      </div>
    </div>
  );
}
