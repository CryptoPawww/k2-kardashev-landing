"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Globe } from "lucide-react"

const BUY_LINK =
  "https://jup.ag/tokens/8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump"
const CHART_LINK =
  "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
const TWITTER_COMMUNITY =
  "https://x.com/i/communities/2018452811802194000"

const CA = "8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump"

type Floater = {
  id: string
  src: string
  alt: string
  top: number
  left: number
  size: number
  duration: number
  delay: number
  dx: number
  dy: number
  rot: number
  opacity: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function seededRand(seed: number) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export default function Home() {
  const [animPlayState, setAnimPlayState] =
    useState<"running" | "paused">("running")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onVis = () =>
      setAnimPlayState(document.hidden ? "paused" : "running")
    onVis()
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  /* ALL 10 TWEETS ATTACHED HERE */
  const TWEETS = [
    { src: "/tweets/k2-tweet-01.webp", alt: "K2 tweet 1" },
    { src: "/tweets/k2-tweet-02.webp", alt: "K2 tweet 2" },
    { src: "/tweets/k2-tweet-03.webp", alt: "K2 tweet 3" },
    { src: "/tweets/k2-tweet-04.webp", alt: "K2 tweet 4" },
    { src: "/tweets/k2-tweet-05.webp", alt: "K2 tweet 5" },
    { src: "/tweets/k2-tweet-06.webp", alt: "K2 tweet 6" },
    { src: "/tweets/k2-tweet-07.webp", alt: "K2 tweet 7" },
    { src: "/tweets/k2-tweet-08.webp", alt: "K2 tweet 8" },
    { src: "/tweets/k2-tweet-09.webp", alt: "K2 tweet 9" },
    { src: "/tweets/k2-tweet-10.webp", alt: "K2 tweet 10" },
  ]

  const FLOAT_COUNT = 14

  const floaters: Floater[] = useMemo(() => {
    const arr: Floater[] = []
    for (let i = 0; i < FLOAT_COUNT; i++) {
      const item = TWEETS[i % TWEETS.length]
      const r1 = seededRand(i * 101)
      const r2 = seededRand(i * 911)
      const r3 = seededRand(i * 1733)
      const r4 = seededRand(i * 2221)
      const r5 = seededRand(i * 3571)

      arr.push({
        id: `f-${i}`,
        src: item.src,
        alt: item.alt,
        top: r4 * 100,
        left: r5 * 100,
        size: clamp(220 + r1 * 240, 220, 480),
        duration: clamp(26 + r2 * 18, 26, 48),
        delay: -clamp(r3 * 40, 0, 40),
        dx: clamp(-45 + seededRand(i * 701) * 90, -60, 60),
        dy: clamp(-30 + seededRand(i * 1201) * 60, -45, 45),
        rot: clamp(-18 + seededRand(i * 901) * 36, -22, 22),
        opacity: clamp(0.65 + seededRand(i * 1601) * 0.3, 0.6, 0.95),
      })
    }
    return arr
  }, [])

  const onCopy = async () => {
    await navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/k2.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45" />

      {/* FLOATING TWEETS */}
      <div className="fixed inset-0 pointer-events-none floatLayer">
        {floaters.map((f, i) => (
          <div
            key={f.id}
            className="floater"
            style={{
              top: `${f.top}vh`,
              left: `${f.left}vw`,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              animationPlayState: animPlayState,
              ["--dx" as any]: `${f.dx}vw`,
              ["--dy" as any]: `${f.dy}vh`,
              ["--rot" as any]: `${f.rot}deg`,
            }}
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={f.size}
              height={Math.round(f.size * 0.6)}
              className="tweetImg"
              quality={75}
              loading={i < 3 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-[56px] md:text-[80px] font-bold leading-none">
          $K2 Kardashev II
        </h1>

        <p className="mt-5 max-w-2xl text-white/85 text-lg md:text-xl">
          A civilization does not grow by accumulation, but by mastery of energy.
          Kardashev II is the threshold.
        </p>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl">
          <div className="statPill">
            <div className="statLabel">SUPPLY</div>
            <div className="statValue">1,000,000,000</div>
          </div>
          <div className="statPill">
            <div className="statLabel">CHAIN</div>
            <div className="statValue">Solana</div>
          </div>
          <div className="statPill">
            <div className="statLabel">LIQUIDITY</div>
            <div className="statValue">100% Locked</div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-9 flex gap-4">
          <Button
            variant="outline"
            className="rounded-full px-9 py-6 bg-white/5 border-white/25"
            onClick={() => window.open(BUY_LINK, "_blank")}
          >
            Buy Token
          </Button>

          <Button
            variant="outline"
            className="rounded-full px-9 py-6 bg-white/5 border-white/25"
            onClick={() => window.open(CHART_LINK, "_blank")}
          >
            View Chart
          </Button>
        </div>

        {/* CONTRACT */}
        <div className="mt-7 flex gap-3 bg-black/35 px-5 py-3 rounded-full text-sm border border-white/10">
          <span className="truncate max-w-[420px]">{CA}</span>
          <button onClick={onCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 flex flex-col items-center gap-6 text-white/70">
        <div className="flex gap-6">
          <a href={TWITTER_COMMUNITY} target="_blank" rel="noreferrer">
            <Twitter />
          </a>
          <a href={CHART_LINK} target="_blank" rel="noreferrer">
            <Globe />
          </a>
        </div>
        <p className="text-xs opacity-60">
          $K2 or you're not even trying. Not financial advice.
        </p>
      </footer>

      <style jsx>{`
        .floatLayer {
          contain: layout paint style;
        }
        .floater {
          position: absolute;
          will-change: transform;
          animation: drift linear infinite;
          transform: translate3d(0, 0, 0) rotate(var(--rot));
        }
        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
        }
        .statPill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 60px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          text-align: center;
        }
        .statLabel {
          font-size: 11px;
          letter-spacing: 0.2em;
          opacity: 0.7;
        }
        .statValue {
          font-size: 18px;
          font-weight: 600;
        }
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(var(--rot));
          }
          50% {
            transform: translate3d(var(--dx), var(--dy), 0)
              rotate(calc(var(--rot) * -1));
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(var(--rot));
          }
        }
      `}</style>
    </main>
  )
}
