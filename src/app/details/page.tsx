'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

function DetailsContent() {
  const searchParams = useSearchParams()
  const adSpendRaw = parseFloat(searchParams.get('adSpend') ?? '0') || 0
  const roasRaw    = parseFloat(searchParams.get('roas')    ?? '0') || 0
  const platformKey = searchParams.get('platform') ?? 'google'

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [consented, setConsented] = useState(true)
  const [loading,   setLoading]   = useState(false)

  const router = useRouter()

  const navigateToResults = () => {
    router.push(
      `/results?adSpend=${adSpendRaw}&roas=${roasRaw}&platform=${platformKey}`
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const results = calculateRevenue({
        monthlySpend: adSpendRaw,
        currentRoas:  roasRaw,
        platform:     platformKey as 'google',
      })
      await fetch('/api/calculator/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fullName,
          email,
          consented,
          inputs: { monthlySpend: adSpendRaw, currentRoas: roasRaw, platform: platformKey },
          results,
        }),
      })
    } catch {
      // non-blocking — still navigate to results
    } finally {
      setLoading(false)
      navigateToResults()
    }
  }

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

        {/* Scrollable content area */}
        <div className="flex flex-1 flex-col gap-(--space-20) overflow-y-auto px-(--space-120) pt-(--space-120) pb-(--space-64)">

          {/* Notification tag */}
          <div className="px-(--space-0) py-(--space-12)">
            <div className="inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
              <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                Ad-Lab | tools.ad-lad.io
              </span>
            </div>
          </div>

          {/* Title + form */}
          <div className="flex flex-col gap-(--space-40)">

            {/* Title */}
            <div className="flex flex-col gap-(--space-8)">
              <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                Almost there!
              </p>
              <p className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-06)">
                Where should we send your full breakdown?
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-(--space-40)">

              {/* Fields */}
              <div className="flex flex-col gap-(--space-32)">
                <div className="flex flex-col gap-[16px]">

                  {/* Full name */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      htmlFor="fullName"
                      className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-01)"
                    >
                      Full name
                    </label>
                    <div className="flex w-full items-center overflow-hidden rounded-(--radius-xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-[14px] py-(--space-14) shadow-(--shadow-input) transition-[border-color,box-shadow] duration-150 ease-in-out focus-within:border-(--color-purple-400) focus-within:shadow-[0px_0px_0px_2px_rgba(202,93,236,0.15)]">
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="flex-1 bg-transparent text-caption-1 font-medium leading-tight text-(--color-text-heading-02) outline-none placeholder:text-(--color-grey-400)"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      htmlFor="email"
                      className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-01)"
                    >
                      Email address
                    </label>
                    <div className="flex w-full items-center overflow-hidden rounded-(--radius-xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-[14px] py-(--space-14) shadow-(--shadow-input) transition-[border-color,box-shadow] duration-150 ease-in-out focus-within:border-(--color-purple-400) focus-within:shadow-[0px_0px_0px_2px_rgba(202,93,236,0.15)]">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email@yourbrand.com"
                        className="flex-1 bg-transparent text-caption-1 font-medium leading-tight text-(--color-text-heading-02) outline-none placeholder:text-(--color-grey-400)"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent + button */}
                <div className="flex flex-col gap-(--space-32)">

                  {/* Consent row */}
                  <button
                    type="button"
                    onClick={() => setConsented(!consented)}
                    className="flex items-start gap-(--space-10)"
                  >
                    {consented ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[1px] flex-none">
                        <g clipPath="url(#consent-badge)">
                          <path d="M15.1111 8C15.1111 7.02489 14.6062 6.12089 13.8089 5.59377C14 4.65689 13.7174 3.66044 13.0285 2.97155C12.3396 2.28266 11.3422 2 10.4062 2.19111C9.87825 1.39377 8.97514 0.888885 8.00003 0.888885C7.02492 0.888885 6.12092 1.39377 5.59381 2.19111C4.65425 1.99733 3.66047 2.28266 2.97158 2.97155C2.2818 3.66133 2.00003 4.65689 2.19114 5.59377C1.3938 6.12089 0.888916 7.024 0.888916 8C0.888916 8.976 1.3938 9.87822 2.19114 10.4062C2.00003 11.3431 2.2818 12.3387 2.97158 13.0284C3.66047 13.7182 4.65603 13.9991 5.59381 13.8089C6.12092 14.6062 7.02403 15.1111 8.00003 15.1111C8.97603 15.1111 9.87825 14.6062 10.4062 13.8089C11.3405 14 12.3387 13.7173 13.0285 13.0284C13.7182 12.3396 14 11.3431 13.8089 10.4062C14.6062 9.87911 15.1111 8.97511 15.1111 8ZM11.416 5.96266L7.63825 10.8516C7.51736 11.008 7.33336 11.1031 7.13603 11.1102C7.12714 11.1102 7.11914 11.1102 7.11114 11.1102C6.92269 11.1102 6.74225 11.0302 6.61514 10.8898L4.61514 8.66755C4.36892 8.39377 4.39114 7.97244 4.66492 7.72533C4.93958 7.48 5.36003 7.50133 5.60714 7.77511L7.07203 9.40355L10.3618 5.14666C10.5867 4.85511 11.0062 4.80177 11.2969 5.02666C11.5885 5.25155 11.6418 5.67022 11.4169 5.96177L11.416 5.96266Z" fill="#CA5DEC"/>
                        </g>
                        <defs>
                          <clipPath id="consent-badge">
                            <rect width="16" height="16" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    ) : (
                      <div className="mt-[1px] size-[16px] flex-none rounded-full border border-(--color-surface-stroke) bg-(--color-surface-fg-01)" />
                    )}
                    <span className="text-caption-2 font-medium leading-tight text-(--color-text-heading-06)">
                      I&apos;m happy to have Ad-Lab to follow up with me
                    </span>
                  </button>

                  {/* Primary button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full rounded-(--radius-lg) bg-(--color-btn-primary-bg) px-(--space-12) py-(--space-14) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft) transition-shadow duration-150 active:shadow-(--shadow-inset-sm) disabled:opacity-60"
                  >
                    {loading ? 'Saving…' : 'Show me the number'}
                  </button>
                </div>
              </div>

              {/* Skip row */}
              <button
                type="button"
                onClick={navigateToResults}
                className="flex items-center justify-center gap-[4px] text-caption-1"
              >
                <span className="font-normal text-(--color-text-heading-04)">Skip —</span>
                <span className="font-medium text-(--color-purple-400)">Show result without saving</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}

export default function DetailsPage() {
  return (
    <Suspense>
      <DetailsContent />
    </Suspense>
  )
}
