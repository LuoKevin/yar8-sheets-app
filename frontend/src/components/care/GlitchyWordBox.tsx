import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type GlitchyWordBoxProps = {
  words: string[]
  intervalMs?: number
  flickerBursts?: number
}

type NodeState = {
  id: number
  word: string
  displayWord: string
  baseWord: string
  x: number
  y: number
  scale: number
  rotation: number
  drift: number
  active: boolean
  wiping: boolean
}

const NODE_COUNT = 22
const FALLBACK_WORDS = ['...']

const pickRandom = (values: string[], exclude?: string) => {
  if (!values.length) {
    return ''
  }
  if (values.length === 1) {
    return values[0]
  }
  let candidate = values[Math.floor(Math.random() * values.length)]
  if (candidate === exclude) {
    candidate = values[Math.floor(Math.random() * values.length)]
  }
  return candidate
}

const glitchChars = [
  '#',
  '%',
  '/',
  '\\\\',
  '|',
  '_',
  '-',
  '∆',
  '≈',
  '§',
  '¤',
  'Ξ',
  'Φ',
  'Ø',
  '₪',
  '₿',
  'ψ',
  'Ж',
  '★',
  '♜',
  '░',
  '▒',
  '▓',
  '╬',
  '╪',
  'Ӝ',
  '҂',
  'Ѯ',
  '命',
  '道',
  '信',
  '⚚',
  '⚡',
  '✶',
  '⌘',
]

const renderChaoticWord = (word: string) =>
  word.split('').map((char, index) => {
    const yOffset = Math.random() < 0.5 ? (Math.random() - 0.5) * 8 : 0
    const xJitter = Math.random() < 0.35 ? (Math.random() - 0.5) * 5 : 0
    const scale = 1 + (Math.random() - 0.5) * 0.2

    return (
      <span
        key={`${word}-${index}`}
        style={{
          display: 'inline-block',
          transform: `translate(${xJitter}px, ${yOffset}px) scale(${scale})`,
          lineHeight: 1.1,
          letterSpacing: '0.05em',
        }}
      >
        {char}
      </span>
    )
  })

const glitchWord = (value: string) => {
  const trimmed = value.trim()
  if (trimmed.length <= 1) {
    return trimmed
  }
  const chars = trimmed.split('')
  const glitchCount = Math.min(2, Math.max(1, Math.floor(chars.length * 0.2)))
  const usedIndexes = new Set<number>()

  for (let i = 0; i < glitchCount; i += 1) {
    let idx = Math.floor(Math.random() * chars.length)
    while (usedIndexes.has(idx)) {
      idx = Math.floor(Math.random() * chars.length)
    }
    usedIndexes.add(idx)

    const replacement = glitchChars[Math.floor(Math.random() * glitchChars.length)]
    chars[idx] = replacement
  }

  return chars.join('')
}

const shuffleWords = (words: string[]) => {
  const pool = [...words]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

const createNode = (
  id: number,
  wordsPool: string[],
  baseWord?: string,
  coords?: { x: number; y: number },
): NodeState => {
  const nextWord = baseWord ?? pickRandom(wordsPool)
  const position =
    coords ??
    ({
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
    } as const)
  return {
    id,
    word: nextWord,
    baseWord: nextWord,
    displayWord: glitchWord(nextWord),
    x: position.x,
    y: position.y,
    scale: 0.8 + Math.random() * 0.8,
    rotation: 0,
    drift: 2.8 + Math.random() * 3.5,
    active: Math.random() > 0.3,
    wiping: false,
  }
}

const generateNodePositions = (count: number, minDistance = 12) => {
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < count; i += 1) {
    let attempts = 0
    let position: { x: number; y: number } | null = null
    let currentMin = minDistance

    while (attempts < 120 && !position) {
      const candidate = {
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
      }
      const overlaps = positions.some((prev) => {
        const dx = prev.x - candidate.x
        const dy = prev.y - candidate.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < currentMin
      })

      if (!overlaps) {
        position = candidate
        break
      }

      attempts += 1
      if (attempts % 30 === 0) {
        currentMin = Math.max(6, currentMin - 2)
      }
    }

    positions.push(position ?? { x: 5 + Math.random() * 90, y: 5 + Math.random() * 90 })
  }

  return positions
}

