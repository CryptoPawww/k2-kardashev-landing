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

  const [phase, setPhase] = useState<"intro" | "tweets" | "deck">("intro")

  const introRef = useRef<HTMLElement | null>(null)
  const tweetsRef = useRef<HTMLElement | null>(null)
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

  useEffect(() => {
    const introEl = introRef.current
    const tweetsEl = tweetsRef.current
    const deckEl = deckRef.current
    if (!introEl || !tweetsEl || !deckEl) return

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section as the active phase
        let best: { id: string; ratio: number } | null = null
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.phaseId || ""
          const ratio = e.intersectionRatio
          if (!best || ratio > best.ratio) best = { id, ratio }
        }
        if (!best) return
        if (best.id === "intro") setPhase("intro")
        if (best.id === "tweets") setPhase("tweets")
        if (best.id === "deck") setPhase("deck")
      },
      {
        threshold: [0.35, 0.5, 0.65],
      }
    )

    io.observe(introEl)
    io.observe(tweetsEl)
    io.observe(deckEl)

    return () => io.disconnect()
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

  const scrollToTweets = () => {
    tweetsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const scrollToDeck = () => {
    deckRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className={`spacex root phase-${phase}`}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800&display=swap");
      `}</style>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/k2.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45 vignette" />

      {/* Floating tweets (only fully on in the middle section) */}
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

      {/* 1) INTRO: brand first */}
      <section
        ref={introRef as any}
        data-phase-id="intro"
        className="section intro"
      >
        <div className="introCenter">
          <Image
            src="/brand/k2-logo.jpg"
            alt="K2 Kardashev II"
            width={780}
            height={360}
            priority
            className="introLogo"
            draggable={false}
          />
          <button className="introScroll" onClick={scrollToTweets} type="button">
            <span className="scrollLabel">ENTER</span>
            <ChevronDown />
          </button>
        </div>
        <div className="heroFade" aria-hidden="true" />
      </section>

      {/* 2) MIDDLE: tweet wall */}
      <section
        ref={tweetsRef as any}
        data-phase-id="tweets"
        className="section tweets"
      >
        {/* Minimal badge only during tweet wall */}
        <div className="brandBadge" aria-hidden="true">
          <Image
            src="/brand/k2-logo.png"
            alt="K2 Kardashev II"
            width={240}
            height={110}
            className="brandBadgeImg"
            draggable={false}
            priority
          />
        </div>

        <div className="scrollCue">
          <button className="scrollBtn" onClick={scrollToDeck} type="button">
            <span className="scrollLabel">SCROLL</span>
            <ChevronDown />
          </button>
        </div>
        <div className="heroFade" aria-hidden="true" />
      </section>

      {/* 3) BOTTOM: functions deck */}
      <section
        ref={deckRef as any}
        data-phase-id="deck"
        className="deck section"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 grid gap-6 relative z-10">
          <p className="quote">
            A civilization does not grow by accumulation, but by mastery of
            energy. Kardashev II is the threshold.
          </p>

          <div className="contractRow flex items-center justify-center -mt-2">
            <div className="contractPill flex items-center gap-3">
              <span className="truncate max-w-[560px]">{CA}</span>
              <button onClick={onCopy} type="button" className="copyBtn">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

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

          <div className="mx-auto max-w-5xl w-full grid md:grid-cols-3 gap-4 pt-2">
            <a className="zone" href={BUY_LINK} target="_blank" rel="noreferrer">
              <div className="zoneTitle">Swap Token</div>
              <div className="zoneText">Jupiter</div>
            </a>

            <a
              className="zone"
              href={CHART_LINK}
              target="_blank"
              rel="noreferrer"
            >
              <div className="zoneTitle">Chart</div>
              <div className="zoneText">DexScreener</div>
            </a>

            <a
              className="zone"
              href={TWITTER_COMMUNITY}
              target="_blank"
              rel="noreferrer"
            >
              <div className="zoneTitle">Socials</div>
              <div className="zoneText">X Community</div>
            </a>
          </div>

          <div className="socialRow flex items-center justify-center gap-6 pt-4 text-white/70">
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

          <p className="fineprint text-center text-xs opacity-60">
            K2 or you're not even trying. Not financial advice.
          </p>
        </div>
      </section>

      <style jsx>{`
        .root {
          font-family: Orbitron, system-ui;
          color: white;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        .vignette {
          background: linear-gradient(to bottom, rgba(0,0,0,.2), rgba(0,0,0,.55));
        }

        .section {
          position: relative;
          min-height: 100vh;
          z-index: 10;
        }

        /* Phase control for tweet layer */
        .floatLayer {
          z-index: 5;
          pointer-events: none;
          transition: opacity .35s ease, filter .35s ease;
        }
        .phase-intro .floatLayer {
          opacity: 0;
          filter: blur(6px);
        }
        .phase-tweets .floatLayer {
          opacity: 1;
          filter: blur(0px);
        }
        .phase-deck .floatLayer {
          opacity: 0.15;
          filter: blur(2px);
        }
        .floaterBtn {
          pointer-events: auto;
          position: absolute;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          animation: drift linear infinite;
        }
        .tweetImg {
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0,0,0,.35);
        }
        @keyframes drift {
          50% { transform: translate(var(--dx), var(--dy)) rotate(calc(var(--rot) * -1)); }
        }

        /* Intro brand */
        .introCenter {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          gap: 18px;
          padding: 24px;
        }
        .introLogo {
          width: min(720px, 86vw);
          height: auto;
          filter: drop-shadow(0 22px 70px rgba(0,0,0,.6));
          opacity: 0;
          transform: translateY(10px);
          animation: introIn .55s ease forwards;
        }
        @keyframes introIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .introScroll {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,.18);
          background: rgba(0,0,0,.32);
          backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 10px 14px;
          color: rgba(255,255,255,.9);
          cursor: pointer;
        }

        /* Tweet wall badge */
        .brandBadge {
          position: fixed;
          top: 18px;
          left: 18px;
          z-index: 25;
          pointer-events: none;
          opacity: .85;
        }
        .brandBadgeImg {
          width: clamp(120px, 14vw, 200px);
          height: auto;
          filter: drop-shadow(0 10px 26px rgba(0,0,0,.6));
          mix-blend-mode: screen;
        }

        /* Scroll cue */
        .scrollCue {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 12vh;
          z-index: 30;
        }
        .scrollBtn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,.18);
          background: rgba(0,0,0,.32);
          backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 10px 14px;
          color: rgba(255,255,255,.9);
          cursor: pointer;
        }
        .scrollLabel {
          font-size: 11px;
          letter-spacing: .22em;
          opacity: .9;
        }

        .heroFade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 22vh;
          background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.55), rgba(0,0,0,.95));
          pointer-events: none;
        }

        /* Deck */
        .deck {
          background: #050608;
        }
        .deck:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,.18), transparent);
          opacity: .7;
        }

        .quote {
          text-align: center;
          max-width: 860px;
          margin: 0 auto;
          opacity: .82;
          line-height: 1.6;
          font-size: clamp(14px, 1.5vw, 16px);
        }

        .contractPill {
          border-radius: 999px;
          padding: 12px 14px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(12px);
        }
        .copyBtn {
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(0,0,0,.25);
          border: 1px solid rgba(255,255,255,.16);
          color: rgba(255,255,255,.9);
          cursor: pointer;
        }

        .statPill {
          border-radius: 999px;
          padding: 14px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(12px);
          text-align: center;
        }
        .statPillHot { background: rgba(255,255,255,.08); }
        .statLabel { font-size: 11px; letter-spacing: .22em; opacity: .6; }
        .statValue { font-size: 18px; font-weight: 700; }

        .zone {
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.12);
          text-decoration: none;
          color: white;
        }
        .zoneTitle { font-weight: 800; letter-spacing: .08em; font-size: 12px; }
        .zoneText { margin-top: 8px; opacity: .75; }

        .iconLink { opacity: .8; }
        .fineprint { margin-top: 10px; }

        /* Modal */
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.72);
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
          background: rgba(0,0,0,.62);
          border: 1px solid rgba(255,255,255,.12);
          padding: 14px;
          border-radius: 20px;
        }
        .modalImg { width: 100%; height: auto; border-radius: 16px; }
        .modalClose {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(0,0,0,.35);
          border: 1px solid rgba(255,255,255,.16);
          color: rgba(255,255,255,.9);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </main>
  )
}
