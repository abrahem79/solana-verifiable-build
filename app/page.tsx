import { TrendingUpIcon } from 'lucide-react'

import { CompoundCalculator } from '@/components/compound-calculator'

export default function Page() {
  return (
    <div className="min-h-svh">
      <header className="border-b border-dashed">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
            >
              <TrendingUpIcon className="size-4" />
            </span>
            <span className="font-mono text-sm font-medium uppercase tracking-[0.18em]">
              Compound
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              See exactly how much of your future balance you actually deposit.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
              Set an opening amount, a monthly habit, and a rate of return. The
              projection splits every year into the money you put in and the
              interest that compounded on top of it.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <CompoundCalculator />
      </main>

      <footer className="border-t border-dashed">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            Projections assume a constant rate of return with contributions made
            at the end of each month. Real returns vary, and figures are shown
            before tax, fees, and inflation. For illustration only — not
            financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
