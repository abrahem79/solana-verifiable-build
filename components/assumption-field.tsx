'use client'

import * as React from 'react'

import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Slider } from '@/components/ui/slider'

type AssumptionFieldProps = {
  id: string
  label: string
  hint: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  /** Slider step, when a coarser grain than the input step reads better. */
  sliderStep?: number
  prefix?: string
  suffix?: string
  /** Decimal places used when echoing the value back into the input. */
  precision?: number
}

export function AssumptionField({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  sliderStep,
  prefix,
  suffix,
  precision = 0,
}: AssumptionFieldProps) {
  // Keeps the raw keystrokes ("1", "1.", "") editable without the parent
  // clamping mid-typing, then re-syncs whenever the value changes elsewhere.
  const [draft, setDraft] = React.useState<string | null>(null)

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const commit = () => {
    if (draft === null) return
    const parsed = Number.parseFloat(draft.replace(/,/g, ''))
    onChange(Number.isFinite(parsed) ? clamp(parsed) : min)
    setDraft(null)
  }

  const displayed =
    draft ??
    value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    })

  return (
    <Field>
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>

      <InputGroup className="h-10">
        {prefix ? (
          <InputGroupAddon align="inline-start">
            <InputGroupText className="font-mono text-foreground/70">
              {prefix}
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
        <InputGroupInput
          id={id}
          inputMode="decimal"
          value={displayed}
          aria-describedby={`${id}-range`}
          className="font-mono text-base tabular-nums"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commit()
              event.currentTarget.blur()
            }
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault()
              setDraft(null)
              onChange(
                clamp(value + (event.key === 'ArrowUp' ? step : -step)),
              )
            }
          }}
        />
        {suffix ? (
          <InputGroupAddon align="inline-end">
            <InputGroupText className="font-mono">{suffix}</InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>

      <Slider
        aria-label={label}
        value={Math.min(max, Math.max(min, value))}
        onValueChange={(next) => {
          setDraft(null)
          onChange(next as number)
        }}
        min={min}
        max={max}
        step={sliderStep ?? step}
        className="mt-1"
      />

      <div
        id={`${id}-range`}
        className="flex justify-between font-mono text-[11px] text-muted-foreground/80"
      >
        <span>
          {prefix}
          {min.toLocaleString('en-US')}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString('en-US')}
          {suffix}
        </span>
      </div>
    </Field>
  )
}
