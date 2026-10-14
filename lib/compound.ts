export type CompoundFrequency = 'annually' | 'quarterly' | 'monthly' | 'daily'

export const FREQUENCY_PERIODS: Record<CompoundFrequency, number> = {
  annually: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365,
}

export type CalculatorInputs = {
  /** Lump sum invested at month zero. */
  initialAmount: number
  /** Deposited at the end of every month. */
  monthlyContribution: number
  /** Nominal annual rate, as a percentage (e.g. 7 for 7%). */
  annualRate: number
  /** Investment horizon in years. */
  years: number
  /** How often interest is compounded. */
  frequency: CompoundFrequency
  /** Annual percentage increase applied to the monthly contribution. */
  contributionGrowth: number
}

export type YearRow = {
  year: number
  /** Cumulative principal: initial amount + every contribution made so far. */
  contributions: number
  /** Cumulative interest earned. */
  interest: number
  /** contributions + interest */
  balance: number
  /** Interest credited during this year alone. */
  interestThisYear: number
  /** Contributions deposited during this year alone. */
  depositsThisYear: number
}

export type Projection = {
  rows: YearRow[]
  finalBalance: number
  totalContributions: number
  totalInterest: number
  /** Total interest as a share of total contributions. */
  returnMultiple: number
  /** First year where cumulative interest exceeds cumulative contributions. */
  crossoverYear: number | null
  /** Interest credited in the final 12 months. */
  finalYearInterest: number
}

/**
 * Simulates growth month by month so that mid-year contributions and any
 * compounding frequency are handled with the same code path.
 *
 * The nominal annual rate is converted to an equivalent monthly growth factor:
 *   monthlyGrowth = (1 + r/n)^(n/12) - 1
 * where n is the number of compounding periods per year.
 */
export function calculateProjection(inputs: CalculatorInputs): Projection {
  const {
    initialAmount,
    monthlyContribution,
    annualRate,
    years,
    frequency,
    contributionGrowth,
  } = inputs

  const periods = FREQUENCY_PERIODS[frequency]
  const ratePerPeriod = annualRate / 100 / periods
  const monthlyGrowth = Math.pow(1 + ratePerPeriod, periods / 12) - 1
  const totalYears = Math.max(1, Math.round(years))

  let balance = initialAmount
  let contributions = initialAmount
  let interest = 0

  const rows: YearRow[] = [
    {
      year: 0,
      contributions: initialAmount,
      interest: 0,
      balance: initialAmount,
      interestThisYear: 0,
      depositsThisYear: initialAmount,
    },
  ]

  let crossoverYear: number | null = null

  for (let year = 1; year <= totalYears; year++) {
    const deposit =
      monthlyContribution * Math.pow(1 + contributionGrowth / 100, year - 1)

    let interestThisYear = 0
    let depositsThisYear = 0

    for (let month = 0; month < 12; month++) {
      const earned = balance * monthlyGrowth
      balance += earned + deposit
      interest += earned
      contributions += deposit
      interestThisYear += earned
      depositsThisYear += deposit
    }

    rows.push({
      year,
      contributions,
      interest,
      balance,
      interestThisYear,
      depositsThisYear,
    })

    if (crossoverYear === null && interest > contributions) {
      crossoverYear = year
    }
  }

  const lastRow = rows[rows.length - 1]

  return {
    rows,
    finalBalance: balance,
    totalContributions: contributions,
    totalInterest: interest,
    returnMultiple: contributions > 0 ? interest / contributions : 0,
    crossoverYear,
    finalYearInterest: lastRow.interestThisYear,
  }
}

export function formatCurrency(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value)
}

/** Short form for axis labels: $1.2M, $45k, $900. */
export function formatCompact(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `$${Math.round(value / 1_000)}k`
  }
  return `$${Math.round(value)}`
}
