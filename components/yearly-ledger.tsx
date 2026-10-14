'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency, type Projection } from '@/lib/compound'

const COLLAPSED_ROWS = 10

export function YearlyLedger({ projection }: { projection: Projection }) {
  const [expanded, setExpanded] = React.useState(false)

  const rows = projection.rows.filter((row) => row.year > 0)
  const visible = expanded ? rows : rows.slice(0, COLLAPSED_ROWS)
  const hidden = rows.length - visible.length

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="gap-1 border-b border-dashed py-5">
        <CardTitle className="text-base">Year by year</CardTitle>
        <CardDescription>
          The full schedule of deposits and credited interest.
        </CardDescription>
        {hidden > 0 || expanded ? (
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Show less' : `Show all ${rows.length}`}
              <ChevronDownIcon
                data-icon="inline-end"
                className={expanded ? 'rotate-180' : undefined}
              />
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="px-0 py-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              Projected balance for each year, broken down into deposits made,
              interest credited, and the resulting total balance.
            </caption>
            <thead>
              <tr className="border-b">
                <th
                  scope="col"
                  className="px-3 py-3 text-left sm:px-6 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground"
                >
                  Year
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right sm:px-6 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground"
                >
                  Deposits
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right sm:px-6 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground"
                >
                  Interest
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right sm:px-6 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground"
                >
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={row.year}
                  className="border-b border-border/60 last:border-b-0 hover:bg-muted/50"
                >
                  <th
                    scope="row"
                    className="px-3 py-2.5 text-left sm:px-6 font-mono text-sm font-normal tabular-nums text-muted-foreground"
                  >
                    {row.year}
                  </th>
                  <td className="px-3 py-2.5 text-right sm:px-6 font-mono tabular-nums">
                    {formatCurrency(row.depositsThisYear)}
                  </td>
                  <td
                    className="px-3 py-2.5 text-right sm:px-6 font-mono tabular-nums"
                    style={{ color: 'var(--chart-2)' }}
                  >
                    {formatCurrency(row.interestThisYear)}
                  </td>
                  <td className="px-3 py-2.5 text-right sm:px-6 font-mono font-medium tabular-nums">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hidden > 0 ? (
          <div className="border-t border-dashed px-4 py-3 sm:px-6 text-xs text-muted-foreground">
            {hidden} more {hidden === 1 ? 'year' : 'years'} hidden
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
