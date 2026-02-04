"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Globe } from "lucide-react"

const BUY_LINK = "https://raydium.io/swap/?inputCurrency=sol&outputCurrency=8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump"
const CHART_LINK = "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
const TWITTER_COMMUNITY = "https://x.com/i/communities/2018452811802194000"

export default function Home() {
  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">

      {/* FIXED GALAXY BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg/k2.jpg')",
        }}
      />

      {/* SOFT OVERLAY FOR READABILITY */}
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[1px]" />

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          $K2 Kardashev II
        </h1>

        <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
          A civilization does not grow by accumulation, but by mastery of energy.
          Kardashev II is the threshold.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex gap-4">
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 bg-white/5 hover:bg-white/10 border-white/25 text-white"
            onClick={() => window.open(BUY_LINK, "_blank")}
          >
            Buy Token
          </Button>

          <Button
            variant="outline"
            className="rounded-full px-8 py-6 bg-white/5 hover:bg-white/10 border-white/25 text-white"
            onClick={() => window.open(CHART_LINK, "_blank")}
          >
            View Chart
          </Button>
        </div>

        {/* CONTRACT */}
        <div className="mt-8 flex items-center gap-3 bg-black/40 px-5 py-3 rounded-full text-sm">
          <span className="truncate max-w-[260px]">
            8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump
          </span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                "8aZEym6Uv5uy2LQ9BNSiSK3JKJEhbiUgpQppump"
              )
            }
            className="opacity-70 hover:opacity-100"
          >
            Copy
          </button>
        </div>
      </section>

      {/* TOKEN INFO – FREE FLOWING */}
      <section className="py-24 text-center space-y-6">
        <p className="text-sm tracking-widest text-white/60">SUPPLY</p>
        <p className="text-3xl font-semibold">1,000,000,000</p>

        <p className="text-sm tracking-widest text-white/60 mt-10">CHAIN</p>
        <p className="text-3xl font-semibold">Solana</p>

        <p className="text-sm tracking-widest text-white/60 mt-10">LIQUIDITY</p>
        <p className="text-3xl font-semibold">Live on Solana</p>
      </section>

      {/* FLOATING TWEETS */}
      <section className="relative py-32 overflow-hidden">
        <h2 className="text-2xl font-semibold text-center mb-20">
          Moments That Sparked It
        </h2>

        {/* FLOATING IMAGES */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { src: "/tweets/tweet1.png", top: "20%", left: "10%", delay: "0s" },
            { src: "/tweets/tweet2.png", top: "40%", left: "65%", delay: "2s" },
            { src: "/tweets/tweet3.png", top: "65%", left: "30%", delay: "4s" },
          ].map((t, i) => (
            <img
              key={i}
              src={t.src}
              className="absolute w-64 opacity-90 animate-float"
              style={{
                top: t.top,
                left: t.left,
                animationDelay: t.delay,
              }}
            />
          ))}
        </div>
      </section>

      {/* FOOTER LINKS */}
      <footer className="py-16 flex flex-col items-center gap-6 text-white/70">
        <div className="flex gap-6">
          <a href={TWITTER_COMMUNITY} target="_blank">
            <Twitter className="w-6 h-6 hover:text-white transition" />
          </a>
          <a href={CHART_LINK} target="_blank">
            <Globe className="w-6 h-6 hover:text-white transition" />
          </a>
        </div>

        <p className="text-xs opacity-60">
          $K2 or you're not even trying. Not financial advice.
        </p>
      </footer>

      {/* FLOAT ANIMATION */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        .animate-float {
          animation: float 14s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
