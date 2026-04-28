'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Aiden Hodges',
    role: 'Director, Driven Off Road',
    quote: "I've previously used other companies to boost my Google Ads and didn't receive the results I expected for the money I was investing. I was just about to give up but thought I'd give one more company a go and found AdLab and got instant results. I haven't looked back!",
    company: 'Driven Off Road',
    avatar: 'https://cdn.prod.website-files.com/667ea7e37c1a688a520d6b30/667ea7e37c1a688a520d6bba_Aiden.webp',
  },
  {
    name: 'Laz Smith',
    role: 'Co-Founder, Apero The Label',
    quote: "We'd never used an agency for Google Ads before, but with the changes with iOS I knew this was something we couldn't ignore any longer. Ad Lab was recommended by a trusted partner and was super up-front and professional and definitely knows the stuff. Highly recommend working with Ad Lab for Google Ads.",
    company: 'Apero The Label',
    avatar: 'https://cdn.prod.website-files.com/667ea7e37c1a688a520d6b30/667ea7e37c1a688a520d6bb9_Laz.webp',
  },
  {
    name: 'Jez Hedger',
    role: 'Co-Founder, Bedzy',
    quote: "Until I was introduced to Adlab and the team, I was yet to discover an agency who could beat my own advertising performance. Adlab conducted a thorough audit of my account, and saw many opportunities for improvement so I happily handed over the keys. Before long, our business started to beat all sales records.",
    company: 'Bedzy',
    avatar: 'https://cdn.prod.website-files.com/667ea7e37c1a688a520d6b30/667ea7e37c1a688a520d6bbb_Jez.webp',
  },
]

const n = testimonials.length

type Phase = 'loading' | 'populating' | 'showing' | 'sliding'

// ─── Timing (ms) ───────────────────────────────────────────────
const CARD_HEIGHT = 185
const SWEEP_MS    = 600   // skeleton shimmer — 2 × 600 ms matches 1.2 s CSS cycle
const SWEEP_REPS  = 2
const REVEAL_MS   = 450   // cascade: 180 ms (last delay) + 280 ms duration + buffer
const POPULATE_MS = REVEAL_MS + 100
const DISPLAY_MS  = 4000
const SLIDE_MS    = 700

// ─── Easing curves ─────────────────────────────────────────────
const SLIDE_EASE  = [0.32, 0.72, 0, 1]  as const  // fast-out, smooth deceleration
const REVEAL_EASE = [0.16, 1,    0.3, 1] as const  // easeOutExpo — fluid like water

// ─── Shared Framer Motion transition configs ────────────────────
const slideTrans = { duration: SLIDE_MS / 1000, ease: SLIDE_EASE }
const snapTrans  = { duration: 0 }  // instant reset after slide

// ─── Per-element reveal: clip-path wipes left→right, opacity blooms fast ───
const FROM = { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
const TO   = { clipPath: 'inset(0 0% 0 0)',   opacity: 1 }

function revealTrans(delay: number) {
  return {
    clipPath: { duration: 0.28, ease: REVEAL_EASE, delay },
    opacity:  { duration: 0.042, ease: 'easeOut' as const, delay },
  }
}

/* ─── Skeleton bar ─────────────────────────────────────────────── */
function Skel({ className, shimmer = false }: { className?: string; shimmer?: boolean }) {
  return (
    <div
      className={`rounded-sm ${shimmer ? 'skeleton-shimmer' : 'bg-(--color-surface-stroke)'} ${className ?? ''}`}
    />
  )
}

/* ─── Skeleton card ─────────────────────────────────────────────── */
// sweep=true  → content bars shimmer; footer is always static
function SkeletonCard({ sweep = false }: { sweep?: boolean }) {
  return (
    <div className="h-full flex flex-col bg-(--color-surface-fg-01) rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[18px] rounded-br-[18px] shadow-(--shadow-surface)">
      <div className="flex-1 border border-(--color-surface-stroke) rounded-[18px] p-3 overflow-hidden relative bg-(--color-surface-primary) flex flex-col">
        <div className="flex gap-1.5 items-start">
          <Skel shimmer={sweep} className="size-[30px] flex-none rounded-full" />
          <div className="flex flex-col gap-1 flex-1 pt-0.5">
            <Skel shimmer={sweep} className="h-2 w-14" />
            <Skel shimmer={sweep} className="h-[7px] w-[90px]" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <Skel shimmer={sweep} className="h-2 w-full" />
          <Skel shimmer={sweep} className="h-[7px] w-[190px]" />
        </div>
        <div className="flex-1" />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_2px_1.5px_white]" />
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex gap-1 items-center">
          <Skel className="size-[25px] flex-none rounded-[10px]" />
          <Skel className="h-2 w-16" />
        </div>
        <Skel className="h-[25px] w-[84px] rounded-[10px]" />
      </div>
    </div>
  )
}

