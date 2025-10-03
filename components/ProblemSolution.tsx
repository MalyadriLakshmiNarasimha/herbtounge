"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingDown, Users, ShieldCheck } from "lucide-react";

export default function ProblemSolution() {
  return (
    <section id="problem-solution" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f5132] mb-4">
            Bridging ancient rasa wisdom with modern sensor science — objective herb authenticity in seconds.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-2xl text-red-800 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6" />
                  Why it matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    Adulteration and inconsistent quality make herbal products unreliable.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    Expert taste evaluation is subjective and hard to scale.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    Regulators and manufacturers need fast, low-cost verification.
                  </li>
                </ul>
                <div className="bg-red-100 p-4 rounded-lg mt-6">
                  <p className="text-red-800 font-semibold">
                    Market adulteration affects 20-30% of herbal products globally
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  Our approach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    Multi-sensor e-tongue + RF resonator for chemical & dielectric signatures.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    AI models map signals → herb identity, purity %, and adulteration flags.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    Explainability layer (SHAP + rasa mapping) + audit-ready reports.
                  </li>
                </ul>
                <div className="bg-green-100 p-4 rounded-lg mt-6">
                  <p className="text-green-800 font-semibold">
                    Portable device + cloud AI for field-ready verification
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Animated Flow Arrow and CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-8 h-8 text-[#0EA5A4]" />
            </motion.div>
            <span className="text-lg text-gray-600">Experience it yourself</span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <ArrowRight className="w-8 h-8 text-[#0EA5A4]" />
            </motion.div>
          </div>
          <Button asChild size="lg" className="bg-[#0f5132] hover:bg-[#0f5132]/90 text-white px-8 py-3">
            <Link href="/login?redirect=/dashboard/live-analysis">
              Try Live Demo
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
