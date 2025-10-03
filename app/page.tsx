import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* Short Problem Statement and Value Bullets */}
      <section className="py-12 bg-[#F7F3E9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 mb-8">
            Ayurvedic diagnosis depends on Rasa (taste), but human tasting is subjective and inconsistent. Market adulteration and phytochemical variability make quality assurance difficult for manufacturers and regulators.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-[#0f5132] mb-2">Objective Profiling</h3>
              <p className="text-sm text-gray-600">
                E-tongue + RF sensor + spectroscopy pipelines for taste-to-chemistry mapping.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-[#0f5132] mb-2">AI-Powered Detection</h3>
              <p className="text-sm text-gray-600">
                Classification, adulteration detection & explainable recommendations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-[#0f5132] mb-2">Field-Ready Solution</h3>
              <p className="text-sm text-gray-600">
                Portable, low-cost device + cloud-enabled model updates.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ProblemSolution />
    </main>
  );
}
