---
version: 1.0.0
name: YUGA-linear-raycast-design-system
description: |
  A precision-engineered, dark-canvas union portal blending Linear's deep obsidian surface ladder
  (#010102 -> #07080a -> #0f1011 -> #141516), Raycast's command-palette aesthetic, and Vercel's
  rigorous Web Interface Guidelines. Features crisp hairline borders (1px solid rgba(255,255,255,0.08)),
  milled-edge inner glows (inset 0 1px 0 rgba(255,255,255,0.08)), high-contrast typography in
  Plus Jakarta Sans and Space Grotesk, subtle luminous violet and emerald medical accents,
  and keyboard-first Command+K instant navigation.

colors:
  canvas: "#040307"
  canvas-subtle: "#07060c"
  surface-1: "#0a0912"
  surface-2: "#100f1a"
  surface-card: "#0d0c16"
  surface-elevated: "#161424"
  hairline: "rgba(255, 255, 255, 0.08)"
  hairline-strong: "rgba(255, 255, 255, 0.16)"
  hairline-glow: "rgba(139, 92, 246, 0.35)"
  ink: "#f4f4f7"
  ink-secondary: "#b3afc2"
  ink-muted: "#7c778f"
  ink-tertiary: "#544f66"
  accent-violet: "#8b5cf6"
  accent-violet-light: "#c4b5fd"
  accent-emerald: "#10b981"
  accent-emerald-light: "#6ee7b7"
  accent-amber: "#f59e0b"
  accent-rose: "#f43f5e"

typography:
  display-hero:
    fontFamily: Space Grotesk, sans-serif
    letterSpacing: -0.035em
    textWrap: balance
  display-card:
    fontFamily: Space Grotesk, sans-serif
    letterSpacing: -0.02em
  body:
    fontFamily: Plus Jakarta Sans, sans-serif
    letterSpacing: -0.01em
  mono:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace

bezel:
  outer: "rounded-2xl border border-white/[0.08] bg-[#0c0b14]/80 backdrop-blur-xl"
  inner-bevel: "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_20px_40px_-15px_rgba(0,0,0,0.7)]"
  hover: "hover:border-violet-500/30 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_25px_50px_-12px_rgba(139,92,246,0.12)]"

rules:
  accessibility:
    - All icon buttons must contain aria-label
    - All decorative icons must contain aria-hidden="true"
    - Visible focus rings via focus-visible:ring-2 focus-visible:ring-violet-500
    - Text wrap balance on all major titles
    - Loading states and ellipsis formatted as "…"
---
