import LeftPanel from '@/components/left-panel'

export default function LandingPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">

      <LeftPanel currentView="landing" />

      {/* Right panel */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden rounded-bl-(--radius-6xl) rounded-tl-(--radius-6xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-(--space-220) py-(--space-40) shadow-(--shadow-panel)">

        {/* Skeleton card */}
        <div className="w-full rounded-(--radius-5xl) bg-(--color-surface-fg-01) pt-(--space-14) shadow-(--shadow-surface)">
          <div className="relative h-[156px] w-full overflow-hidden rounded-[18px] border border-(--color-surface-stroke) bg-(--color-surface-primary) shadow-(--shadow-float)">
            <div className="flex gap-[5px] p-[14px]">
              <div className="size-[36px] flex-none rounded-[10px] bg-(--color-surface-stroke)" />
              <div className="flex flex-1 flex-col gap-[5px] pt-[2px]">
                <div className="h-[6px] w-full rounded-sm bg-(--color-surface-stroke)" />
                <div className="h-[6px] w-full rounded-sm bg-(--color-surface-stroke)" />
                <div className="h-[6px] w-[36px] rounded-sm bg-(--color-surface-stroke)" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2.6px_2.6px_0px_rgba(246,246,246,0.25)]" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}
