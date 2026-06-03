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
  p = fract(p * vec2(271.91, 419.37));
  p += dot(p, p + 33.73);
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

void main() {
  vec2 uv = vUv;
  vec2 centered = uv * 2.0 - 1.0;
  centered.x *= uResolution.x / uResolution.y;

  // Signup uses the same signal-grid language as login, but with an upward build.
  vec2 pointer = (uMouse - 0.5) * vec2(0.1, -0.08);
  vec2 p = centered + pointer;
  p.y -= p.x * 0.14;

  float time = uTime * 0.16;
  float perspective = mix(1.34, 0.7, smoothstep(-1.0, 1.0, p.y));
  vec2 fieldUv = vec2(p.x * perspective, p.y);
  fieldUv += vec2(-time * 0.12, time * 0.12);

  vec2 gridScale = vec2(34.0, 38.0);
  vec2 cell = floor(fieldUv * gridScale);
  vec2 local = fract(fieldUv * gridScale) - 0.5;

  float id = hash(cell);
  float pulse = sin(time * 3.6 + id * 6.2831 - cell.x * 0.13 + cell.y * 0.18);
  float wave = smoothstep(-0.35, 1.0, pulse);
  float terrain = noise(cell * 0.075 + vec2(-time * 0.05, time * 0.06));

  float dotRadius = mix(0.045, 0.135, terrain) + wave * 0.03;
  float dot = smoothstep(dotRadius, dotRadius * 0.45, length(local));

  float verticalRise = smoothstep(-1.2, 1.05, -p.x * 0.25 + p.y * 0.48);
  float topBloom = smoothstep(-0.95, 0.9, p.y) * 0.045;
  float verticalFade = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.76, uv.y);
  float edgeLight = smoothstep(0.0, 0.48, uv.x) * smoothstep(1.0, 0.5, uv.x);

  float shade = 0.016;
  shade += dot * (0.07 + terrain * 0.2 + wave * 0.075);
  shade += verticalRise * 0.052;
  shade += topBloom;
  shade *= verticalFade * edgeLight;

  float grain = (hash(uv * uResolution + floor(uTime * 20.0)) - 0.5) * 0.01;
  gl_FragColor = vec4(vec3(clamp(shade + grain, 0.0, 0.4)), 1.0);
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
        ASPIO BOARD - LESS CHAOES, MORE MOMENTUM
      </div>
    </div>
  );
}
