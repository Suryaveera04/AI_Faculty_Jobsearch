'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AcademicNode {
  id: string;
  name: string;
  category: 'university' | 'research_cluster' | 'scholar';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  glowColor: string;
  connections: string[];
}

export default function HeroCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeNodeName, setActiveNodeName] = useState<string | null>(null);
  const [activeCluster, setActiveCluster] = useState<string>('National Academic & Research Network');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Seed nodes: Key Indian Universities and Research Domains (Clean, light-theme palette)
    const nodes: AcademicNode[] = [
      { id: 'iitb', name: 'IIT Bombay', category: 'university', x: -120, y: -40, z: 0, vx: 0.1, vy: 0.15, vz: 0.05, radius: 7.5, color: '#1E3A8A', glowColor: 'rgba(30, 58, 138, 0.25)', connections: ['ai_cluster', 'vlsi_cluster', 'iisc', 'bits'] },
      { id: 'iisc', name: 'IISc Bangalore', category: 'university', x: 80, y: 60, z: -20, vx: -0.12, vy: -0.1, vz: 0.08, radius: 8.5, color: '#047857', glowColor: 'rgba(4, 120, 87, 0.25)', connections: ['quantum_cluster', 'ai_cluster', 'energy_cluster'] },
      { id: 'bits', name: 'BITS Pilani', category: 'university', x: -60, y: 110, z: 30, vx: 0.08, vy: -0.12, vz: -0.05, radius: 7, color: '#B45309', glowColor: 'rgba(180, 83, 9, 0.25)', connections: ['cyber_cluster', 'ai_cluster', 'du'] },
      { id: 'du', name: 'Delhi University', category: 'university', x: -30, y: -130, z: 10, vx: -0.09, vy: 0.08, vz: -0.07, radius: 7, color: '#2563EB', glowColor: 'rgba(37, 99, 235, 0.25)', connections: ['nlp_cluster', 'ai_cluster'] },
      { id: 'anna', name: 'Anna University', category: 'university', x: 140, y: -70, z: -40, vx: 0.07, vy: -0.14, vz: 0.06, radius: 6.5, color: '#D97706', glowColor: 'rgba(217, 119, 6, 0.25)', connections: ['vlsi_cluster', 'cyber_cluster'] },
      { id: 'ashoka', name: 'Ashoka University', category: 'university', x: 50, y: -120, z: 40, vx: -0.05, vy: 0.11, vz: -0.09, radius: 6, color: '#7C3AED', glowColor: 'rgba(124, 58, 237, 0.25)', connections: ['nlp_cluster', 'ai_cluster'] },

      // Research Clusters
      { id: 'ai_cluster', name: 'Generative AI & LLMs', category: 'research_cluster', x: 0, y: 0, z: 0, vx: 0.02, vy: -0.03, vz: 0.01, radius: 9.5, color: '#1D4ED8', glowColor: 'rgba(29, 78, 216, 0.3)', connections: ['quantum_cluster', 'nlp_cluster'] },
      { id: 'quantum_cluster', name: 'Quantum Computing', category: 'research_cluster', x: 130, y: 20, z: 60, vx: -0.06, vy: 0.05, vz: -0.04, radius: 8, color: '#6D28D9', glowColor: 'rgba(109, 40, 217, 0.25)', connections: ['vlsi_cluster'] },
      { id: 'vlsi_cluster', name: 'VLSI & Edge Chips', category: 'research_cluster', x: -140, y: 40, z: -50, vx: 0.08, vy: -0.06, vz: 0.07, radius: 7.5, color: '#EA580C', glowColor: 'rgba(234, 88, 12, 0.25)', connections: ['cyber_cluster'] },
      { id: 'nlp_cluster', name: 'Indic NLP & Speech', category: 'research_cluster', x: 10, y: -80, z: -30, vx: -0.04, vy: 0.07, vz: 0.03, radius: 7, color: '#C026D3', glowColor: 'rgba(192, 38, 211, 0.25)', connections: [] },
      { id: 'cyber_cluster', name: 'Cybersecurity & Crypto', category: 'research_cluster', x: -90, y: 120, z: -10, vx: 0.05, vy: -0.08, vz: -0.06, radius: 7, color: '#059669', glowColor: 'rgba(5, 150, 105, 0.25)', connections: [] },
      { id: 'energy_cluster', name: 'Clean Energy & Net Zero', category: 'research_cluster', x: 110, y: 130, z: 20, vx: -0.07, vy: -0.05, vz: 0.05, radius: 6.5, color: '#0284C7', glowColor: 'rgba(2, 132, 199, 0.25)', connections: [] },
    ];

    // Subtle background particles
    const dustCount = 35;
    const dustParticles = Array.from({ length: dustCount }, () => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 400,
      z: (Math.random() - 0.5) * 300,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      vz: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.5 + 0.5,
    }));

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x;
      mouseY = y;
      targetRotY = (x / width) * 0.5;
      targetRotX = -(y / height) * 0.5;

      const projectedNodes = nodes.map(n => project3D(n.x, n.y, n.z, rotX, rotY, width, height));
      let hovered: AcademicNode | null = null;
      for (let i = 0; i < nodes.length; i++) {
        const p = projectedNodes[i];
        const dx = e.clientX - rect.left - p.px;
        const dy = e.clientY - rect.top - p.py;
        if (Math.sqrt(dx * dx + dy * dy) < nodes[i].radius * p.scale * 2) {
          hovered = nodes[i];
          break;
        }
      }
      if (hovered) {
        setActiveNodeName(hovered.name);
        setActiveCluster(hovered.category === 'university' ? `Faculty Cadre: ${hovered.name}` : `Research Synergy: ${hovered.name}`);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    function project3D(x: number, y: number, z: number, rX: number, rY: number, w: number, h: number) {
      const cosY = Math.cos(rY);
      const sinY = Math.sin(rY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rX);
      const sinX = Math.sin(rX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const fov = 420;
      const cameraDistance = 330;
      const scale = fov / (cameraDistance + z2);

      return {
        px: w / 2 + x1 * scale,
        py: h / 2 + y2 * scale,
        scale: Math.max(0.25, scale),
        z: z2,
      };
    }

    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05 + 0.0012;
      pulseTime += 0.03;

      // Update Nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (node.x > 180 || node.x < -180) node.vx *= -1;
        if (node.y > 140 || node.y < -140) node.vy *= -1;
        if (node.z > 100 || node.z < -100) node.vz *= -1;
      });

      // Dust
      dustParticles.forEach(dust => {
        dust.x += dust.vx;
        dust.y += dust.vy;
        dust.z += dust.vz;
        if (dust.x > 250 || dust.x < -250) dust.vx *= -1;
        if (dust.y > 200 || dust.y < -200) dust.vy *= -1;
        if (dust.z > 150 || dust.z < -150) dust.vz *= -1;

        const p = project3D(dust.x, dust.y, dust.z, rotX, rotY, width, height);
        ctx.beginPath();
        ctx.arc(p.px, p.py, dust.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 58, 138, 0.08)';
        ctx.fill();
      });

      const projected = nodes.map(node => ({
        node,
        proj: project3D(node.x, node.y, node.z, rotX, rotY, width, height),
      }));

      projected.sort((a, b) => b.proj.z - a.proj.z);

      // Draw Connections
      ctx.lineWidth = 1.2;
      projected.forEach(({ node, proj }) => {
        node.connections.forEach(connId => {
          const target = projected.find(p => p.node.id === connId);
          if (target) {
            const grad = ctx.createLinearGradient(proj.px, proj.py, target.proj.px, target.proj.py);
            grad.addColorStop(0, 'rgba(30, 58, 138, 0.2)');
            grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.25)');
            grad.addColorStop(1, 'rgba(4, 120, 87, 0.2)');

            ctx.beginPath();
            ctx.moveTo(proj.px, proj.py);
            ctx.lineTo(target.proj.px, target.proj.py);
            ctx.strokeStyle = grad;
            ctx.stroke();

            // Animated light packet
            const t = (Math.sin(pulseTime + node.x * 0.05) + 1) / 2;
            const packetX = proj.px + (target.proj.px - proj.px) * t;
            const packetY = proj.py + (target.proj.py - proj.py) * t;

            ctx.beginPath();
            ctx.arc(packetX, packetY, 2.5 * proj.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#2563EB';
            ctx.fill();
          }
        });
      });

      // Draw Nodes
      projected.forEach(({ node, proj }) => {
        const radius = node.radius * proj.scale;

        // Outer subtle halo
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, radius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.fill();

        // Core Node
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // White border ring for crisp professional feel
        ctx.lineWidth = 1.5 * proj.scale;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Text Label
        if (proj.scale > 0.65) {
          ctx.font = `600 ${Math.round(11 * proj.scale)}px sans-serif`;
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, proj.px, proj.py + radius + 13 * proj.scale);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200 shadow-md">
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Floating Status Pill Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-1.5 rounded-full text-xs text-slate-800 flex items-center gap-2 shadow-sm font-semibold">
          <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span>{activeCluster}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full text-[11px] text-slate-600 font-mono font-medium shadow-sm">
          <span className="text-brand-700 font-bold">Interactive Academic Graph</span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl text-[11px] text-slate-700 shadow-sm">
        <div className="flex items-center gap-4 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-900" />
            <span>Universities &amp; IITs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
            <span>Research Domains</span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Center of Excellence</span>
          </div>
        </div>
        <div className="text-slate-500 text-[10px]">
          Hover over nodes to explore research synergies
        </div>
      </div>
    </div>
  );
}
