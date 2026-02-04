"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter, Globe } from "lucide-react";

export default function TokenLanding() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 -z-20 bg-black bg-center bg-cover"
        style={{ backgroundImage: "url('/bg/k2.jpg')" }}
      />

      {/* Brightened overlay */}
      <div className="fixed inset-0 -z-10 bg-black/55" />

      {/* Soft vignette */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_65%,rgba(0,0,0,0.75)_100%)]" />

      {/* Content */}
      <div className="flex flex-col items-center px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            $K2 Kardashev II
          </h1>

          <p className="text-gray-200 mb-8">
            Kardashev Type II on Solana. A pure space and AI narrative on the
            timeline.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              className="bg-white text-black hover:bg-zinc-200"
              onClick={() =>
                window.open(
                  "https://jup.ag/tokens/8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump",
                  "_blank"
                )
              }
            >
              Buy Token
            </Button>

            <Button
              className="border border-white text-white hover:bg-white hover:text-black"
              onClick={() =>
                window.open(
                  "https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c",
                  "_blank"
                )
              }
            >
              View Chart
            </Button>
          </div>

          {/* Contract Address */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-xs text-gray-300 mb-2">Contract Address</p>
            <div className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2 backdrop-blur-md">
              <span className="text-sm text-white truncate max-w-[320px] md:max-w-full">
                8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    "8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump"
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 transition rounded-lg px-3 py-1"
              >
                Copy
              </button>
            </div>
          </div>

          {copied && (
            <div className="fixed top-6 right-6 bg-zinc-950/60 border border-zinc-800 text-white text-sm px-4 py-2 rounded-xl shadow-lg backdrop-blur-md">
              Copied
            </div>
          )}
        </motion.div>

        {/* Token Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
          {[
            { label: "Supply", value: "1,000,000,000" },
            { label: "Chain", value: "Solana" },
            { label: "Liquidity", value: "Live on Solana" },
          ].map((item) => (
            <Card
              key={item.label}
              className="bg-zinc-950/40 border border-zinc-800 backdrop-blur-md shadow-xl"
            >
              <CardContent className="p-6 text-center">
                <h3 className="text-sm uppercase tracking-wide mb-2 text-gray-300">
                  {item.label}
                </h3>
                <p className="text-lg font-semibold text-white">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tweets */}
        <div className="mt-16 w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Moments That Sparked It
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "/tweets/tweet1.png",
                link: "https://x.com/elonmusk/status/2018581923212439973",
              },
              {
                img: "/tweets/tweet2.png",
                link: "https://x.com/elonmusk/status/2018483704398786796",
              },
              {
                img: "/tweets/tweet3.png",
                link: "https://x.com/elonmusk/status/2018496451723018538",
              },
            ].map((tweet, i) => (
              <a
                key={i}
                href={tweet.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden transition hover:border-zinc-600 backdrop-blur-md shadow-xl"
              >
                <img
                  src={tweet.img}
                  alt="Elon Musk tweet"
                  loading="lazy"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition bg-black/50 text-xs px-3 py-1 rounded-lg">
                    View on X
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Socials */}
        <div className="mt-24 flex gap-6">
          <a
            href="https://x.com/i/communities/2018452811802194000"
            target="_blank"
            rel="noopener noreferrer"
            title="Join the X Community"
            className="text-gray-300 hover:text-white transition hover:drop-shadow-[0_0_6px_rgba(0,255,200,0.6)]"
          >
            <Twitter size={22} />
          </a>

          <a
            href="https://dexscreener.com/solana/vugp9msnfzsc4jchwfyiakn3kuqubtmwmsktxwzsu6c"
            target="_blank"
            rel="noopener noreferrer"
            title="View on Dexscreener"
            className="text-gray-300 hover:text-white transition hover:drop-shadow-[0_0_6px_rgba(0,255,200,0.6)]"
          >
            <Globe size={22} />
          </a>
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-gray-300/70">
          K2 or you’re not even trying. Not financial advice.
        </p>
      </div>
    </div>
  );
}
