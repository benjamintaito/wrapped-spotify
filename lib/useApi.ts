"use client"

import { useEffect, useState } from "react"

interface FetchState<T> {
  url: string
  data?: T
  error?: string
}

/**
 * Fetches JSON from an internal API route. Re-fetches when the URL changes,
 * ignoring responses from stale requests so fast tab switches never show
 * data for the wrong period.
 */
export function useApi<T>(url: string, fallbackError: string) {
  const [state, setState] = useState<FetchState<T> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data)) setState({ url, data: data as T })
        else setState({ url, error: (data as { error?: string }).error ?? fallbackError })
      })
      .catch(() => {
        if (!cancelled) setState({ url, error: "Error de red" })
      })
    return () => {
      cancelled = true
    }
  }, [url, fallbackError])

  const current = state?.url === url ? state : null
  return {
    data: current?.data,
    error: current?.error ?? null,
    loading: current === null,
  }
}
