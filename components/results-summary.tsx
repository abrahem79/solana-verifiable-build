'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, type Projection } from '@/lib/compound'

export function ResultsSummary({
  projection,
  years,
}: {
  projection: Projection
  years: number
}) {
  const interestShare =
    projection.finalBalance > 0
      ? projection.totalInterest / projection.finalBalance
      : 0

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardContent className="flex flex-col gap-6 px-6 py-7">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Balance after {Math.round(years)}{' '}
            {Math.round(years) === 1 ? 'year' : 'years'}
          </p>
          <p className="font-mono text-4xl font-semibold tracking-tight tabular-nums text-balance sm:text-5xl">
            {formatCurrency(projection.finalBalance)}
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            {(interestShare * 100).toFixed(0)}% of this balance is interest you
            never had to deposit.
          </p>
        </div>

        {/* Proportional bar: deposits vs interest as a share of the final balance. */}
        <div className="flex flex-col gap-2">
          <div
            className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${formatCurrency(projection.totalContributions)} contributed, ${formatCurrency(projection.totalInterest)} earned as interest`}
          >
            <div
              className="h-full transition-[width] duration-300 ease-out"
              style={{
                width: `${(1 - interestShare) * 100}%`,
                backgroundColor: 'var(--chart-1)',
              }}
            />
            <div
              className="h-full transition-[width] duration-300 ease-out"
              style={{
                width: `${interestShare * 100}%`,
                backgroundColor: 'var(--chart-2)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          <Metric
            label="You contribute"
            value={formatCurrency(projection.totalContributions)}
            accent="var(--chart-1)"
          />
          <Metric
            label="Interest earns"
            value={formatCurrency(projection.totalInterest)}
            accent="var(--chart-2)"
          />
          <Metric
            label="Return on deposits"
            value={`${(projection.returnMultiple * 100).toFixed(0)}%`}
            detail="total interest ÷ total deposits"
          />
          <Metric
            label="Final year interest"
            value={formatCurrency(projection.finalYearInterest)}
            detail="credited in the last 12 months"
          />
        </div>

        {projection.crossoverYear ? (
          <>
            <Separator className="border-dashed" />
            <p className="text-sm text-muted-foreground text-pretty">
              In{' '}
              <span className="font-mono font-medium text-foreground">
                year {projection.crossoverYear}
              </span>{' '}
              your accumulated interest overtakes everything you have deposited
              — from that point on, the account is mostly growing on its own.
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  value,
  accent,
  detail,
}: {
  label: string
  value: string
  accent?: string
  detail?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {accent ? (
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: accent }}
          />
        ) : null}
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="font-mono text-xl font-semibold tabular-nums">{value}</p>
      {detail ? (
        <p className="text-[11px] leading-4 text-muted-foreground/80">
          {detail}
        </p>
      ) : null}
    </div>
  )
}
