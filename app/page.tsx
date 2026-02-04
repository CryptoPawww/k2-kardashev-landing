"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
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
  const [activeTweet, setActiveTweet] = useState<TweetItem | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onVis = () =>
      setAnimPlayState(document.hidden ? "paused" : "running")
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
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

  const floaters: Floater[] = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const r = seededRand(i * 777)
      const item = TWEETS[i % TWEETS.length]
      return {
        id: `f-${i}`,
        src: item.src,
        alt: item.alt,
        top: seededRand(i * 3) * 100,
        left: seededRand(i * 7) * 100,
        size: clamp(240 + r * 280, 240, 520),
        duration: clamp(60 + r * 40, 60, 100),
        delay: -r * 60,
        dx: clamp(-20 + seededRand(i * 11) * 40, -30, 30),
        dy: clamp(-14 + seededRand(i * 17) * 28, -20, 20),
        rot: clamp(-14 + seededRand(i * 19) * 28, -18, 18),
        opacity: clamp(0.55 + r * 0.35, 0.55, 0.9),
        z: Math.round(1 + r * 3),
      }
    })
  }, [TWEETS])

  const onCopy = async () => {
    await navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

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

      {/* Floating tweets */}
      <div className="fixed inset-0 floatLayer">
        {floaters.map((f) => (
          <button
            key={f.id}
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
            onClick={() => setActiveTweet({ src: f.src, alt: f.alt })}
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={f.size}
              height={Math.round(f.size * 0.6)}
              className="tweetImg"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeTweet && (
        <div className="modalOverlay" onClick={() => setActiveTweet(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setActiveTweet(null)}>
              <X />
            </button>
            <Image
              src={activeTweet.src}
              alt={activeTweet.alt}
              width={1200}
              height={700}
              className="modalImg"
            />
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
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

        {/* TOP BUTTONS – SAME AS OTHERS */}
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <button
            className="meshBtn meshBtnPrimary"
            onClick={() => window.open(BUY_LINK, "_blank")}
          >
            Buy Token
          </button>
          <button
            className="meshBtn meshBtnSecondary"
            onClick={() => window.open(CHART_LINK, "_blank")}
          >
            View Chart
          </button>
        </div>

        {/* Contract */}
        <div className="mt-8 contractPill flex gap-3">
          <span className="truncate max-w-[420px]">{CA}</span>
          <button onClick={onCopy}>{copied ? "Copied" : "Copy"}</button>
        </div>
      </section>

      {/* Zones */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-4">
          <a className="zone" href={BUY_LINK} target="_blank">
            <div className="zoneTitle">Buy Token</div>
            <div className="zoneText">Jupiter aggregator</div>
          </a>
          <a className="zone" href={CHART_LINK} target="_blank">
            <div className="zoneTitle">Track</div>
            <div className="zoneText">DexScreener live chart</div>
          </a>
          <a className="zone" href={TWITTER_COMMUNITY} target="_blank">
            <div className="zoneTitle">Join</div>
            <div className="zoneText">Community channel</div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 flex flex-col items-center gap-6 text-white/70">
        <div className="flex gap-6">
          <a href={TWITTER_COMMUNITY} target="_blank">
            <Twitter />
          </a>
          <a href={CHART_LINK} target="_blank">
            <Globe />
          </a>
        </div>
        <p className="text-xs opacity-60">
          $K2 or you're not even trying. Not financial advice.
        </p>
      </footer>

      <style jsx>{`
        .spacex {
          font-family: Orbitron, system-ui;
        }
        .vignette {
          background: linear-gradient(to bottom, rgba(0,0,0,.2), rgba(0,0,0,.55));
        }
        .title {
          font-size: clamp(44px, 6vw, 82px);
          font-weight: 800;
        }
        .subtitle {
          margin-top: 14px;
          max-width: 740px;
          opacity: 0.85;
        }
        .statPill {
          border-radius: 999px;
          padding: 14px;
          background: rgba(0,0,0,.26);
          border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(12px);
          text-align: center;
        }
        .statPillHot {
          background: rgba(255,255,255,.08);
        }
        .statLabel {
          font-size: 11px;
          letter-spacing: .22em;
          opacity: .6;
        }
        .statValue {
          font-size: 18px;
          font-weight: 700;
        }
        .meshBtn {
          border-radius: 999px;
          padding: 22px 28px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(14px);
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: white;
          transition: all .18s ease;
        }
        .meshBtnPrimary {
          background: rgba(255,255,255,.14);
          border-color: rgba(255,255,255,.4);
          animation: glow 2.6s ease-in-out infinite;
        }
        .meshBtnSecondary {
          opacity: .9;
        }
        @keyframes glow {
          50% {
            box-shadow: 0 0 22px rgba(255,255,255,.18);
          }
        }
        .contractPill {
          border-radius: 999px;
          padding: 12px 16px;
          background: rgba(0,0,0,.26);
          border: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(12px);
        }
        .zone {
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
          text-decoration: none;
          color: white;
        }
        .zoneTitle {
          font-weight: 800;
          letter-spacing: .08em;
          font-size: 12px;
        }
        .zoneText {
          margin-top: 8px;
          opacity: .75;
        }
        .floatLayer {
          position: fixed;
          inset: 0;
          z-index: 5;
        }
        .floaterBtn {
          position: absolute;
          background: none;
          border: none;
          animation: drift linear infinite;
        }
        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0,0,0,.35);
        }
        @keyframes drift {
          50% {
            transform: translate(var(--dx), var(--dy)) rotate(calc(var(--rot) * -1));
          }
        }
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.7);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modalCard {
          max-width: 960px;
          background: rgba(0,0,0,.6);
          padding: 16px;
          border-radius: 20px;
        }
        .modalImg {
          width: 100%;
          border-radius: 16px;
        }
        .modalClose {
          position: absolute;
          top: 12px;
          right: 12px;
        }
      `}</style>
    </main>
  )
}
