import { useEffect, useRef } from "react"

type ActionMap = {
  [combo: string]: () => void
}

const normalizeKey = (k: string) => {
  if (!k) return ""
  const s = k.toLowerCase()
  if (s === "ctrl") return "control"
  if (s === "cmd" || s === "command") return "meta"
  if (s === " " || s === "spacebar" || s === "space") return "space"
  return s
}

export const useKeyboardKeyListener = (actions: ActionMap) => {
  const pressedKeysRef = useRef<Set<string>>(new Set())
  const combosRef = useRef<Array<{ parts: string[]; fn: () => void }>>([])

  useEffect(() => {
    const arr: Array<{ parts: string[]; fn: () => void }> = []
    for (const comboStr in actions) {
      const parts = comboStr.split("+").map((p) => normalizeKey(p.trim()))
      arr.push({ parts, fn: actions[comboStr] })
    }
    // ordenar por tamanho decrescente → combos maiores têm prioridade
    arr.sort((a, b) => b.parts.length - a.parts.length)
    combosRef.current = arr
  }, [actions])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const nk = normalizeKey(e.key)
      pressedKeysRef.current.add(nk)
      for (const { parts, fn } of combosRef.current) {
        const matched = parts.every((p) => pressedKeysRef.current.has(p))
        if (matched) {
          e.preventDefault()
          fn()
          break
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const nk = normalizeKey(e.key)
      pressedKeysRef.current.delete(nk)
    }

    const handleBlur = () => pressedKeysRef.current.clear()

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])
}