/* ─── Testimonial card ──────────────────────────────────────────── */
function TestiCard({ t, revealing = false }: { t: (typeof testimonials)[0]; revealing?: boolean }) {
  // Returns Framer Motion reveal props for each element, or {} when not revealing
  const r = (delay: number) => revealing
    ? { initial: FROM, animate: TO, transition: revealTrans(delay) }
    : {}

  return (
    <div className="h-full flex flex-col bg-(--color-surface-fg-01) border border-(--color-surface-stroke) rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[18px] rounded-br-[18px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05),0px_0px_6.9px_0px_rgba(204,204,204,0.25),0px_1px_2px_0px_rgba(16,24,40,0.05)]">
      <div className="flex-1 border border-(--color-surface-stroke) rounded-[18px] p-3 overflow-hidden relative bg-(--color-surface-primary) flex flex-col">
        <div className="flex items-start gap-1.5">
          <motion.img
            {...r(0)}
            src={t.avatar}
            alt={t.name}
            className="size-[30px] flex-none rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <motion.span {...r(0.04)} className="text-[12px] font-medium leading-[1.2] text-(--color-text-heading-01)">
              {t.name}
            </motion.span>
            <motion.span {...r(0.08)} className="text-[10px] font-medium leading-[1.2] text-(--color-grey-500)">
              {t.role}
            </motion.span>
          </div>
        </div>
        <motion.div {...r(0.13)} className="mt-4">
          <p className="text-[10px] font-medium leading-[1.2] text-(--color-text-heading-04)">
            {t.quote}
          </p>
        </motion.div>
        <div className="flex-1" />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_2px_1.5px_white]" />
      </div>
      <motion.div {...r(0.18)} className="flex items-center justify-between px-3 py-2">
        <div className="flex gap-1 items-center">
          <img src={t.avatar} alt={t.company} className="size-[25px] flex-none rounded-full object-cover" />
          <span className="text-[10px] font-medium leading-[1.2] text-(--color-text-body)">
            {t.company}
          </span>
        </div>
        <a
          href="https://www.ad-lab.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-(--color-purple-400) rounded-lg px-[14px] py-[6px] text-[10px] font-semibold leading-[1.2] text-(--color-white) whitespace-nowrap transition-opacity duration-150 hover:opacity-90"
        >
          See testimonial
        </a>
      </motion.div>
    </div>
  )
}

/* ─── Carousel ──────────────────────────────────────────────────── */
export function TestimonialCarousel() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)

  // Measure usable width on mount and resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setCardWidth((containerRef.current.offsetWidth - 32) / 3)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const slideOffset = cardWidth + 16

  // ── Phase machine ─────────────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    if (phase === 'loading') {
      timers.push(setTimeout(() => setPhase('populating'), SWEEP_MS * SWEEP_REPS))
    } else if (phase === 'populating') {
      timers.push(setTimeout(() => setPhase('showing'), POPULATE_MS))
    } else if (phase === 'showing') {
      timers.push(setTimeout(() => setPhase('sliding'), DISPLAY_MS))
    } else if (phase === 'sliding') {
      timers.push(setTimeout(() => {
        setIdx(i => (i + 1) % n)
        setPhase('loading')
      }, SLIDE_MS))
    }

    return () => timers.forEach(clearTimeout)
  }, [phase])

  const isSliding = phase === 'sliding'
  const isLoading = phase === 'loading'
  const prevIdx   = (idx - 1 + n) % n

  return (
    // overflow-hidden clips off-screen slot; vertical padding lets shadows breathe
    <motion.div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      animate={{ opacity: cardWidth > 0 ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: CARD_HEIGHT + 20, paddingTop: 10, paddingBottom: 10 }}
    >
      {/* ── 4-card track — Framer Motion drives the translateX ───── */}
      <motion.div
        animate={{ x: isSliding ? -slideOffset : 0 }}
        transition={isSliding ? slideTrans : snapTrans}
        style={{ display: 'flex', gap: 16, height: CARD_HEIGHT }}
      >
        {/* Slot 0 — left: always de-focused */}
        <motion.div style={{ width: cardWidth, flexShrink: 0, scaleY: 0.88, originY: 0.5 }}>
          <TestiCard t={testimonials[prevIdx]} />
        </motion.div>

        {/* Slot 1 — center: shrinks as it leaves focus during slide */}
        <motion.div
          animate={{ scaleY: isSliding ? 0.88 : 1 }}
          transition={isSliding ? slideTrans : snapTrans}
          style={{ width: cardWidth, flexShrink: 0, originY: 0.5 }}
        >
          {isLoading ? (
            <SkeletonCard sweep />
          ) : (
            // key remounts TestiCard each cycle — Framer Motion replays from initial
            <div key={idx} className="h-full">
              <TestiCard t={testimonials[idx]} revealing />
            </div>
          )}
        </motion.div>

        {/* Slot 2 — right: expands into focus as it slides to center */}
        <motion.div
          animate={{ scaleY: isSliding ? 1 : 0.88 }}
          transition={isSliding ? slideTrans : snapTrans}
          style={{ width: cardWidth, flexShrink: 0, originY: 0.5 }}
        >
          <SkeletonCard />
        </motion.div>

        {/* Slot 3 — off-screen right: always de-focused */}
        <motion.div style={{ width: cardWidth, flexShrink: 0, scaleY: 0.88, originY: 0.5 }}>
          <SkeletonCard />
        </motion.div>
      </motion.div>

      {/* ── Edge fades ────────────────────────────────────────── */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none z-10"
        style={{
          width: Math.round(cardWidth * 0.9),
          background: 'linear-gradient(to right, var(--color-surface-primary) 40%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 pointer-events-none z-10"
        style={{
          width: Math.round(cardWidth * 0.9),
          background: 'linear-gradient(to left, var(--color-surface-primary) 40%, transparent 100%)',
        }}
      />
    </motion.div>
  )
}
