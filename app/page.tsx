"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, Copy } from "lucide-react";

export default function Page() {
  const TOKEN_NAME = "$K2 Kardashev II";
  const CHAIN = "Solana";
  const SUPPLY = "1,000,000,000";
  const LIQUIDITY = "Live on Solana";

  const CA = "8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump";
  const JUP_BUY = "https://jup.ag/tokens/8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump";
  const DEX = "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c";

  const X_COMMUNITY = "https://x.com/i/communities/2018452811802194000";

  // Put your background image in: public/bg/k2.jpg
  const BG_IMAGE = "/bg/k2.jpg";

  const tweets = useMemo(
    () => [
      {
        img: "/tweets/tweet1.png",
        link: "https://x.com/elonmusk/status/2018581923212439973",
        alt: "Elon tweet 1",
      },
      {
        img: "/tweets/tweet2.png",
        link: "https://x.com/elonmusk/status/2018483704398786796",
        alt: "Elon tweet 2",
      },
      {
        img: "/tweets/tweet3.png",
        link: "https://x.com/elonmusk/status/2018496451723018538",
        alt: "Elon tweet 3",
      },
    ],
    []
  );

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyCA() {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = CA;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopied(true);
    }
  }

  return (
    <div className="min-h-screen text-white">
      {/* Fixed background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Light cinematic overlay (keeps background visible but readable) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,210,120,0.22), rgba(0,0,0,0) 45%)," +
            "radial-gradient(circle at 70% 60%, rgba(120,170,255,0.18), rgba(0,0,0,0) 55%)," +
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.60))",
        }}
      />

      {/* Optional slight blur only behind content, not the whole bg */}
      <div className="min-h-screen">
        {/* Toast */}
        {copied && (
          <div className="fixed top-6 right-6 z-50 rounded-xl border border-white/10 bg-black/70 px-4 py-2 text-sm shadow-lg backdrop-blur">
            Copied
          </div>
        )}

        <main className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{TOKEN_NAME}</h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              A civilization does not grow by accumulation, but by mastery of energy. Kardashev II is the threshold.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button
                className="rounded-full px-6"
                onClick={() => window.open(JUP_BUY, "_blank")}
              >
                Buy Token
              </Button>

              <Button
                variant="outline"
                className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/10"
                onClick={() => window.open(DEX, "_blank")}
              >
                View Chart
              </Button>
            </div>

            {/* Contract Address line (no box) */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-white/60">Contract Address</span>

              <div className="flex w-full max-w-xl items-center justify-center gap-2">
                <div className="w-full truncate rounded-full border border-white/15 bg-black/35 px-5 py-3 text-sm text-white/90 backdrop-blur">
                  {CA}
                </div>

                <button
                  onClick={copyCA}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-3 text-sm text-white hover:bg-black/45 backdrop-blur"
                  aria-label="Copy contract address"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            </div>
          </motion.div>

          {/* FREE FLOWING TOKEN INFO (no boxes) */}
          <section className="mt-14">
            <div className="mx-auto flex max-w-3xl flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div className="md:flex-1">
                <div className="text-xs uppercase tracking-wider text-white/60">Supply</div>
                <div className="mt-1 text-2xl font-semibold">{SUPPLY}</div>
              </div>

              <div className="md:flex-1">
                <div className="text-xs uppercase tracking-wider text-white/60">Chain</div>
                <div className="mt-1 text-2xl font-semibold">{CHAIN}</div>
              </div>

              <div className="md:flex-1">
                <div className="text-xs uppercase tracking-wider text-white/60">Liquidity</div>
                <div className="mt-1 text-2xl font-semibold">{LIQUIDITY}</div>
              </div>
            </div>

            {/* subtle divider */}
            <div className="mx-auto mt-10 h-px max-w-3xl bg-white/10" />
          </section>

          {/* TWEETS */}
          <section className="mt-12">
            <h2 className="text-center text-2xl font-semibold md:text-3xl">Moments That Sparked It</h2>

            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
              {tweets.map((t, i) => (
                <a
                  key={i}
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur"
                  aria-label="Open tweet on X"
                >
                  {/* Hover overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
                      View on X
                    </div>
                  </div>

                  <img
                    src={t.img}
                    alt={t.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </a>
              ))}
            </div>
          </section>

          {/* SOCIALS */}
          <section className="mt-14 flex items-center justify-center gap-6">
            <a
              href={X_COMMUNITY}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-black/30 p-3 text-white/85 backdrop-blur transition hover:bg-black/45 hover:text-white"
              aria-label="Open X community"
              title="X Community"
            >
              <Twitter size={20} />
            </a>

            <a
              href={DEX}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-black/30 p-3 text-white/85 backdrop-blur transition hover:bg-black/45 hover:text-white"
              aria-label="Open Dexscreener"
              title="Dexscreener"
            >
              <Globe size={20} />
            </a>
          </section>

          <footer className="mt-14 text-center text-xs text-white/55">
            Not financial advice. Just vibes.
          </footer>
        </main>
      </div>
    </div>
  );
}
