"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
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

  // Scroll animation state (lightweight, no heavy libs)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onVis = () =>
      setAnimPlayState(document.hidden ? "paused" : "running")
    onVis()
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0)
        rafRef.current = null
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const TWEETS = [
    { src: "/tweets/k2-tweet-01.png", alt: "K2 tweet 1" },
    { src: "/tweets/k2-tweet-02.png", alt: "K2 tweet 2" },
    { src: "/tweets/k2-tweet-03.png", alt: "K2 tweet 3" },
    { src: "/tweets/k2-tweet-04.png", alt: "K2 tweet 4" },
    { src: "/tweets/k2-tweet-05.png", alt: "K2 tweet 5" },
    { src: "/tweets/k2-tweet-06.png", alt: "K2 tweet 6" },
    { src: "/tweets/k2-tweet-07.png", alt: "K2 tweet 7" },
    { src: "/tweets/k2-tweet-08.png", alt: "K2 tweet 8" },
    { src: "/tweets/k2-tweet-09.png", alt: "K2 tweet 9" },
    { src: "/tweets/k2-tweet-10.png", alt: "K2 tweet 10" },
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
        size: clamp(210 + r1 * 260, 210, 520),
        duration: clamp(26 + r2 * 18, 26, 50),
        delay: -clamp(r3 * 40, 0, 40),
        dx: clamp(-45 + seededRand(i * 701) * 90, -62, 62),
        dy: clamp(-30 + seededRand(i * 1201) * 60, -46, 46),
        rot: clamp(-18 + seededRand(i * 901) * 36, -22, 22),
        opacity: clamp(0.55 + seededRand(i * 1601) * 0.35, 0.55, 0.95),
      })
    }
    return arr
  }, [])

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

  // Scroll-driven transforms (small + smooth)
  const heroLift = clamp(scrollY / 900, 0, 1) // 0..1
  const heroScale = 1 - heroLift * 0.04
  const heroOpacity = 1 - heroLift * 0.15

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden spacex">
      {/* Font import (SpaceX-like). Orbitron is closest public vibe */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&display=swap");
      `}</style>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/k2.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45" />
      <div className="fixed inset-0 -z-10 vignette" />

      {/* Floating tweets */}
      <div className="fixed inset-0 pointer-events-none floatLayer" aria-hidden="true">
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
      <section
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          transform: `translate3d(0, ${-heroLift * 18}px, 0) scale(${heroScale})`,
          opacity: heroOpacity,
        }}
      >
        <p className="topline">Kardashev Scale to Stellar Ambitions</p>

        <h1 className="title">$K2 Kardashev II</h1>

        <p className="subtitle">
          A civilization does not grow by accumulation, but by mastery of energy.
          Kardashev II is the threshold.
        </p>

        {/* Interactive jump buttons (click to scroll) */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="chip" onClick={() => scrollToId("stats")}>
            Stats
          </button>
          <button className="chip" onClick={() => scrollToId("moments")}>
            Moments
          </button>
          <button className="chip" onClick={() => scrollToId("community")}>
            Community
          </button>
        </div>

        {/* STATS */}
        <div
          id="stats"
          className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-4xl"
          style={{
            transform: `translate3d(0, ${heroLift * 10}px, 0)`,
          }}
        >
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
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            className="meshBtn"
            onClick={() => window.open(BUY_LINK, "_blank")}
          >
            Buy Token
          </Button>

          <Button
            variant="outline"
            className="meshBtn"
            onClick={() => window.open(CHART_LINK, "_blank")}
          >
            View Chart
          </Button>
        </div>

        {/* Contract */}
        <div className="mt-8 flex items-center gap-3 contractPill">
          <span className="truncate max-w-[420px]">{CA}</span>
          <button onClick={onCopy} className="copyBtn">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="mt-6 text-xs text-white/55">Scroll to enter orbit</p>
      </section>

      {/* Scroll reveal section */}
      <section id="moments" className="relative z-10 py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="sectionTitle">Moments That Sparked It</h2>
          <p className="sectionSub">
            As you scroll, the page shifts like a control panel. Click the zones, jump to the signal.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a className="zone" href={BUY_LINK} target="_blank" rel="noreferrer">
              <div className="zoneTitle">Acquire</div>
              <div className="zoneText">Route to Jupiter, get $K2</div>
            </a>

            <a className="zone" href={CHART_LINK} target="_blank" rel="noreferrer">
              <div className="zoneTitle">Track</div>
              <div className="zoneText">DexScreener live chart feed</div>
            </a>

            <a className="zone" href={TWITTER_COMMUNITY} target="_blank" rel="noreferrer">
              <div className="zoneTitle">Join</div>
              <div className="zoneText">Enter the community channel</div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="community"
        className="relative z-10 py-14 flex flex-col items-center gap-6 text-white/70"
      >
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
        .spacex {
          font-family: Orbitron, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        .vignette {
          background: radial-gradient(900px 500px at 50% 20%, rgba(0, 0, 0, 0.15), transparent 60%),
            radial-gradient(900px 700px at 50% 75%, rgba(0, 0, 0, 0.35), transparent 60%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.55));
        }

        .topline {
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 12px;
        }

        .title {
          font-weight: 800;
          font-size: clamp(44px, 6vw, 82px);
          line-height: 1.02;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        }

        .subtitle {
          margin-top: 14px;
          max-width: 740px;
          font-size: 18px;
          line-height: 1.6;
          opacity: 0.86;
        }

        .chip {
          border-radius: 999px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 140ms ease, background 140ms ease, border 140ms ease;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.92;
        }
        .chip:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.24);
        }

        .statPill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 62px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.26);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25);
        }

        .statPillHot {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.03)
            ),
            rgba(0, 0, 0, 0.22);
        }

        .statLabel {
          font-size: 11px;
          letter-spacing: 0.22em;
          opacity: 0.65;
          line-height: 1;
        }
        .statValue {
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
        }

        /* Buttons that mesh with galaxy */
        .meshBtn {
          border-radius: 999px !important;
          padding: 22px 28px !important;
          background: rgba(255, 255, 255, 0.06) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.35);
          transition: transform 160ms ease, background 160ms ease, border 160ms ease;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .meshBtn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.26) !important;
        }
        .meshBtn:active {
          transform: translateY(0px);
        }

        .contractPill {
          border-radius: 999px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.26);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .copyBtn {
          opacity: 0.85;
          transition: opacity 140ms ease;
        }
        .copyBtn:hover {
          opacity: 1;
        }

        .floatLayer {
          contain: layout paint style;
          transform: translateZ(0);
        }
        .floater {
          position: absolute;
          will-change: transform;
          animation: drift linear infinite;
          transform: translate3d(0, 0, 0) rotate(var(--rot));
          filter: blur(0px);
        }
        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
          user-select: none;
          -webkit-user-select: none;
          height: auto;
          width: auto;
          max-width: 520px;
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

        .sectionTitle {
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .sectionSub {
          margin-top: 10px;
          opacity: 0.75;
          line-height: 1.65;
          max-width: 720px;
        }

        .zone {
          display: block;
          border-radius: 22px;
          padding: 18px 18px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.28);
          transition: transform 160ms ease, background 160ms ease, border 160ms ease;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.92);
        }
        .zone:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.22);
        }
        .zoneTitle {
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
          opacity: 0.9;
        }
        .zoneText {
          margin-top: 8px;
          opacity: 0.75;
          line-height: 1.55;
          font-size: 14px;
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
