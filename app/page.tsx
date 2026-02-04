"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Globe } from "lucide-react"

const BUY_LINK =
  "https://raydium.io/swap/?inputCurrency=sol&outputCurrency=8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump"
const CHART_LINK =
  "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
const TWITTER_COMMUNITY = "https://x.com/i/communities/2018452811802194000"

const CA = "8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump"

type Floater = {
  id: string
  src: string
  top: number // vh
  left: number // vw
  size: number // px
  duration: number // s
  delay: number // s
  dx: number // vw
  dy: number // vh
  rot: number // deg
  opacity: number
}

const TWEETS = ["/tweets/tweet1.png", "/tweets/tweet2.png", "/tweets/tweet3.png"]

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// deterministic random that does not change every render
function seededRand(seed: number) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export default function Home() {
  const [animPlayState, setAnimPlayState] = useState<"running" | "paused">("running")

  useEffect(() => {
    const onVis = () => setAnimPlayState(document.hidden ? "paused" : "running")
    onVis()
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  // Lower this if you want even less motion cost
  const FLOAT_COUNT = 8

  const floaters: Floater[] = useMemo(() => {
    const arr: Floater[] = []
    for (let i = 0; i < FLOAT_COUNT; i++) {
      const r1 = seededRand(i * 101)
      const r2 = seededRand(i * 911)
      const r3 = seededRand(i * 1733)
      const r4 = seededRand(i * 2221)
      const r5 = seededRand(i * 3571)

      const src = TWEETS[i % TWEETS.length]
      const size = Math.round(clamp(220 + r1 * 220, 200, 440))
      const duration = clamp(26 + r2 * 18, 24, 44)
      const delay = -clamp(r3 * duration, 0, duration)
      const top = r4 * 100
      const left = r5 * 100

      const dx = clamp(-34 + seededRand(i * 701) * 68, -48, 48)
      const dy = clamp(-22 + seededRand(i * 1201) * 44, -36, 36)
      const rot = clamp(-14 + seededRand(i * 901) * 28, -18, 18)
      const opacity = clamp(0.65 + seededRand(i * 1601) * 0.3, 0.6, 0.95)

      arr.push({
        id: `f-${i}`,
        src,
        top,
        left,
        size,
        duration,
        delay,
        dx,
        dy,
        rot,
        opacity,
      })
    }
    return arr
  }, [])

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      {/* FIXED GALAXY BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/k2.jpg')" }}
      />
      {/* OVERLAY FOR READABILITY */}
      <div className="fixed inset-0 -z-10 bg-black/45" />

      {/* FLOATING TWEETS ACROSS THE WHOLE PAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none floatLayer">
        {floaters.map((f, idx) => (
          <div
            key={f.id}
            className="floater"
            style={
              {
                top: `${f.top}vh`,
                left: `${f.left}vw`,
                opacity: f.opacity,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                "--dx": `${f.dx}vw`,
                "--dy": `${f.dy}vh`,
                "--rot": `${f.rot}deg`,
                animationPlayState: animPlayState,
              } as React.CSSProperties
            }
          >
            <Image
              src={f.src}
              alt="tweet"
              width={f.size}
              height={Math.round(f.size * 0.6)}
              quality={75}
              loading={idx < 2 ? "eager" : "lazy"}
              className="tweetImg"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* HERO (compressed, bigger type, details above the fold) */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 heroPad">
        <h1 className="font-bold tracking-tight text-[52px] leading-[0.98] md:text-[78px] md:leading-[0.95]">
          $K2 Kardashev II
        </h1>

        <p className="mt-5 max-w-2xl text-white/85 text-[18px] leading-relaxed md:text-[20px]">
          A civilization does not grow by accumulation, but by mastery of energy. Kardashev II is the threshold.
        </p>

        {/* QUICK STATS INLINE (no extra scroll) */}
        <div className="mt-8 w-full max-w-3xl grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="statLine">
            <div className="statLabel">SUPPLY</div>
            <div className="statValue">1,000,000,000</div>
          </div>
          <div className="statLine">
            <div className="statLabel">CHAIN</div>
            <div className="statValue">Solana</div>
          </div>
          <div className="statLine">
            <div className="statLabel">LIQUIDITY</div>
            <div className="statValue">Live on Solana</div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            className="rounded-full px-9 py-6 bg-white/5 hover:bg-white/10 border-white/25 text-white"
            onClick={() => window.open(BUY_LINK, "_blank")}
          >
            Buy Token
          </Button>

          <Button
            variant="outline"
            className="rounded-full px-9 py-6 bg-white/5 hover:bg-white/10 border-white/25 text-white"
            onClick={() => window.open(CHART_LINK, "_blank")}
          >
            View Chart
          </Button>
        </div>

        {/* CONTRACT (still free-flow, tighter) */}
        <div className="mt-7 flex items-center gap-3 bg-black/35 px-5 py-3 rounded-full text-sm border border-white/10">
          <span className="truncate max-w-[280px] md:max-w-[420px]">{CA}</span>
          <button
            onClick={() => navigator.clipboard.writeText(CA)}
            className="opacity-75 hover:opacity-100 transition"
          >
            Copy
          </button>
        </div>

        {/* small hint to scroll, but content is already above fold */}
        <p className="mt-6 text-xs text-white/55">Scroll for moments and links</p>
      </section>

      {/* MOMENTS SECTION (smaller top/bottom padding, title bigger) */}
      <section className="relative z-10 py-16 md:py-20">
        <h2 className="text-center font-semibold text-3xl md:text-4xl mb-10">
          Moments That Sparked It
        </h2>
        <p className="text-center text-white/70 text-sm md:text-base">
          Floating feed stays lightweight so the galaxy vibe stays smooth.
        </p>
      </section>

      {/* FOOTER LINKS */}
      <footer className="relative z-10 py-12 flex flex-col items-center gap-5 text-white/70">
        <div className="flex gap-6">
          <a href={TWITTER_COMMUNITY} target="_blank" rel="noreferrer">
            <Twitter className="w-6 h-6 hover:text-white transition" />
          </a>
          <a href={CHART_LINK} target="_blank" rel="noreferrer">
            <Globe className="w-6 h-6 hover:text-white transition" />
          </a>
        </div>

        <p className="text-xs opacity-60">$K2 or you're not even trying. Not financial advice.</p>
      </footer>

      <style jsx>{`
        .heroPad {
          padding-top: 64px;
          padding-bottom: 48px;
        }

        .statLine {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .statLabel {
          font-size: 11px;
          letter-spacing: 0.2em;
          opacity: 0.7;
        }

        .statValue {
          font-size: 18px;
          font-weight: 600;
          opacity: 0.95;
        }

        .floatLayer {
          contain: layout paint style;
          transform: translateZ(0);
        }

        .floater {
          position: absolute;
          will-change: transform;
          animation-name: drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform: translate3d(0, 0, 0) rotate(var(--rot));
        }

        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
          user-select: none;
          -webkit-user-select: none;
          height: auto;
          width: auto;
          max-width: 460px;
        }

        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(var(--rot));
          }
          50% {
            transform: translate3d(var(--dx), var(--dy), 0) rotate(calc(var(--rot) * -1));
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(var(--rot));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floater {
            animation: none;
          }
        }
      `}</style>
    </main>
  )
}