const GlitchyWordBox = ({
  words,
  intervalMs = 500,
  flickerBursts = 20,
}: GlitchyWordBoxProps) => {
  const sanitizedWords = useMemo(() => words.filter((word) => word && word.trim().length > 0), [words])
  const activeWords = sanitizedWords.length ? sanitizedWords : FALLBACK_WORDS
  const uniqueWords = useMemo(() => Array.from(new Set(activeWords)), [activeWords])
  const wordPool = uniqueWords.length ? uniqueWords : FALLBACK_WORDS
  const nodeCount = Math.min(NODE_COUNT, wordPool.length)
  const nodeWords = useMemo(() => wordPool.slice(0, nodeCount), [wordPool, nodeCount])
  const nodeWordsSignature = useMemo(() => nodeWords.join('|'), [nodeWords])
  const bootTimestamp = useMemo(
    () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    [],
  )
  const [nodes, setNodes] = useState<NodeState[]>([])
  const morphTimeoutsRef = useRef<Record<number, number>>({})
  const wordTimeoutsRef = useRef<Record<number, number>>({})
  const wordPoolRef = useRef(nodeWords)

  useEffect(() => {
    wordPoolRef.current = nodeWords
  }, [nodeWords])

  useEffect(() => {
    if (!nodeCount) {
      return
    }
    const positions = generateNodePositions(nodeCount)
    const shuffledWords = shuffleWords(nodeWords)
    setNodes(positions.map((position, index) => createNode(index, nodeWords, shuffledWords[index], position)))
  }, [nodeWordsSignature, nodeCount])

  const scheduleWordRefresh = useCallback(
    (nodeId: number) => {
      const minDelay = Math.max(350, intervalMs * 0.8)
      const maxDelay = Math.max(minDelay + 600, intervalMs * 1.8)
      const delay = minDelay + Math.random() * (maxDelay - minDelay)
      const timeout = window.setTimeout(() => {
        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            if (node.id !== nodeId) {
              return node
            }
            const nextWord = pickRandom(wordPoolRef.current, node.word)
            return {
              ...node,
              word: nextWord,
              baseWord: nextWord,
              displayWord: glitchWord(nextWord),
              active: true,
              x: 5 + Math.random() * 90,
              y: 5 + Math.random() * 90,
            }
          }),
        )
        scheduleWordRefresh(nodeId)
      }, delay)
      wordTimeoutsRef.current[nodeId] = timeout
    },
    [intervalMs],
  )

  const scheduleMorph = useCallback(
    (nodeId: number) => {
      const minDelay = Math.max(150, intervalMs * 0.4)
      const maxDelay = Math.max(minDelay + 200, intervalMs * 1.6)
      const delay = minDelay + Math.random() * (maxDelay - minDelay)
      const timeout = window.setTimeout(() => {
        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            if (node.id !== nodeId || !node.active) {
              return node
            }
            return {
              ...node,
              displayWord: glitchWord(node.baseWord),
              wiping: false,
            }
          }),
        )
        scheduleMorph(nodeId)
      }, delay)
      morphTimeoutsRef.current[nodeId] = timeout
    },
    [intervalMs],
  )

  useEffect(() => {
    nodes.forEach((node) => {
      if (!morphTimeoutsRef.current[node.id]) {
        scheduleMorph(node.id)
      }
      if (!wordTimeoutsRef.current[node.id]) {
        scheduleWordRefresh(node.id)
      }
    })
    const nodeIds = new Set(nodes.map((node) => node.id))
    Object.entries(morphTimeoutsRef.current).forEach(([key, timeoutId]) => {
      const id = Number(key)
      if (!nodeIds.has(id)) {
        window.clearTimeout(timeoutId)
        delete morphTimeoutsRef.current[id]
      }
    })
    Object.entries(wordTimeoutsRef.current).forEach(([key, timeoutId]) => {
      const id = Number(key)
      if (!nodeIds.has(id)) {
        window.clearTimeout(timeoutId)
        delete wordTimeoutsRef.current[id]
      }
    })
  }, [nodes, scheduleMorph, scheduleWordRefresh])

  useEffect(
    () => () => {
      Object.values(morphTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      Object.values(wordTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      morphTimeoutsRef.current = {}
      wordTimeoutsRef.current = {}
    },
    [],
  )

  const activeCount = nodes.filter((node) => node.active).length

  return (
    <div className="glitch-canvas">
      <div className="glitch-shell-bar">
        <span>
          <strong>Windows PowerShell</strong>
          <small>(Admin)</small>
        </span>
        <div className="glitch-shell-controls" aria-hidden="true">
          <button type="button" />
          <button type="button" />
          <button type="button" />
        </div>
      </div>
      <div className="glitch-shell-body">
        <div className="glitch-shell-line">Microsoft Windows [Version 10.0.22631.2861]</div>
        <div className="glitch-shell-line">(c) YAR8 Ministries. All rights reserved.</div>
        <div className="glitch-shell-line">PS C:\CareNet\signals&gt; status --scan</div>
        <div className="glitch-shell-line">
          Detected {activeCount.toString().padStart(2, '0')} active groups of {nodeCount.toString().padStart(2, '0')}
        </div>
        <div className="glitch-shell-grid">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`glitch-node ${node.active ? 'glitch-node--on' : ''}`}
              style={
                {
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                } as CSSProperties
              }
            >
              <span className="glitch-node__payload">{renderChaoticWord(node.displayWord)}</span>
            </div>
          ))}
        </div>
        <div className="glitch-shell-line">PS C:\CareNet\signals&gt; _</div>
      </div>
    </div>
  )
}

export default GlitchyWordBox
