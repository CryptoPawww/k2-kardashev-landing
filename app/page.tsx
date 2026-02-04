"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Twitter, Globe, X, ChevronDown } from "lucide-react"

const BUY_LINK =
  "https://jup.ag/tokens/8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump"
const CHART_LINK =
  "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
const TWITTER_COMMUNITY =
  "https://x.com/i/communities/2018452811802194000"

// CA should match the mint in BUY_LINK
const CA = "8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump"

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
  const deckRef = useRef<HTMLElement | null>(null)

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

  useEffect(() => {
    if (!activeTweet) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [activeTweet])

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
        opacity: clamp(0.48 + r * 0.36, 0.48, 0.9),
        z: Math.round(1 + r * 3),
      }
    })
  }, [TWEETS])

  const onCopy = async () => {
    await navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const scrollToDeck = () => {
    deckRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
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

      {/* Floating tweets (non-blocking layer) */}
      <div className="fixed inset-0 floatLayer" aria-hidden="true">
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
            type="button"
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={f.size}
              height={Math.round(f.size * 0.6)}
              className="tweetImg"
              draggable={false}
              priority={false}
            />
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeTweet && (
        <div className="modalOverlay" onClick={() => setActiveTweet(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button
              className="modalClose"
              onClick={() => setActiveTweet(null)}
              type="button"
              aria-label="Close"
            >
              <X />
            </button>
            <Image
              src={activeTweet.src}
              alt={activeTweet.alt}
              width={1400}
              height={820}
              className="modalImg"
              priority
            />
          </div>
        </div>
      )}

      {/* HERO (clean, cinematic) */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="heroInner w-full max-w-6xl">
          {/* Logo replaces title */}
          <div className="logoWrap mx-auto">
            <Image
              src="/brand/k2-logo.png"
              alt="$K2"
              width={860}
              height={260}
              className="logoImg"
              priority
            />
            <div className="logoMetal" aria-hidden="true" />
          </div>

          {/* Subtitle lower, cinematic */}
          <div className="subtitleWrap">
            <p className="subtitle">
              A civilization does not grow by accumulation, but by mastery of
              energy. Kardashev II is the threshold.
            </p>
          </div>

          {/* Scroll cue */}
          <div className="scrollCue">
            <button className="scrollBtn" onClick={scrollToDeck} type="button">
              <span className="scrollLabel">SCROLL</span>
              <ChevronDown />
            </button>
          </div>
        </div>

        {/* Teased fade-to-black at hero bottom */}
        <div className="heroFade" aria-hidden="true" />
      </section>

      {/* CONTROL DECK (black panel below, all functionality here) */}
      <section ref={deckRef as any} className="relative z-10 deck">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="deckTop grid gap-6">
            {/* Buttons */}
            <div className="deckButtons flex gap-4 justify-center flex-wrap">
              <button
                className="meshBtn meshBtnPrimary"
                onClick={() => window.open(BUY_LINK, "_blank")}
                type="button"
              >
                <span className="btnMain">Buy Token</span>
                <span className="btnSub">Jupiter swap</span>
              </button>

              <button
                className="meshBtn meshBtnSecondary"
                onClick={() => window.open(CHART_LINK, "_blank")}
                type="button"
              >
                View Chart
              </button>
            </div>

            {/* Contract */}
            <div className="contractRow flex items-center justify-center">
              <div className="contractPill flex items-center gap-3">
                <span className="truncate max-w-[520px]">{CA}</span>
                <button onClick={onCopy} type="button" className="copyBtn">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto w-full">
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

            {/* Zones */}
            <div className="mx-auto max-w-5xl w-full grid md:grid-cols-3 gap-4 pt-2">
              <a className="zone" href={BUY_LINK} target="_blank" rel="noreferrer">
                <div className="zoneTitle">Buy Token</div>
                <div className="zoneText">Jupiter aggregator</div>
              </a>
              <a
                className="zone"
                href={CHART_LINK}
                target="_blank"
                rel="noreferrer"
              >
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

            {/* Socials */}
            <div className="socialRow flex items-center justify-center gap-6 pt-6 text-white/70">
              <a
                className="iconLink"
                href={TWITTER_COMMUNITY}
                target="_blank"
                rel="noreferrer"
                aria-label="Community"
              >
                <Twitter />
              </a>
              <a
                className="iconLink"
                href={CHART_LINK}
                target="_blank"
                rel="noreferrer"
                aria-label="Chart"
              >
                <Globe />
              </a>
            </div>

            <p className="fineprint text-center text-xs opacity-60 pt-2">
              $K2 or you're not even trying. Not financial advice.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .spacex {
          font-family: Orbitron, system-ui;
        }
        .vignette {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.55)
          );
        }

        /* Hero layout */
        .heroInner {
          position: relative;
          padding-top: 6vh;
          padding-bottom: 10vh;
        }
        .logoWrap {
          position: relative;
          width: min(860px, 92vw);
          height: auto;
        }
        .logoImg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 18px 60px rgba(0, 0, 0, 0.55));
          opacity: 0.95;
          user-select: none;
          pointer-events: none;
        }

        /* Subtle metallic overlay using mask */
        .logoMetal {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0.18),
            rgba(255, 255, 255, 0.02) 35%,
            rgba(255, 255, 255, 0.14) 55%,
            rgba(255, 255, 255, 0.01)
          );
          mix-blend-mode: overlay;
          -webkit-mask-image: url("/brand/k2-logo.png");
          mask-image: url("/brand/k2-logo.png");
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
        }

        .subtitleWrap {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 10vh;
          width: min(760px, 92vw);
          text-align: center;
        }
        .subtitle {
          margin: 0;
          opacity: 0.78;
          line-height: 1.55;
          font-size: clamp(14px, 1.5vw, 16px);
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
        }

        .scrollCue {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 3.5vh;
        }
        .scrollBtn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 10px 14px;
          color: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          transition: transform 0.16s ease, border-color 0.16s ease,
            background 0.16s ease, opacity 0.16s ease;
          animation: cue 2.8s ease-in-out infinite;
        }
        .scrollBtn:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.32);
          background: rgba(0, 0, 0, 0.26);
          animation: none;
        }
        .scrollLabel {
          font-size: 11px;
          letter-spacing: 0.22em;
          opacity: 0.85;
        }
        @keyframes cue {
          50% {
            opacity: 0.65;
            transform: translateY(1px);
          }
        }

        .heroFade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 22vh;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.95)
          );
          pointer-events: none;
        }

        /* Control deck */
        .deck {
          background: #050608;
          position: relative;
        }
        .deck:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent
          );
          opacity: 0.6;
        }

        /* Buttons */
        .meshBtn {
          border-radius: 999px;
          padding: 18px 22px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(14px);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: white;
          transition: transform 0.16s ease, background 0.16s ease,
            border-color 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .meshBtnPrimary {
          padding: 18px 26px;
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.4);
          animation: glow 2.8s ease-in-out infinite;
        }
        .meshBtnPrimary:hover,
        .meshBtnPrimary:focus-visible {
          animation: none;
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.16);
          transform: translateY(-1px);
        }
        .meshBtnSecondary {
          opacity: 0.92;
        }
        .meshBtnSecondary:hover,
        .meshBtnSecondary:focus-visible {
          opacity: 1;
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.32);
        }
        .btnMain {
          display: inline-block;
        }
        .btnSub {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: none;
          opacity: 0.75;
        }
        @keyframes glow {
          50% {
            box-shadow: 0 0 22px rgba(255, 255, 255, 0.14);
          }
        }

        /* Contract */
        .contractPill {
          border-radius: 999px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(12px);
        }
        .copyBtn {
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: transform 0.16s ease, border-color 0.16s ease;
        }
        .copyBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.28);
        }

        /* Stats */
        .statPill {
          border-radius: 999px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(12px);
          text-align: center;
        }
        .statPillHot {
          background: rgba(255, 255, 255, 0.08);
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

        /* Zones */
        .zone {
          border-radius: 22px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-decoration: none;
          color: white;
          transition: transform 0.16s ease, border-color 0.16s ease,
            background 0.16s ease;
        }
        .zone:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.065);
        }
        .zoneTitle {
          font-weight: 800;
          letter-spacing: 0.08em;
          font-size: 12px;
        }
        .zoneText {
          margin-top: 8px;
          opacity: 0.75;
        }

        .iconLink {
          opacity: 0.8;
          transition: opacity 0.16s ease, transform 0.16s ease;
        }
        .iconLink:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        /* Float layer behavior */
        .floatLayer {
          position: fixed;
          inset: 0;
          z-index: 5;
          pointer-events: none;
        }
        .floaterBtn {
          pointer-events: auto;
          position: absolute;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          animation: drift linear infinite;
          transition: transform 0.16s ease, filter 0.16s ease, opacity 0.16s ease;
          filter: saturate(0.95) blur(0.3px);
        }
        .floaterBtn:hover {
          filter: saturate(1.05) blur(0px);
          opacity: 1 !important;
          transform: translateY(-2px) scale(1.01);
        }
        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
        }
        @keyframes drift {
          50% {
            transform: translate(var(--dx), var(--dy))
              rotate(calc(var(--rot) * -1));
          }
        }

        /* Modal */
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px;
          backdrop-filter: blur(8px);
        }
        .modalCard {
          position: relative;
          width: min(980px, 96vw);
          background: rgba(0, 0, 0, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 14px;
          border-radius: 20px;
          transform: scale(0.985);
          opacity: 0;
          animation: modalIn 0.18s ease forwards;
        }
        @keyframes modalIn {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .modalImg {
          width: 100%;
          height: auto;
          border-radius: 16px;
        }
        .modalClose {
          position: absolute;
          top: 10px;
          right: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: transform 0.16s ease, border-color 0.16s ease;
        }
        .modalClose:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.28);
        }
      `}</style>
    </main>
  )
}
