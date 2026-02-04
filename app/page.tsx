"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Globe, X } from "lucide-react"

const BUY_LINK =
  "https://jup.ag/tokens/8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump"
const CHART_LINK =
  "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
const TWITTER_COMMUNITY =
  "https://x.com/i/communities/2018452811802194000"

const CA = "8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump"

type TweetItem = { src: string; alt: string }
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
  z: number
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
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number | null>(null)

  const [activeTweet, setActiveTweet] = useState<TweetItem | null>(null)

  useEffect(() => {
    const onVis = () =>
      setAnimPlayState(document.hidden ? "paused" : "running")
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafRef.current = null
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveTweet(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const TWEETS: TweetItem[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        src: `/tweets/k2-tweet-${String(i + 1).padStart(2, "0")}.png`,
        alt: `K2 tweet ${i + 1}`,
      })),
    []
  )

  const FLOAT_COUNT = 14

  const floaters: Floater[] = useMemo(() => {
    return Array.from({ length: FLOAT_COUNT }).map((_, i) => {
      const r1 = seededRand(i * 101)
      const r2 = seededRand(i * 911)
      const r3 = seededRand(i * 1733)
      const r4 = seededRand(i * 2221)
      const r5 = seededRand(i * 3571)
      const r6 = seededRand(i * 4441)

      // premium feel: slower + less travel
      const duration = clamp(52 + r2 * 40, 52, 92) // seconds
      const dx = clamp(-18 + seededRand(i * 701) * 36, -28, 28) // vw
      const dy = clamp(-12 + seededRand(i * 1201) * 24, -18, 18) // vh

      const size = clamp(220 + r1 * 260, 220, 520)
      const z = Math.round(clamp(1 + r6 * 3, 1, 4))

      const item = TWEETS[i % TWEETS.length]

      return {
        id: `f-${i}`,
        src: item.src,
        alt: item.alt,
        top: r4 * 100,
        left: r5 * 100,
        size,
        duration,
        delay: -clamp(r3 * duration, 0, duration),
        dx,
        dy,
        rot: clamp(-14 + seededRand(i * 901) * 28, -20, 20),
        opacity: clamp(0.55 + seededRand(i * 1601) * 0.35, 0.55, 0.92),
        z,
      }
    })
  }, [TWEETS])

  const heroLift = clamp(scrollY / 900, 0, 1)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(CA)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = CA
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const openTweet = (t: TweetItem) => setActiveTweet(t)
  const closeTweet = () => setActiveTweet(null)

  return (
    <main className="spacex relative min-h-screen text-white overflow-x-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&display=swap");
      `}</style>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/k2.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45 vignette" />

      {/* Floating tweets (clickable) */}
      <div className="fixed inset-0 floatLayer" aria-hidden="false">
        {floaters.map((f, idx) => (
          <button
            key={f.id}
            type="button"
            className="floaterBtn"
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
              zIndex: f.z,
            }}
            onClick={() => openTweet({ src: f.src, alt: f.alt })}
            aria-label={`Open ${f.alt}`}
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={Math.round(f.size)}
              height={Math.round(f.size * 0.6)}
              className="tweetImg"
              quality={75}
              loading={idx < 3 ? "eager" : "lazy"}
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeTweet && (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          onClick={closeTweet}
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={closeTweet} aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <div className="modalImageWrap">
              <Image
                src={activeTweet.src}
                alt={activeTweet.alt}
                width={1200}
                height={700}
                className="modalImg"
                priority
              />
            </div>

            <div className="modalMeta">
              <div className="modalTitle">{activeTweet.alt}</div>
              <div className="modalHint">Press Esc or click outside to close</div>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          transform: `translateY(${-heroLift * 18}px) scale(${1 - heroLift * 0.04})`,
          opacity: 1 - heroLift * 0.15,
        }}
      >
        <h1 className="title">$K2 Kardashev II</h1>

        <p className="subtitle">
          A civilization does not grow by accumulation, but by mastery of energy.
          Kardashev II is the threshold.
        </p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl w-full">
          <div className="statPill">
            <div className="statLabel">SUPPLY</div>
            <div className="statValue">1,000,000,000</div>
          </div>
          <div className="statPill statPillHot">
            <div className="statLabel">CHAIN</div>
            <div className="statValue">Solana</div>
          </div>
          <div className="statPill">
            <div className="statLabel">LIQUIDITY</div>
            <div className="statValue">Live on Solana</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Button
            className="meshBtn meshBtnPrimary text-white"
            onClick={() => window.open(BUY_LINK, "_blank")}
          >
            Buy Token
          </Button>
          <Button
            className="meshBtn meshBtnSecondary text-white"
            onClick={() => window.open(CHART_LINK, "_blank")}
          >
            View Chart
          </Button>
        </div>

        {/* Contract */}
        <div className="mt-8 contractPill flex gap-3 items-center">
          <span className="truncate max-w-[420px]">{CA}</span>
          <button className="copyBtn" onClick={onCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      {/* Zones */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-4">
          <a className="zone" href={BUY_LINK} target="_blank" rel="noreferrer">
            <div className="zoneTitle">Buy Token</div>
            <div className="zoneText">Jupiter aggregator</div>
          </a>
          <a className="zone" href={CHART_LINK} target="_blank" rel="noreferrer">
            <div className="zoneTitle">Track</div>
            <div className="zoneText">DexScreener live chart</div>
          </a>
          <a
            className="zone"
            href={TWITTER_COMMUNITY}
            target="_blank"
            rel="noreferrer"
          >
            <div className="zoneTitle">Join</div>
            <div className="zoneText">Community channel</div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 flex flex-col items-center gap-6 text-white/70">
        <div className="flex gap-6">
          <a href={TWITTER_COMMUNITY} target="_blank" rel="noreferrer">
            <Twitter />
          </a>
          <a href={CHART_LINK} target="_blank" rel="noreferrer">
            <Globe />
          </a>
        </div>
        <p className="text-xs opacity-60">$K2 or you're not even trying. Not financial advice.</p>
      </footer>

      <style jsx>{`
        .spacex {
          font-family: Orbitron, system-ui;
        }
        .vignette {
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.55));
        }

        .title {
          font-size: clamp(44px, 6vw, 82px);
          font-weight: 800;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        }
        .subtitle {
          margin-top: 14px;
          max-width: 740px;
          opacity: 0.86;
          line-height: 1.6;
        }

        .statPill {
          border-radius: 999px;
          padding: 14px;
          background: rgba(0, 0, 0, 0.26);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          text-align: center;
        }
        .statPillHot {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .statLabel {
          font-size: 11px;
          letter-spacing: 0.22em;
          opacity: 0.6;
        }
        .statValue {
          font-size: 18px;
          font-weight: 700;
        }

        .meshBtn {
          border-radius: 999px;
          padding: 22px 28px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(14px);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.45);
          transition: transform 160ms ease, background 160ms ease, border 160ms ease;
        }
        .meshBtn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.35);
        }

        .meshBtnPrimary {
          position: relative;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.38);
          animation: glowPulse 2.6s ease-in-out infinite;
        }
        .meshBtnPrimary:hover {
          animation: none;
        }
        .meshBtnSecondary {
          opacity: 0.92;
        }

        @keyframes glowPulse {
          0% {
            box-shadow: 0 18px 70px rgba(0, 0, 0, 0.45),
              0 0 0px rgba(255, 255, 255, 0.0);
          }
          50% {
            box-shadow: 0 18px 70px rgba(0, 0, 0, 0.45),
              0 0 22px rgba(255, 255, 255, 0.16);
          }
          100% {
            box-shadow: 0 18px 70px rgba(0, 0, 0, 0.45),
              0 0 0px rgba(255, 255, 255, 0.0);
          }
        }

        .contractPill {
          border-radius: 999px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.26);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
        }
        .copyBtn {
          opacity: 0.9;
          transition: opacity 140ms ease;
        }
        .copyBtn:hover {
          opacity: 1;
        }

        .zone {
          border-radius: 22px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(14px);
          color: white;
          text-decoration: none;
          transition: transform 160ms ease, background 160ms ease, border 160ms ease;
        }
        .zone:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.22);
        }
        .zoneTitle {
          font-weight: 800;
          letter-spacing: 0.08em;
          font-size: 12px;
          text-transform: uppercase;
        }
        .zoneText {
          margin-top: 8px;
          opacity: 0.75;
          font-size: 14px;
        }

        /* Floating tweets */
        .floatLayer {
          position: fixed;
          inset: 0;
          z-index: 5; /* below main content (hero has z-10), above background */
          contain: layout paint style;
        }
        .floaterBtn {
          position: absolute;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
          will-change: transform;
          animation: drift linear infinite;
          transform: translate3d(0, 0, 0) rotate(var(--rot));
          filter: saturate(1.05);
        }
        .floaterBtn:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.35);
          outline-offset: 6px;
          border-radius: 18px;
        }
        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
          user-select: none;
          -webkit-user-select: none;
          height: auto;
          width: auto;
          max-width: 520px;
          pointer-events: none; /* click handled by button */
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

        /* Modal */
        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .modalCard {
          width: min(980px, 96vw);
          border-radius: 22px;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 30px 120px rgba(0, 0, 0, 0.65);
          overflow: hidden;
          position: relative;
        }
        .modalClose {
          position: absolute;
          top: 12px;
          right: 12px;
          border-radius: 999px;
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }
        .modalClose:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .modalImageWrap {
          padding: 18px;
        }
        .modalImg {
          width: 100%;
          height: auto;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
        }
        .modalMeta {
          padding: 0 18px 18px 18px;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }
        .modalTitle {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
          opacity: 0.9;
        }
        .modalHint {
          font-size: 12px;
          opacity: 0.65;
        }

        @media (prefers-reduced-motion: reduce) {
          .floaterBtn {
            animation: none;
          }
          .meshBtnPrimary {
            animation: none;
          }
        }
      `}</style>
    </main>
  )
}
