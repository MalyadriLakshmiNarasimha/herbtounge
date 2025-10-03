"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F3E9] to-[#0f5132]/10 overflow-hidden">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 z-0">
        <motion.svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Leaf Motif */}
          <motion.path
            d="M600 200 Q550 150 500 200 Q450 250 500 300 Q550 350 600 300 Q650 250 600 200"
            fill="#0f5132"
            opacity="0.1"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
          {/* Circuit Lines */}
          <motion.path
            d="M400 400 L500 400 L500 450 L550 450"
            stroke="#0EA5A4"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.path
            d="M700 400 L800 400 L800 350 L850 350"
            stroke="#0EA5A4"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
          {/* Connecting Elements */}
          <motion.circle
            cx="600"
            cy="400"
            r="5"
            fill="#0EA5A4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 2 }}
          />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          {/* Text Content */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f5132] mb-4">
              HerbalAuth — Objective Rasa (Taste) Analysis with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Turn subjective taste-based herb evaluation into fast, auditable, industry-grade decisions using sensors + AI.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
              <Badge variant="secondary" className="bg-[#0EA5A4] text-white">
                Ritual AI Verified
              </Badge>
              <Badge variant="outline" className="border-[#0f5132] text-[#0f5132]">
                Portable prototype
              </Badge>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-[#0f5132] hover:bg-[#0f5132]/90 text-white px-8 py-3">
                <Link href="/login?redirect=/dashboard/live-analysis">
                  Try Live Demo
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-[#0EA5A4] text-[#0EA5A4] hover:bg-[#0EA5A4] hover:text-white px-8 py-3">
                <a href="#problem-solution">See How It Works</a>
              </Button>
            </div>
          </motion.div>

          {/* Animation Placeholder (right side on large screens) */}
          <motion.div
            className="lg:w-1/2 mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Placeholder for additional visual or animation */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <p className="text-center text-[#0f5132] font-semibold">
                Interactive Demo Preview
              </p>
              {/* You can add a small preview or icon here */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
