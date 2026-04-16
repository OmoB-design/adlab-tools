'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import LeftPanel from '@/components/left-panel'
import { calculateRevenue } from '@/lib/calculations'

const platformLabels: Record<string, string> = {
  google:  'Google only',
  meta:    'Meta only',
  both:    'Both',
  neither: 'Neither',
}

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function fmtMonth(n: number) {
  return `${fmt(n)}/mo`
}

function generateInsight(platform: string, roas: number, adSpend: number): string {
  const spendK = Math.round(adSpend / 1000)
  if (platform === 'meta') {
    return `Running Meta-only at ${roas}x ROAS while ignoring Google means you're missing the highest-intent buyers in your category. Our clients in your spend range see an average 8.78x ROAS on Google within 90 days.`
  }
  if (platform === 'google') {
    return `At ${roas}x ROAS on a $${spendK}k/mo budget, you're leaving significant revenue on the table. Our clients at this spend level consistently achieve 8.78x ROAS with the right optimisation strategy. The gap is fixable.`
  }
  if (platform === 'both') {
    return `Running both Google and Meta at ${roas}x blended ROAS shows clear room for improvement. Ad-Lab clients in your spend range achieve 8.78x on Google alone — the right allocation and bidding strategy makes all the difference.`
  }
  return `At ${roas}x ROAS, there's a clear opportunity to grow. Ad-Lab clients in your spend range see an average 8.78x ROAS within 90 days of working with us.`
}

