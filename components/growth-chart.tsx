'use client'

import * as React from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  formatCompact,
  formatCurrency,
  type Projection,
} from '@/lib/compound'

const chartConfig = {
  contributions: {
    label: 'Contributions',
    color: 'var(--chart-1)',
  },
  interest: {
    label: 'Interest earned',
    color: 'var(--chart-2)',
  },
  interestThisYear: {
    label: 'Interest that year',
    color: 'var(--chart-2)',
  },
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

type View = 'composition' | 'annual' | 'balance'

const VIEWS: { value: View; label: string; description: string }[] = [
  {
    value: 'composition',
    label: 'Composition',
    description:
      'Your own contributions stacked beneath the interest they generated.',
  },
  {
    value: 'annual',
    label: 'Per year',
    description: 'Interest credited in each individual year of the projection.',
  },
  {
    value: 'balance',
    label: 'Balance',
    description: 'The total account balance as a single running line.',
  },
]

export function GrowthChart({ projection }: { projection: Projection }) {
  const [view, setView] = React.useState<View>('composition')
  const active = VIEWS.find((item) => item.value === view)!

  const tickCount = projection.rows.length
  const tickInterval = tickCount > 26 ? 4 : tickCount > 13 ? 2 : 0

  return (
    <Card className="gap-0 py-0">
      {/* Flex on mobile so the toggle group drops below the copy instead of
          squeezing it into the grid's auto column. */}
      <CardHeader className="gap-1 border-b border-dashed py-5 max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <CardTitle className="text-base">Growth over time</CardTitle>
        <CardDescription className="max-w-md">
          {active.description}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            value={[view]}
            onValueChange={(next) => {
              const value = (next as string[])[0] as View | undefined
              if (value) setView(value)
            }}
          >
            {VIEWS.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>


      <CardContent className="py-6">
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full sm:h-[380px]"
        >
          {view === 'composition' ? (
            <AreaChart data={projection.rows} margin={{ left: 4, right: 8 }}>
              <defs>
                <linearGradient id="fillContributions" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-contributions)"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-contributions)"
                    stopOpacity={0.12}
                  />
                </linearGradient>
                <linearGradient id="fillInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-interest)"
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-interest)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={tickInterval}
                tickFormatter={(value) => (value === 0 ? 'Now' : `Yr ${value}`)}
                className="font-mono text-[11px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                tickFormatter={(value: number) => formatCompact(value)}
                className="font-mono text-[11px]"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      label === 0 ? 'Today' : `After year ${label}`
                    }
                    formatter={(value, name) => (
                      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]?.label}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(value as number)}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                  />
                }
              />
              {projection.crossoverYear ? (
                <ReferenceLine
                  x={projection.crossoverYear}
                  stroke="var(--color-interest)"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Crossover',
                    position: 'insideTopRight',
                    fill: 'var(--muted-foreground)',
                    fontSize: 11,
                  }}
                />
              ) : null}
              <Area
                dataKey="contributions"
                type="monotone"
                stackId="total"
                stroke="var(--color-contributions)"
                strokeWidth={2}
                fill="url(#fillContributions)"
              />
              <Area
                dataKey="interest"
                type="monotone"
                stackId="total"
                stroke="var(--color-interest)"
                strokeWidth={2}
                fill="url(#fillInterest)"
              />
            </AreaChart>
          ) : view === 'annual' ? (
            <BarChart
              data={projection.rows.filter((row) => row.year > 0)}
              margin={{ left: 4, right: 8 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={tickInterval}
                tickFormatter={(value) => `Yr ${value}`}
                className="font-mono text-[11px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                tickFormatter={(value: number) => formatCompact(value)}
                className="font-mono text-[11px]"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Year ${label}`}
                    formatter={(value, name) => (
                      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]?.label}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(value as number)}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                  />
                }
              />
              <Bar
                dataKey="interestThisYear"
                fill="var(--color-interest)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={projection.rows} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={tickInterval}
                tickFormatter={(value) => (value === 0 ? 'Now' : `Yr ${value}`)}
                className="font-mono text-[11px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                tickFormatter={(value: number) => formatCompact(value)}
                className="font-mono text-[11px]"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      label === 0 ? 'Today' : `After year ${label}`
                    }
                    formatter={(value, name) => (
                      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]?.label}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(value as number)}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                  />
                }
              />
              <Line
                dataKey="balance"
                type="monotone"
                stroke="var(--color-balance)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          )}
        </ChartContainer>

        {view === 'composition' ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-dashed pt-4">
            <LegendSwatch
              color="var(--chart-1)"
              label="Contributions"
              value={formatCurrency(projection.totalContributions)}
            />
            <LegendSwatch
              color="var(--chart-2)"
              label="Interest earned"
              value={formatCurrency(projection.totalInterest)}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function LegendSwatch({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-medium tabular-nums">
        {value}
      </span>
    </div>
  )
}
