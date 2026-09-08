import { useRef, useState } from 'react'
import { ArrowUp, Lightbulb, Paperclip } from 'lucide-react'
import type { DemoPrompt } from './types'

interface DemoSectionProps {
  onSubmit: (prompt: string) => void
  copy: DemoPrompt
}

function DemoSection({ onSubmit, copy }: DemoSectionProps) {
  const [prompt, setPrompt] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) {
      inputRef.current?.focus()
      return
    }

    onSubmit(trimmedPrompt)
  }

  function handlePromptChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextPrompt = event.target.value
    setPrompt(nextPrompt)
  }

  function handleAttachmentChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAttachmentName(event.target.files?.[0]?.name ?? '')
  }

  return (
    <section
      id="demo"
      className="relative isolate flex min-h-svh items-center px-5 py-20 text-stone-900 sm:px-8 lg:px-12"
      aria-labelledby="demo-title"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h1
          id="demo-title"
          className="mx-auto max-w-[40rem] text-center text-[clamp(2.1rem,5vw,4.5rem)] font-light leading-[0.98] tracking-[-0.055em] text-balance"
        >
          {copy.heading}
        </h1>

        <form
          className="mx-auto mt-8 max-w-3xl sm:mt-10"
          onSubmit={handleSubmit}
          aria-label={copy.formLabel}
        >
          <div className="flex min-h-[4.5rem] items-center gap-2.5 rounded-[1.75rem] bg-white p-2.5 pl-4 shadow-[0_1.25rem_3.25rem_rgba(68,46,31,0.18)] sm:min-h-20 sm:gap-3 sm:p-3 sm:pl-5">
            <label
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-500 outline-none transition-colors hover:bg-stone-100 hover:text-stone-900 focus-within:ring-2 focus-within:ring-stone-800 focus-within:ring-offset-2"
              title={attachmentName || copy.attachmentLabel}
            >
              <Paperclip aria-hidden="true" size={18} strokeWidth={1.7} />
              <span className="sr-only">{copy.attachmentSrLabel}</span>
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                aria-describedby="attachment-status"
                onChange={handleAttachmentChange}
              />
            </label>
            <input
              ref={inputRef}
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 sm:text-base"
              value={prompt}
              onChange={handlePromptChange}
              placeholder={copy.placeholder}
              aria-label={copy.formLabel}
            />
            <button
               className="flex size-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white outline-none transition-transform motion-reduce:transition-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 sm:size-12"
              type="submit"
              aria-label={copy.submitLabel}
            >
              <ArrowUp aria-hidden="true" size={18} strokeWidth={1.8} />
            </button>
          </div>
          <div className="mt-2 flex min-h-5 flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 text-xs text-stone-700 sm:px-5">
            <span id="attachment-status" className="min-w-0 break-words" role="status" aria-live="polite">
              {attachmentName ? `${copy.attachmentSelectedPrefix}: ${attachmentName}` : copy.attachmentHint}
            </span>
             <span className="min-w-0 break-words" aria-live="polite" />
          </div>
        </form>

        <div className="mx-auto mt-9 max-w-3xl sm:mt-11">
          <p className="mb-3.5 flex items-center justify-center gap-1.5 text-[0.8125rem] font-medium text-stone-700">
            <Lightbulb aria-hidden="true" size={15} strokeWidth={1.7} />
            {copy.helpLabel}
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {copy.examplePrompts.map((example) => (
              <button
                key={example}
                className="group flex min-h-11 items-start gap-2.5 rounded-xl border border-white/45 bg-white/25 p-3.5 text-left text-[0.8125rem] leading-[1.5] text-stone-800 backdrop-blur-sm transition-colors hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#b89c82]"
                type="button"
                onClick={() => {
                  setPrompt(example)
                  inputRef.current?.focus()
                }}
              >
                <Lightbulb className="mt-0.5 shrink-0 text-stone-600 transition-colors group-hover:text-stone-900" aria-hidden="true" size={15} strokeWidth={1.7} />
                <span>{example}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default DemoSection
