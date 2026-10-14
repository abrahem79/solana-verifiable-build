'use client'

import { RotateCcwIcon } from 'lucide-react'

import { AssumptionField } from '@/components/assumption-field'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { CalculatorInputs, CompoundFrequency } from '@/lib/compound'

const FREQUENCY_OPTIONS: { value: CompoundFrequency; label: string }[] = [
  { value: 'annually', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
]

type AssumptionsPanelProps = {
  inputs: CalculatorInputs
  onChange: (patch: Partial<CalculatorInputs>) => void
  onReset: () => void
  isDirty: boolean
}

export function AssumptionsPanel({
  inputs,
  onChange,
  onReset,
  isDirty,
}: AssumptionsPanelProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="gap-1 border-b border-dashed py-5">
        <CardTitle className="text-base">Assumptions</CardTitle>
        <CardDescription>
          Every figure updates the projection instantly.
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={!isDirty}
            className="-mr-2 -mt-1"
          >
            <RotateCcwIcon data-icon="inline-start" />
            Reset
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="py-6">
        <FieldGroup>
          <AssumptionField
            id="initial-amount"
            label="Initial amount"
            hint="Deposited today"
            value={inputs.initialAmount}
            onChange={(initialAmount) => onChange({ initialAmount })}
            min={0}
            max={250_000}
            step={500}
            sliderStep={500}
            prefix="$"
          />

          <AssumptionField
            id="monthly-contribution"
            label="Monthly contribution"
            hint="Added at each month end"
            value={inputs.monthlyContribution}
            onChange={(monthlyContribution) =>
              onChange({ monthlyContribution })
            }
            min={0}
            max={10_000}
            step={50}
            sliderStep={25}
            prefix="$"
          />

          <AssumptionField
            id="annual-rate"
            label="Annual interest rate"
            hint="Nominal, before inflation"
            value={inputs.annualRate}
            onChange={(annualRate) => onChange({ annualRate })}
            min={0}
            max={20}
            step={0.1}
            sliderStep={0.1}
            suffix="%"
            precision={2}
          />

          <AssumptionField
            id="years"
            label="Time period"
            hint="Length of the projection"
            value={inputs.years}
            onChange={(years) => onChange({ years })}
            min={1}
            max={50}
            step={1}
            suffix=" yr"
          />

          <FieldSeparator />

          <Field orientation="responsive">
            <FieldLabel htmlFor="frequency-yearly">
              Compounding frequency
            </FieldLabel>
            <ToggleGroup
              variant="outline"
              size="sm"
              spacing={0}
              value={[inputs.frequency]}
              onValueChange={(next) => {
                const value = (next as string[])[0] as
                  | CompoundFrequency
                  | undefined
                if (value) onChange({ frequency: value })
              }}
              className="w-full"
            >
              {FREQUENCY_OPTIONS.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  id={`frequency-${option.value}`}
                  value={option.value}
                  className="flex-1"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <AssumptionField
            id="contribution-growth"
            label="Annual contribution increase"
            hint="Raises your deposit each year"
            value={inputs.contributionGrowth}
            onChange={(contributionGrowth) => onChange({ contributionGrowth })}
            min={0}
            max={15}
            step={0.5}
            sliderStep={0.5}
            suffix="%"
            precision={1}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
