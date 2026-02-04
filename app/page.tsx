'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Twitter, Globe } from 'lucide-react'

export default function Home() {
  const CA = '8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump'
  const [copied, setCopied] = useState(false)

  const copyCA = async () => {
    await navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      {/* === FIXED GALAXY BACKGROUND === */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/galaxy.jpg')" }}
      />

      {/* Darken + blur */}
      <div className="fixed inset-0 -z-20 bg-black/70 backdrop-blur-sm" />

      {/* Cosmic glow */}
      <div className="fixed inset-0 -z-10 bg-gradient-radial from-transparent via-black/40 to-black" />

      {/* === CONTENT === */}
      <section className="relative z-10 flex flex-col items-center px-6 py-32 space-y-24">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-5xl font-bold tracking-tight">
            $K2 Kardashev II
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            A civilization does not grow by accumulation, but by mastery of energy.
            Kardashev II is the threshold.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="https://jup.ag/tokens/8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump"
              target="_blank"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
            >
              Buy Token
            </a>

            <a
              href="https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
              target="_blank"
              className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
            >
              View Chart
            </a>
          </div>

          {/* Contract */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur border border-white/20">
              <span className="text-sm text-gray-300 truncate max-w-[240px]">
                {CA}
              </span>
              <button onClick={copyCA} className="hover:text-white">
                <Copy size={16} />
              </button>
            </div>
          </div>

          {copied && (
            <div className="mt-3 text-sm text-green-400">
              Copied
            </div>
          )}
        </motion.div>

        {/* TOKEN INFO */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          {[
            { title: 'Supply', value: '1,000,000,000' },
            { title: 'Chain', value: 'Solana' },
            { title: 'Liquidity', value: 'Live on Solana' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 text-center"
            >
              <p className="text-gray-400 text-sm">{item.title}</p>
              <p className="mt-2 text-xl font-semibold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* TWEETS */}
        <div className="max-w-5xl w-full">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Moments That Sparked It
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { img: '/tweets/tweet1.png', link: 'https://x.com/elonmusk/status/2018581923212439973' },
              { img: '/tweets/tweet2.png', link: 'https://x.com/elonmusk/status/2018483704398786796' },
              { img: '/tweets/tweet3.png', link: 'https://x.com/elonmusk/status/2018496451723018538' },
            ].map((t, i) => (
              <a
                key={i}
                href={t.link}
                target="_blank"
                className="group relative overflow-hidden rounded-2xl border border-white/20"
              >
                <img
                  src={t.img}
                  loading="lazy"
                  className="group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition">
                  <span className="px-4 py-2 bg-white text-black rounded-full text-sm">
                    View on X
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FOOTER ICONS */}
        <div className="flex gap-6 opacity-80">
          <a
            href="https://x.com/i/communities/2018452811802194000"
            target="_blank"
            className="hover:scale-110 transition"
          >
            <Twitter />
          </a>

          <a
            href="https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
            target="_blank"
            className="hover:scale-110 transition"
          >
            <Globe />
          </a>
        </div>

      </section>
    </main>
  )
}
