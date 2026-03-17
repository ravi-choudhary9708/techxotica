"use client";

import React, { FC, useRef, useEffect, useState } from "react";

export interface ParallaxShaderProps {
  /** Shift applied to the color palette (0–1) */
  colorShift?: number;
  /** Additional wrapper CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

const vsSource = `#version 100
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fsSource = `
precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_color_shift;

// Signed‐distance for circle
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

// Signed‐distance for box
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Smooth union
float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5*(d2-d1)/k, 0.0, 1.0);
  return mix(d2, d1, h) - k*h*(1.0-h);
}

// Inigo Quilez palette
vec3 palette(float t) {
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c*(t+u_color_shift) + d));
}

// Scene SDF
float mapScene(vec2 p) {
  float d = 1e6;
  float c1 = sdCircle(p, 0.4 + 0.1*sin(u_time * 0.5));
  float c2 = sdCircle(p, 0.6 + 0.1*cos(u_time * 0.5 + 1.57));
  d = min(d, max(-c1, c2));

  vec2 gridP = mod(p, 0.5) - 0.25;
  float ang = u_time * 0.8;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  gridP = rot * gridP;
  float boxSDF = sdBox(gridP, vec2(0.1));
  d = opSmoothUnion(d, boxSDF, 0.1);

  return d;
}

void main() {
  vec2 uv = (gl_FragCoord.xy*2.0 - u_resolution.xy)/u_resolution.y;
  vec2 uv0 = uv;

  vec2 mu = (u_mouse*2.0 - u_resolution.xy)/u_resolution.y;
  
  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 4.0; i++) {
    uv = fract(uv0 * (1.0 + i*0.2)) - 0.5;
    float d = length(uv - mu)*exp(-length(uv0));
    vec3 c = palette(length(uv0)+i*0.4 + u_time*0.4 + length(mu));
    d = sin(d*8.0 + u_time)/8.0;
    d = abs(d);
    d = pow(0.01/d, 1.2);
    col += c*d;
  }

  // Vignette
  col *= 1.0 - 0.5*dot(uv0, uv0);

  gl_FragColor = vec4(col, 1.0);
}
`;

const ParallaxShader: FC<ParallaxShaderProps> = ({
  colorShift    = 0,
  className     = "",
  ariaLabel     = "Interactive parallax shader background",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameId   = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const glContext = useRef<{
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
    program?: WebGLProgram;
    attribLoc?: number;
    uniforms?: {
      resolution: WebGLUniformLocation;
      time: WebGLUniformLocation;
      mouse: WebGLUniformLocation;
      colorShift: WebGLUniformLocation;
    };
    buffer?: WebGLBuffer;
    startTime?: number;
    mousePos?: { x: number; y: number };
  }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL2 for #version 100 support; fallback to WebGL1
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext)
      || (canvas.getContext("webgl")  as WebGLRenderingContext);
    if (!gl) {
      setTimeout(() => setError("WebGL not supported"), 0);
      return;
    }

    // Compile helper
    const compileShader = (
      type: GLenum,
      src: string
    ): WebGLShader | null => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        if (sh) gl.deleteShader(sh);
        setTimeout(() => setError("Shader compile error. See console."), 0);
        return null;
      }
      return sh;
    };

    // Compile & link program
    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      setTimeout(() => setError("Program link error. See console."), 0);
      return;
    }

    // Look up locations
    const posLoc = gl.getAttribLocation(prog, "a_position");
    const uRes   = gl.getUniformLocation(prog, "u_resolution")!;
    const uTime  = gl.getUniformLocation(prog, "u_time")!;
    const uMouse = gl.getUniformLocation(prog, "u_mouse")!;
    const uShift = gl.getUniformLocation(prog, "u_color_shift")!;

    // Full-screen quad
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,   1, 1]),
      gl.STATIC_DRAW
    );

    // Store in ref
    glContext.current = {
      gl,
      program: prog,
      attribLoc: posLoc,
      uniforms: { resolution: uRes, time: uTime, mouse: uMouse, colorShift: uShift },
      buffer: buf,
      startTime: Date.now(),
      mousePos: { x: 0, y: 0 },
    };

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      glContext.current.mousePos = {
        x: e.clientX - rect.left,
        y: rect.height - (e.clientY - rect.top),
      };
    };
    canvas.addEventListener("mousemove", handleMouse);

    // Resize observer
    const resize = () => {
      const { gl } = glContext.current;
      if (!gl || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Render loop
    const render = () => {
      const ctx = glContext.current;
      if (!ctx.gl || !ctx.program) return;

      const { gl, program, attribLoc, uniforms, buffer, startTime, mousePos } = ctx;
      const t = (Date.now() - startTime!) * 0.001;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.enableVertexAttribArray(attribLoc!);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer!);
      gl.vertexAttribPointer(attribLoc!, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uniforms!.resolution, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(uniforms!.time, t);
      gl.uniform2f(uniforms!.mouse, mousePos!.x, mousePos!.y);
      gl.uniform1f(uniforms!.colorShift, colorShift!);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      canvas.removeEventListener("mousemove", handleMouse);
      ro.disconnect();
    };
  }, [colorShift]);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white font-mono p-4">
          {error}
        </div>
      )}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ParallaxShader;
