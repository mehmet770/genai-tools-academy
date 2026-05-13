'use client'

import { useEffect, useRef, useState } from 'react'

const TYPING_MS = 28
const DELETING_MS = 14

interface TypingTextProps {
  text: string
  className?: string
}

export function TypingText({ text, className = '' }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const target = useRef(text)

  useEffect(() => {
    target.current = text
    setIsDeleting(true)
  }, [text])

  useEffect(() => {
    const ms = isDeleting ? DELETING_MS : TYPING_MS

    const id = setTimeout(() => {
      if (isDeleting) {
        if (displayed.length > 0) {
          setDisplayed((s) => s.slice(0, -1))
        } else {
          setIsDeleting(false)
        }
        return
      }
      if (displayed.length < target.current.length) {
        setDisplayed(target.current.slice(0, displayed.length + 1))
      }
    }, ms)

    return () => clearTimeout(id)
  }, [displayed, isDeleting])

  return (
    <span className={className}>
      {displayed}
      <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-pulse rounded-sm bg-[var(--accent)]" />
    </span>
  )
}
