import type { DemoSummary } from './types'

interface ProposalSummaryProps {
  summary: DemoSummary
  budgetValue: string
}

function ProposalSummary({ summary, budgetValue }: ProposalSummaryProps) {
  return (
    <aside className="rounded-[1.75rem] border border-stone-200 bg-white p-6 sm:p-8 lg:p-6" aria-labelledby="proposal-summary-title">
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-stone-400">{summary.eyebrow}</p>
      <h2 id="proposal-summary-title" className="mt-5 text-2xl font-medium leading-tight tracking-[-0.03em] text-stone-900 lg:mt-4">{summary.heading}</h2>
      <p className="mt-5 text-sm leading-6 text-stone-600 lg:mt-4">{summary.description}</p>
       <div className="mt-7 rounded-2xl bg-[#eee5db] p-5 lg:mt-5 lg:p-4"><p className="text-[0.62rem] font-bold tracking-[0.16em] text-stone-500">{summary.budget.label}</p><p className="mt-3 text-3xl font-medium tracking-tight text-stone-900">{budgetValue}</p><p className="mt-2 text-xs leading-5 text-stone-600">{summary.budget.note}</p></div>
      <dl className="mt-6 divide-y divide-stone-200 border-t border-stone-200 lg:mt-4">{summary.fields.map((field) => <div key={field.label} className="flex flex-wrap justify-between gap-3 py-4 text-sm lg:py-3"><dt className="text-stone-500">{field.label}</dt><dd className="text-right font-medium text-stone-900">{field.value}</dd></div>)}</dl>
    </aside>
  )
}

export default ProposalSummary
