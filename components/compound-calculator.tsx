'use client'

import * as React from 'react'

import { AssumptionsPanel } from '@/components/assumptions-panel'
import { GrowthChart } from '@/components/growth-chart'
import { ResultsSummary } from '@/components/results-summary'
import { YearlyLedger } from '@/components/yearly-ledger'
import { calculateProjection, type CalculatorInputs } from '@/lib/compound'

const DEFAULTS: CalculatorInputs = {
  initialAmount: 10_000,
  monthlyContribution: 500,
  annualRate: 7,
  years: 25,
  frequency: 'monthly',
  contributionGrowth: 0,
}

export function CompoundCalculator() {
  const [inputs, setInputs] = React.useState<CalculatorInputs>(DEFAULTS)

  const projection = React.useMemo(
    () => calculateProjection(inputs),
    [inputs],
  )

  const isDirty = React.useMemo(
    () =>
      (Object.keys(DEFAULTS) as (keyof CalculatorInputs)[]).some(
        (key) => inputs[key] !== DEFAULTS[key],
      ),
    [inputs],
  )

  const handleChange = React.useCallback((patch: Partial<CalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }))
  }, [])

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[400px_1fr]">
      <div className="lg:sticky lg:top-6">
        <AssumptionsPanel
          inputs={inputs}
          onChange={handleChange}
          onReset={() => setInputs(DEFAULTS)}
          isDirty={isDirty}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <ResultsSummary projection={projection} years={inputs.years} />
        <GrowthChart projection={projection} />
        <YearlyLedger projection={projection} />
      </div>
    </div>
  )
}
