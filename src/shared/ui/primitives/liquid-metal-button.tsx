import { ShaderMount, liquidMetalFragmentShader } from '@paper-design/shaders'
import { Sparkles } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type React from 'react'

interface LiquidMetalButtonProps {
  label?: string
  onClick?: () => void
  viewMode?: 'text' | 'icon'
}

const HEIGHT = 48
const ICON_SIZE = 48
const H_PADDING = 44 // total horizontal padding added to label width

export function LiquidMetalButton({
  label = 'Get Started',
  onClick,
  viewMode = 'text',
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [btnWidth, setBtnWidth] = useState(viewMode === 'icon' ? ICON_SIZE : 160)

  const shaderRef = useRef<HTMLDivElement>(null)
   
  const shaderMount = useRef<any>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const rippleId = useRef(0)

  // ── Measure label and derive button width ────────────────────────────
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (viewMode === 'icon') { setBtnWidth(ICON_SIZE); return }
    if (labelRef.current) {
       
      setBtnWidth(labelRef.current.offsetWidth + H_PADDING)
    }
  }, [label, viewMode])

  const width = btnWidth
  const height = HEIGHT
  const innerWidth = width - 4
  const innerHeight = height - 4

  // ── Inject canvas CSS once ────────────────────────────────────────────
  useEffect(() => {
    const styleId = 'shader-canvas-style-exploded'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important; height: 100% !important;
          display: block !important; position: absolute !important;
          top: 0 !important; left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // ── Mount / remount shader when width settles ─────────────────────────
  useEffect(() => {
    if (!shaderRef.current || width === 0) return
    shaderMount.current?.destroy?.()
    try {
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        { u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3,
          u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8,
          u_shape: 1, u_offsetX: 0.1, u_offsetY: -0.1 },
        undefined,
        0.6,
      )
    } catch (e) {
      console.warn('Paper Shaders WebGL not supported, using fallback button style.')
    }
    return () => { shaderMount.current?.destroy?.(); shaderMount.current = null }
  }, [width])

  const handleMouseEnter = () => { setIsHovered(true); shaderMount.current?.setSpeed?.(1) }
  const handleMouseLeave = () => { setIsHovered(false); setIsPressed(false); shaderMount.current?.setSpeed?.(0.6) }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed?.(2.4)
    setTimeout(() => shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6), 300)
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ }
      setRipples((prev) => [...prev, ripple])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600)
    }
    onClick?.()
  }

  const pressed3d = isPressed ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
  const outerShadow = isPressed
    ? '0px 0px 0px 1px rgba(0,0,0,0.5), 0px 1px 2px rgba(0,0,0,0.3)'
    : isHovered
      ? '0px 0px 0px 1px rgba(0,0,0,0.4), 0px 8px 5px rgba(0,0,0,0.1), 0px 4px 4px rgba(0,0,0,0.15)'
      : '0px 0px 0px 1px rgba(0,0,0,0.3), 0px 9px 9px rgba(0,0,0,0.12), 0px 2px 5px rgba(0,0,0,0.15)'

  return (
    <div className="relative inline-block" style={{ perspective: '1000px' }}>
      {/* Hidden label gauge — measures natural text width off-screen */}
      {viewMode === 'text' && (
        <span
          ref={labelRef}
          aria-hidden
          style={{
            position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap',
            fontSize: 15, fontWeight: 500, pointerEvents: 'none',
          }}
        >
          {label}
        </span>
      )}

      <div style={{ position: 'relative', width, height, transformStyle: 'preserve-3d', transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Label */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transform: 'translateZ(20px)', zIndex: 30, pointerEvents: 'none' }}>
          {viewMode === 'icon' && <Sparkles size={16} style={{ color: '#888', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
          {viewMode === 'text' && (
            <span style={{ fontSize: 15, color: '#888', fontWeight: 500, textShadow: '0px 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          )}
        </div>

        {/* Inner dark bg */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateZ(10px) ${pressed3d}`, zIndex: 20, transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width: innerWidth, height: innerHeight, margin: 2, borderRadius: 100, background: 'linear-gradient(180deg,#202020 0%,#000 100%)', boxShadow: isPressed ? 'inset 0 2px 4px rgba(0,0,0,0.4)' : 'none', transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
        </div>

        {/* Shader border */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateZ(0px) ${pressed3d}`, zIndex: 10, transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width, height, borderRadius: 100, boxShadow: outerShadow, transition: 'box-shadow 0.15s cubic-bezier(0.4,0,0.2,1)' }}>
            <div ref={shaderRef} className="shader-container-exploded" style={{ borderRadius: 100, overflow: 'hidden', position: 'relative', width, height }} />
          </div>
        </div>

        {/* Click target */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          aria-label={label}
          style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 40, transform: 'translateZ(25px)', borderRadius: 100, overflow: 'hidden' }}
        >
          {ripples.map((r) => (
            <span key={r.id} style={{ position: 'absolute', left: r.x, top: r.y, width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.4) 0%,rgba(255,255,255,0) 70%)', pointerEvents: 'none', animation: 'ripple-animation 0.6s ease-out' }} />
          ))}
        </button>
      </div>
    </div>
  )
}
