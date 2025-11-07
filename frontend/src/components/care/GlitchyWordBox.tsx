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
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '#',
  '%',
  '/',
  '\\\\',
  '|',
  '_',
  '-',
  '*',
  '+',
  '=',
]

const renderChaoticWord = (word: string) =>
  word.split('').map((char, index) => {
    const hue = 95 + Math.random() * 25
    const glowStrength = 0.4 + Math.random() * 0.6
    const scale = 1 + (Math.random() - 0.5) * 0.12
    const skew = (Math.random() - 0.5) * 4

    return (
      <span
        key={`${word}-${index}`}
        style={{
          display: 'inline-block',
          transform: `scale(${scale}) skew(${skew}deg)`,
          color: `hsl(${hue} 90% 55%)`,
          textShadow: `0 0 ${3 + glowStrength * 3}px rgba(0, 220, 0, ${0.4 + glowStrength / 2})`,
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

const shuffleArray = <T,>(items: T[]) => {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}
const shuffleWords = (words: string[]) => shuffleArray(words)

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

const SCREEN_COLS = 12
const SCREEN_ROWS = 8

const generateNodePositions = (count: number) => {
  const cells: Array<{ col: number; row: number }> = []
  for (let row = 1; row < SCREEN_ROWS - 1; row += 1) {
    for (let col = 1; col < SCREEN_COLS - 1; col += 1) {
      cells.push({ col, row })
    }
  }
  const shuffled = shuffleArray(cells).slice(0, count)
  return shuffled.map(({ col, row }) => ({
    x: ((col + 0.5) / SCREEN_COLS) * 100,
    y: ((row + 0.5) / SCREEN_ROWS) * 100,
  }))
}

const GlitchyWordBox = ({ words, intervalMs = 500 }: GlitchyWordBoxProps) => {
  const sanitizedWords = useMemo(
    () => words.filter((word) => word && word.trim().length > 0),
    [words],
  )
  const activeWords = sanitizedWords.length ? sanitizedWords : FALLBACK_WORDS
  const uniqueWords = useMemo(() => Array.from(new Set(activeWords)), [activeWords])
  const wordPool = uniqueWords.length ? uniqueWords : FALLBACK_WORDS
  const nodeCount = Math.min(NODE_COUNT, wordPool.length)
  const nodeWords = useMemo(() => wordPool.slice(0, nodeCount), [wordPool, nodeCount])
  const nodeWordsSignature = useMemo(() => nodeWords.join('|'), [nodeWords])
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
    setNodes(
      positions.map((position, index) =>
        createNode(index, nodeWords, shuffledWords[index], position),
      ),
    )
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
      <div className="glitch-shell-line">ssh admin@rccc.org</div>
      <div className="glitch-shell-line">admin@rccc.org&apos;s password: *******</div>
      <div className="glitch-shell-line">Last login: {new Date().toUTCString()} from 10.0.0.18</div>
      <div className="glitch-shell-line">admin@yaf-6:~$ ./cr-grp --girl</div>
      <div className="glitch-shell-line text-red-600 font-bold">
        Kernel panic: fatal system error in CareBus (SignalOverflowException)
      </div>
      <div className="glitch-shell-line"> EIP: 0x00b7:CareNet_ChannelListener+0x23a (*locked*)</div>
      <div className="glitch-shell-line"> EBP: 0x7ffd33a8 ESP: 0x7ffd2fe8</div>
      <div className="glitch-shell-line"> Stack trace:</div>
      <div className="glitch-shell-line"> 0x0012:CareNet_ChannelListener_process_frame+0x5d</div>
      <div className="glitch-shell-line"> 0x000f:CareNet_StackRelay_dispatch+0x1b</div>
      <div className="glitch-shell-line"> 0x000a:CareNet_SignalBus_execute+0x34</div>
      <div className="glitch-shell-line"> 0x0002:bootstrap_carenet+0x22b</div>
      <div className="glitch-shell-line text-red-600 font-bold">
        ERR!! anomalous entities detected {activeCount.toString().padStart(2, '0')} /{' '}
        {nodeCount.toString().padStart(2, '0')} (segfault while dereferencing data)
      </div>
      <div className="glitch-shell-line text-red-600 font-bold">
        ERR!! Attempting to dump logs...
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
    </div>
  )
}

export default GlitchyWordBox