function ResultsContent() {
  const searchParams  = useSearchParams()
  const adSpendRaw  = parseFloat(searchParams.get('adSpend')  ?? '0') || 0
  const roasRaw     = parseFloat(searchParams.get('roas')     ?? '0') || 0
  const platformKey = searchParams.get('platform') ?? 'google'

  const results = calculateRevenue({
    monthlySpend: adSpendRaw,
    currentRoas:  roasRaw,
    platform:     platformKey as 'google',
  })
  const annualCurrentRevenue = results.currentRevenue * 12
  const insight = generateInsight(platformKey, roasRaw, adSpendRaw)

  // ── Resizable split panel ────────────────────────────────────────────────
  const [leftPct, setLeftPct]     = useState(50)
  const containerRef              = useRef<HTMLDivElement>(null)
  const isDragging                = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x    = e.clientX - rect.left
      const pct  = Math.min(Math.max((x / rect.width) * 100, 25), 75)
      setLeftPct(pct)
    }
    const onUp = () => { isDragging.current = false }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [])

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
  }
  // ────────────────────────────────────────────────────────────────────────

  const summary = {
    adSpend:  fmt(adSpendRaw),
    roas:     `${roasRaw}x`,
    platform: platformLabels[platformKey] ?? platformKey,
    dim:      true,
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--color-surface-fg-01)">

      <LeftPanel currentView="summary" summary={summary} />

      {/* Right panel */}
      <main className="relative flex flex-1 flex-col overflow-hidden rounded-bl-(--radius-6xl) rounded-tl-(--radius-6xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) shadow-(--shadow-panel)">

        <div className="flex flex-1 flex-col items-start gap-(--space-50) overflow-y-auto px-(--space-120) pt-(--space-120) pb-(--space-64)">

          {/* Notification tag */}
          <div className="px-(--space-0) py-(--space-12)">
            <div className="inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
              <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                Ad-Lab | tools.ad-lad.io
              </span>
            </div>
          </div>

          {/* ── Two-column results card (Book frame) ── */}
          <div
            ref={containerRef}
            className="relative flex w-full select-none shadow-[0px_0px_24px_0px_rgba(226,226,226,0.25)]"
          >
            {/* Left column — "Where you are now" */}
            <div
              style={{ width: `${leftPct}%` }}
              className="relative flex flex-col rounded-tl-(--radius-4xl) rounded-bl-(--radius-4xl) border-[0.5px] border-(--color-surface-stroke) p-(--space-20) overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-surface-warm)" />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_1.8px_0px_rgba(255,255,255,0.9)]" />

              {/* Current state */}
              <div className="relative flex flex-col gap-(--space-16) pb-(--space-24)">
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                  Where you are now?
                </p>
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  {fmtMonth(results.currentRevenue)}
                </p>
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                  At {roasRaw}x ROAS on {fmt(adSpendRaw)}/mo
                </p>
              </div>

              {/* Divider */}
              <div className="relative border-t-[0.8px] border-(--color-surface-stroke)" />

              {/* Annual projection */}
              <div className="relative flex flex-col gap-(--space-16) pt-(--space-24)">
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-01)">
                  Annual projection
                </p>
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  {fmt(annualCurrentRevenue)}
                </p>
              </div>
            </div>

            {/* Right column — "Where Ad-Lab clients are" */}
            <div
              style={{ width: `${100 - leftPct}%` }}
              className="relative flex flex-col gap-(--space-18) rounded-tr-(--radius-4xl) rounded-br-(--radius-4xl) border-[0.5px] border-(--color-surface-stroke) pl-(--space-40) pr-(--space-20) py-(--space-20) overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-surface-dashboard)" />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_1.8px_0px_rgba(255,250,250,0.9)]" />

              {/* Projected state */}
              <div className="relative flex flex-col gap-(--space-16) pb-(--space-24)">
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                  Where Ad-Lab clients like you are
                </p>
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  {fmtMonth(results.projectedRevenue)}
                </p>
                <div className="flex flex-col gap-(--space-8)">
                  <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                    That&apos;s{' '}
                    <span className="text-(--color-text-heading-02)">{fmt(results.monthlyGap)}</span>
                    {' '}you&apos;re not making every month.
                  </p>
                  {results.annualGap > 0 && (
                    <p className="font-sans text-caption-2 font-medium leading-tight text-(--color-grey-500)">
                      Over a year: {fmt(results.annualGap)} in your competitor&apos;s pocket
                    </p>
                  )}
                </div>
              </div>

              {/* Insights card + CTAs */}
              <div className="relative flex flex-col gap-(--space-32)">

                {/* Insights notification card */}
                <div className="rounded-(--radius-3xl) bg-(--color-surface-fg-01) shadow-(--shadow-xs)">
                  <div className="px-(--space-10) py-(--space-8)">
                    <div className="inline-flex items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
                      <span className="text-caption-3 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                        Ad-Lab | Insights
                      </span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-(--radius-3xl) border-[0.647px] border-(--color-surface-stroke) px-(--space-10) py-(--space-12) shadow-(--shadow-float)">
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-surface-primary)" />
                    <p className="relative font-sans text-caption-2 font-normal leading-tight text-(--color-text-body)">
                      {insight}
                    </p>
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2.59px_2.59px_0px_rgba(246,246,246,0.25)]" />
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col gap-(--space-12)">
                  <button
                    type="button"
                    className="relative w-full overflow-hidden rounded-(--radius-lg) border-[0.8px] border-(--color-white) px-(--space-12) py-(--space-12) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft)"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-btn-primary-bg)" />
                    <span className="relative">Book a call — 2/9 slots left</span>
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1.5px_2px_0px_rgba(0,0,0,0.08)]" />
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-(--radius-lg) bg-(--color-btn-dark-bg) px-(--space-12) py-(--space-12) text-center text-caption-2 font-medium leading-tight text-(--color-white) shadow-(--shadow-soft)"
                  >
                    Grade my Google Ads account
                  </button>
                </div>
              </div>
            </div>

            {/* ── Panel move handle ── */}
            <div
              onMouseDown={handleDragStart}
              style={{ left: `${leftPct}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
              className="absolute z-10 h-[20px] w-[8px] cursor-ew-resize rounded-(--radius-2xl) border-[0.5px] border-(--color-surface-stroke) bg-(--color-surface-stroke) shadow-[0px_0px_2px_0px_rgba(155,155,155,0.25),inset_0px_2px_3px_0px_rgba(255,255,255,0.6),inset_0px_0px_2px_0px_white,inset_0px_0px_1px_0px_rgba(217,217,217,0.9)]"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  )
}
