'use client'

import { Fragment } from 'react'
import { Check, Circle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  { title: 'Ad spend',  desc: 'Tell us how much you spend on ads' },
  { title: 'ROAS',      desc: 'Tell us about your business' },
  { title: 'Platform',  desc: "Tell us the platforms you're on" },
]

interface LeftPanelProps {
  currentView: 'landing' | 'step1' | 'step2'
}

function getStepState(i: number, currentView: string): 'done' | 'active' | 'upcoming' {
  if (currentView === 'step1') {
    return i === 0 ? 'active' : 'upcoming'
  }
  if (currentView === 'step2') {
    if (i === 0) return 'done'
    if (i === 1) return 'active'
    return 'upcoming'
  }
  return 'upcoming'
}

export default function LeftPanel({ currentView }: LeftPanelProps) {
  return (
    <aside className="relative flex h-full w-2/5 max-w-[700px] flex-col overflow-y-auto border-r border-(--color-surface-stroke) bg-(--color-surface-fg-01) px-(--space-40) pt-(--space-32) pb-(--space-32)">

      <div className="flex flex-1 flex-col gap-(--space-64)">

        {/* Brand */}
        <p className="font-sans text-h6 font-medium leading-tight text-(--color-text-body)">
          Ad-Lab
        </p>

        {/* Headline */}
        <p className="font-sans text-h4 font-medium leading-tight text-(--color-text-body)">
          Find out how much revenue your google ads is leaving on the table
        </p>

        {/* Steps section */}
        <div className="relative flex w-[265px] flex-col">
          {/* Tag — inline-flex autolayout, hugs content */}
          <div className="mb-[27px] inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-8) py-(--space-4)">
            <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
              Get your result in 3 steps
            </span>
          </div>

          {/* Step list */}
          {steps.map((step, i) => {
            const state = getStepState(i, currentView)
            const isDark = state === 'done' || state === 'active'

            return (
              <Fragment key={i}>
                <div className="flex h-[39px] items-start gap-(--space-16)">
                  <div
                    className={`flex size-[30px] flex-none items-center justify-center rounded-full ${
                      isDark ? 'bg-(--color-grey-950)' : 'bg-(--color-surface-fg-01) border border-(--color-surface-stroke)'
                    }`}
                  >
                    {state === 'done' && (
                      <Check size={14} className="text-(--color-white)" />
                    )}
                    {state === 'active' && (
                      <Circle size={14} className="text-(--color-white)" />
                    )}
                    {state === 'upcoming' && (
                      <Circle size={14} className="text-(--color-grey-400)" />
                    )}
                  </div>
                  <div className="flex flex-col gap-(--space-4)">
                    <p className="text-caption-1 font-medium leading-tight text-(--color-text-heading-02)">
                      {step.title}
                    </p>
                    <p className="text-caption-2 font-normal leading-tight text-(--color-text-heading-06)">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="ml-[15px] h-[27px] w-px border-l border-dashed border-(--color-grey-150)" />
                )}
              </Fragment>
            )
          })}
        </div>

        {/* CTA — landing only */}
        {currentView === 'landing' && (
          <Link
            href="/ad-spend"
            className="w-full rounded-(--radius-lg) bg-(--color-btn-primary-bg) px-(--space-12) py-(--space-14) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft) transition-shadow duration-150 active:shadow-(--shadow-inset-sm)"
          >
            Start
          </Link>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col items-center gap-(--space-20) pt-(--space-32) text-center">
        <p className="text-caption-2 font-normal leading-tight text-(--color-text-heading-06)">
          By proceeding you acknowledge that you have read, understood and agree to our{' '}
          <a href="#" className="underline decoration-solid">Terms and Conditions.</a>
        </p>
        <div className="flex gap-(--space-32) text-caption-2 font-normal leading-tight text-(--color-text-heading-06)">
          <span>2026 Ad-Lab</span>
          <a href="#" className="underline decoration-solid">Privacy Policy</a>
          <a href="#" className="underline decoration-solid">Support</a>
        </div>
      </div>
    </aside>
  )
}
