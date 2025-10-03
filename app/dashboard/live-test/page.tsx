"use client";

import React, { useState, useRef } from "react";
import Papa from "papaparse";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

declare module "react-gauge-chart";

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DEMO_SAMPLES = [
  {
    sampleID: "TULSI_01",
    name: "Tulsi (Authentic)",
    sensors: {
      voltammetry: [0.1, 0.12, 0.09, 0.08, 0.07],
      pH: 6.5,
      tds_ec: 210,
      orp: 150,
      turbidity: 0.2,
      temperature: 24.5,
      moisture: 10.2,
      ion_selective: { Na: 4.0, K: 2.8, Ca: 1.5 },
      rf_resonator: 1.95,
    },
    expected: {
      herbName: "Tulsi",
      purityPercent: 96.5,
      adulterationFlag: false,
      confidence: 0.93,
      tasteProfile: ["bitter", "pungent"],
      recommendation: "Good quality — safe for use",
    },
  },
  {
    sampleID: "TULSI_AD_01",
    name: "Tulsi (Adulterated)",
    sensors: {
      voltammetry: [0.2, 0.25, 0.22, 0.18, 0.16],
      pH: 6.8,
      tds_ec: 820,
      orp: 95,
      turbidity: 1.8,
      temperature: 25.0,
      moisture: 18.5,
      ion_selective: { Na: 45.0, K: 5.1, Ca: 3.2 },
      rf_resonator: 3.65,
    },
    expected: {
      herbName: "Tulsi (adulterated)",
      purityPercent: 42.0,
      adulterationFlag: true,
      confidence: 0.89,
      tasteProfile: ["salty", "bitter"],
      recommendation: "Likely salt-based adulteration — reject batch",
    },
  },
  {
    sampleID: "ASHW_01",
    name: "Ashwagandha (Authentic)",
    sensors: {
      voltammetry: [0.05, 0.06, 0.07, 0.06],
      pH: 5.8,
      tds_ec: 150,
      orp: 220,
      turbidity: 0.12,
      temperature: 23.4,
      moisture: 9.0,
      ion_selective: { Na: 3.1, K: 2.2, Ca: 0.9 },
      rf_resonator: 1.62,
    },
    expected: {
      herbName: "Ashwagandha",
      purityPercent: 95.0,
      adulterationFlag: false,
      confidence: 0.91,
      tasteProfile: ["bitter", "astringent"],
      recommendation: "Accept — meets QC thresholds",
    },
  },
  {
    sampleID: "ASHW_AD_01",
    name: "Ashwagandha (Adulterated)",
    sensors: {
      voltammetry: [0.14, 0.17, 0.15, 0.12],
      pH: 6.2,
      tds_ec: 680,
      orp: 110,
      turbidity: 1.2,
      temperature: 24.0,
      moisture: 16.0,
      ion_selective: { Na: 38, K: 4.5, Ca: 2.0 },
      rf_resonator: 3.4,
    },
    expected: {
      herbName: "Ashwagandha (adulterated)",
      purityPercent: 50,
      adulterationFlag: true,
      confidence: 0.86,
      tasteProfile: ["salty", "bitter"],
      recommendation: "Reject — adulteration detected",
    },
  },
  {
    sampleID: "TRIPHALA_01",
    name: "Triphala",
    sensors: {
      voltammetry: [0.08, 0.09, 0.1, 0.095],
      pH: 4.4,
      tds_ec: 120,
      orp: 260,
      turbidity: 0.08,
      temperature: 22.8,
      moisture: 8.5,
      ion_selective: { Na: 2.2, K: 1.9, Ca: 0.8 },
      rf_resonator: 1.5,
    },
    expected: {
      herbName: "Triphala",
      purityPercent: 93,
      adulterationFlag: false,
      confidence: 0.92,
      tasteProfile: ["sour", "astringent"],
      recommendation: "Pass — standard profile",
    },
  },
  {
    sampleID: "GUDUCHI_01",
    name: "Guduchi",
    sensors: {
      voltammetry: [0.07, 0.08, 0.065],
      pH: 6.0,
      tds_ec: 180,
      orp: 210,
      turbidity: 0.15,
      temperature: 23.0,
      moisture: 9.8,
      ion_selective: { Na: 3.8, K: 2.7, Ca: 1.1 },
      rf_resonator: 1.7,
    },
    expected: {
      herbName: "Guduchi",
      purityPercent: 94,
      adulterationFlag: false,
      confidence: 0.9,
      tasteProfile: ["bitter", "astringent"],
      recommendation: "Pass",
    },
  },
  {
    sampleID: "NEEM_01",
    name: "Neem",
    sensors: {
      voltammetry: [0.11, 0.12, 0.1, 0.09],
      pH: 6.3,
      tds_ec: 240,
      orp: 180,
      turbidity: 0.25,
      temperature: 24.0,
      moisture: 11,
      ion_selective: { Na: 5.5, K: 3.5, Ca: 1.9 },
      rf_resonator: 1.95,
    },
    expected: {
      herbName: "Neem",
      purityPercent: 90,
      adulterationFlag: false,
      confidence: 0.88,
      tasteProfile: ["bitter"],
      recommendation: "Accept",
    },
  },
  {
    sampleID: "SHATAVARI_01",
    name: "Shatavari",
    sensors: {
      voltammetry: [0.06, 0.07, 0.065, 0.06],
      pH: 5.9,
      tds_ec: 160,
      orp: 230,
      turbidity: 0.1,
      temperature: 23.7,
      moisture: 9.2,
      ion_selective: { Na: 3.9, K: 2.4, Ca: 1.0 },
      rf_resonator: 1.6,
    },
    expected: {
      herbName: "Shatavari",
      purityPercent: 94,
      adulterationFlag: false,
      confidence: 0.9,
      tasteProfile: ["sweet", "bitter"],
      recommendation: "Pass",
    },
  },
  {
    sampleID: "TRIKATU_01",
    name: "Trikatu (mix)",
    sensors: {
      voltammetry: [0.09, 0.095, 0.1, 0.09],
      pH: 5.1,
      tds_ec: 200,
      orp: 190,
      turbidity: 0.18,
      temperature: 24.1,
      moisture: 10.0,
      ion_selective: { Na: 3.2, K: 2.1, Ca: 1.0 },
      rf_resonator: 1.7,
    },
    expected: {
      herbName: "Trikatu",
      purityPercent: 91,
      adulterationFlag: false,
      confidence: 0.89,
      tasteProfile: ["pungent", "bitter"],
      recommendation: "Pass",
    },
  },
  {
    sampleID: "AMLA_01",
    name: "Amla",
    sensors: {
      voltammetry: [0.07, 0.08, 0.09, 0.085],
      pH: 3.8,
      tds_ec: 95,
      orp: 300,
      turbidity: 0.05,
      temperature: 22.6,
      moisture: 7.8,
      ion_selective: { Na: 1.0, K: 1.2, Ca: 0.5 },
      rf_resonator: 1.2,
    },
    expected: {
      herbName: "Amla",
      purityPercent: 96,
      adulterationFlag: false,
      confidence: 0.95,
      tasteProfile: ["sour"],
      recommendation: "Pass",
    },
  },
  {
    sampleID: "GOKSHURA_01",
    name: "Gokshura",
    sensors: {
      voltammetry: [0.05, 0.06, 0.055],
      pH: 5.7,
      tds_ec: 140,
      orp: 210,
      turbidity: 0.09,
      temperature: 23.5,
      moisture: 8.6,
      ion_selective: { Na: 2.9, K: 2.0, Ca: 0.9 },
      rf_resonator: 1.58,
    },
    expected: {
      herbName: "Gokshura",
      purityPercent: 93,
      adulterationFlag: false,
      confidence: 0.9,
      tasteProfile: ["sweet"],
      recommendation: "Pass",
    },
  },
];

type IonISE = { Na: number; K: number; Ca: number };

type Sensors = {
  voltammetry: number[];
  pH: number;
  tds_ec: number;
  orp: number;
  turbidity: number;
  temperature: number;
  moisture: number;
  ion_selective: IonISE;
  rf_resonator: number;
};

type Expected = {
  herbName: string;
  purityPercent: number;
  adulterationFlag: boolean;
  confidence: number;
  tasteProfile: string[];
  recommendation: string;
};

type Sample = {
  sampleID: string;
  name?: string;
  sensors: Sensors;
  expected?: Expected;
};

const simulateProcessingMessages = [
  "Filtering noise and baseline correction…",
  "Extracting CSRR features & voltammetry peaks…",
  "Running ensemble classifier (SVM + 1D-CNN fallback)…",
];

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function ExplainabilityCard({
  shap,
  summary,
}: {
  shap: { feature: string; value: number }[];
  summary: string;
}) {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h3 className="font-semibold text-lg">Why the AI decided this</h3>
      <div className="mt-3 space-y-2">
        {shap.slice(0, 6).map((s) => (
          <div key={s.feature} className="flex items-center gap-3">
            <div className="w-36 text-sm text-slate-700">{s.feature}</div>
            <div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.abs(s.value) * 100)}%` }}
                className={`h-2 ${s.value > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
              />
            </div>
            <div className="w-12 text-right text-sm">{(s.value * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-600">{summary}</p>
    </div>
  );
}

export default function LiveTestPage() {
  const [step, setStep] = useState<number>(1);
  const [selected, setSelected] = useState<Sample | null>(null);
  const [uploadedRows, setUploadedRows] = useState<any[] | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<Expected | null>(null);
  const [resultSensors, setResultSensors] = useState<Sensors | null>(null);
  const resultsPanelRef = useRef<HTMLDivElement | null>(null);

  const [modelVersion] = useState("v0.9-demo");
  const [deviceId] = useState("HERB-E-TONGUE-001");

  type SensorRow = {
    sampleID?: string;
    pH?: number;
    tds_ec?: number;
    orp?: number;
    turbidity?: number;
    temperature?: number;
    moisture?: number;
    rf_resonator?: number;
    voltammetry?: string;
    ion_selective?: string;
  };

  function handleFileUpload(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<SensorRow>) => {
        const data = results.data.map((r) => {
          const toNum = (v?: string | number) =>
            v === undefined || v === null || v === "" ? undefined : Number(v);
          return {
            sampleID: r.sampleID,
            pH: toNum(r.pH as any),
            tds_ec: toNum(r.tds_ec as any),
            orp: toNum(r.orp as any),
            turbidity: toNum(r.turbidity as any),
            temperature: toNum(r.temperature as any),
            moisture: toNum(r.moisture as any),
            rf_resonator: toNum(r.rf_resonator as any),
            voltammetry: r.voltammetry,
            ion_selective: r.ion_selective,
          };
        });
        setUploadedRows(data);
        const first = data[0];
        if (first) {
          const sensors: any = {
            voltammetry: first.voltammetry
              ? (first.voltammetry as string).split(",").map((x) => Number(x.trim()))
              : [0],
            pH: first.pH ?? 7,
            tds_ec: first.tds_ec ?? 0,
            orp: first.orp ?? 0,
            turbidity: first.turbidity ?? 0,
            temperature: first.temperature ?? 25,
            moisture: first.moisture ?? 0,
            ion_selective: { Na: 0, K: 0, Ca: 0 },
            rf_resonator: first.rf_resonator ?? 0,
          };
          setSelected({
            sampleID: first.sampleID ?? "UPLOADED_1",
            name: first.sampleID ?? "Uploaded sample",
            sensors,
            expected: undefined,
          });
          setStep(1);
        }
      },
      error: (err) => {
        console.error("CSV parse error", err);
        alert("Failed to parse file. Make sure it is CSV with header row.");
      },
    });
  }

  async function handleAnalyze() {
    if (!selected) {
      alert("Please select a demo sample or upload data first.");
      return;
    }

    setIsProcessing(true);
    setStep(2);
    setResult(null);
    setResultSensors(null);

    for (let i = 0; i < simulateProcessingMessages.length; i++) {
      setProcessingMessage(simulateProcessingMessages[i]);
      await sleep(400);
    }

    await sleep(300);

    // TODO: Replace simulation with backend call:
    // try {
    //   const res = await fetch('/api/classify', {
    //      method: 'POST',
    //      headers: { 'Content-Type': 'application/json' },
    //      body: JSON.stringify({ sampleID: selected.sampleID, sensors: selected.sensors })
    //   });
    //   const json = await res.json();
    //   setResult(json);
    // } catch (e) { ... }

    let output: Expected;
    if (selected.expected) {
      output = selected.expected;
    } else {
      const s = selected.sensors;
      const isAd = s.tds_ec > 500 || s.rf_resonator > 3.0 || s.moisture > 15;
      output = {
        herbName: selected.name ?? "Unknown",
        purityPercent: isAd ? 45 : 92,
        adulterationFlag: isAd,
        confidence: isAd ? 0.84 : 0.9,
        tasteProfile: isAd ? ["salty"] : ["bitter"],
        recommendation: isAd ? "Reject — adulteration suspected" : "Pass",
      };
    }

    setResultSensors(selected.sensors);
    setResult(output);

    await sleep(300);
    setIsProcessing(false);
    setProcessingMessage(null);
    setStep(3);

    setTimeout(() => {
      resultsPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  async function handleDownloadPDF() {
    if (!resultsPanelRef.current) {
      alert("No results to export.");
      return;
    }
    const element = resultsPanelRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = 190;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.setFontSize(10);
    pdf.text(`Device: ${deviceId}  |  Model: ${modelVersion}`, 10, pdfHeight + 20);
    pdf.save(`${selected?.sampleID ?? "result"}_report.pdf`);
  }

  function getRadarTrace(s: Sensors) {
    const labels = ["pH", "Conductivity", "ORP", "Turbidity", "Temperature", "Moisture", "RF"];
    const values = [
      s.pH,
      s.tds_ec,
      s.orp,
      s.turbidity,
      s.temperature,
      s.moisture,
      s.rf_resonator,
    ];
    const scales = [14, 2000, 1000, 5, 40, 50, 5];
    const normalized = values.map((v, i) => Math.min(1, Number(v) / scales[i]));
    return { labels, values: normalized };
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HerbalAuth — Live Test</h1>
          <p className="text-sm text-slate-600">Run a real-time quality test: pick a demo or upload your sample, analyze, and download an audit-ready report.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs bg-slate-100 px-3 py-1 rounded">Model: {modelVersion}</div>
          <div className="text-xs bg-slate-100 px-3 py-1 rounded">Device: {deviceId}</div>
        </div>
      </header>

      <div className="bg-white rounded shadow p-5">
        <nav className="flex gap-4 mb-4" role="tablist" aria-label="wizard steps">
          <button
            className={`px-3 py-1 rounded ${step === 1 ? "bg-green-600 text-white" : "bg-slate-100"}`}
            onClick={() => setStep(1)}
            aria-current={step === 1}
          >
            1. Input
          </button>
          <button
            className={`px-3 py-1 rounded ${step === 2 ? "bg-amber-500 text-white" : "bg-slate-100"}`}
            onClick={() => setStep(2)}
            aria-current={step === 2}
          >
            2. Analyze
          </button>
          <button
            className={`px-3 py-1 rounded ${step === 3 ? "bg-blue-600 text-white" : "bg-slate-100"}`}
            onClick={() => setStep(3)}
            aria-current={step === 3}
          >
            3. Results
          </button>
        </nav>

        <div className="space-y-6">
          {step === 1 && (
            <section aria-labelledby="step-1">
              <h2 id="step-1" className="text-lg font-semibold">Step 1 — Input</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">Demo Samples</div>
                    <div className="text-xs text-slate-500">Click a card to select</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {DEMO_SAMPLES.map((s) => (
                      <button
                        key={s.sampleID}
                        onClick={() => {
                          setSelected(s as Sample);
                          setUploadedRows(null);
                        }}
                        className={`text-left p-3 rounded border hover:shadow-sm focus:outline-none focus:ring-2 ${
                          selected?.sampleID === s.sampleID ? "border-green-600 bg-green-50" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-slate-500">ID: {s.sampleID}</div>
                        <div className="mt-2 text-sm">
                          <span className="inline-block px-2 py-0.5 text-xs bg-slate-100 rounded">{s.expected?.adulterationFlag ? "Adulterated" : "Authentic"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-slate-600">
                    Or upload your own sample CSV/JSON (headers: sampleID,pH,tds_ec,orp,turbidity,temperature,moisture,rf_resonator,voltammetry)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Upload CSV / JSON</label>
                  <div className="mt-2">
                    <input
                      aria-label="Upload sample CSV or JSON"
                      type="file"
                      accept=".csv,application/json,text/csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.type === "application/json") {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            try {
                              const json = JSON.parse(String(ev.target?.result));
                              const obj = Array.isArray(json) ? json[0] : json;
                              const sensors = obj.sensors ?? {
                                voltammetry: obj.voltammetry ?? [0],
                                pH: obj.pH ?? 7,
                                tds_ec: obj.tds_ec ?? 0,
                                orp: obj.orp ?? 0,
                                turbidity: obj.turbidity ?? 0,
                                temperature: obj.temperature ?? 25,
                                moisture: obj.moisture ?? 0,
                                ion_selective: obj.ion_selective ?? { Na: 0, K: 0, Ca: 0 },
                                rf_resonator: obj.rf_resonator ?? 0,
                              };
                              setSelected({ sampleID: obj.sampleID ?? "UPLOAD_JSON", name: obj.name, sensors });
                              setUploadedRows(null);
                            } catch (err) {
                              alert("Invalid JSON file format");
                            }
                          };
                          reader.readAsText(file);
                        } else {
                          handleFileUpload(file);
                        }
                      }}
                      className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-slate-100 cursor-pointer"
                    />
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded">
                    <div className="text-xs text-slate-500">Selected sample</div>
                    <div className="mt-1 font-medium">{selected?.name ?? "None selected"}</div>
                    <div className="text-xs text-slate-500">ID: {selected?.sampleID ?? "-"}</div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setSelected(null)}
                        className="px-2 py-1 text-xs bg-slate-100 rounded"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          if (!selected) {
                            setSelected(DEMO_SAMPLES[0]);
                          }
                        }}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        Quick select demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
                  onClick={handleAnalyze}
                  disabled={!selected || isProcessing}
                  title="Runs preprocessing → AI inference → explainability. This demo runs a simulated model; production uses /api/classify."
                >
                  {isProcessing ? "Processing…" : "Analyze Sample"}
                </button>
                <button
                  className="px-4 py-2 bg-slate-100 rounded"
                  onClick={() => {
                    if (selected?.expected) {
                      setResult(selected.expected);
                      setResultSensors(selected.sensors);
                      setStep(3);
                    } else {
                      alert("Select a demo sample or upload first.");
                    }
                  }}
                >
                  View Demo Result
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-2">
              <h2 id="step-2" className="text-lg font-semibold">Step 2 — Analyze</h2>
              <div className="p-4 bg-slate-50 rounded">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-slate-600">{processingMessage ?? "Preparing…"}</div>
                    <div className="mt-2 text-xs text-slate-500">Preprocessing sensor signals → extracting features → running classification and explainability</div>
                  </div>
                  <div className="ml-auto">
                    <div className="h-8 w-8 rounded-full border-4 border-emerald-300 animate-spin" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-500">This demo simulates model inference. Replace simulation with backend call at <code className="text-xs bg-slate-100 px-1 rounded">/api/classify</code>.</div>
              </div>
            </section>
          )}

          {step === 3 && result && resultSensors && (
            <section aria-labelledby="step-3" ref={resultsPanelRef}>
              <h2 id="step-3" className="text-lg font-semibold">Step 3 — Results</h2>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded shadow p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{result.herbName}</h3>
                    <div className="text-sm text-slate-500">Sample ID: {selected?.sampleID}</div>
                    <div className="mt-3 flex gap-3 items-center">
                      <div className="text-sm">Purity</div>
                      <div style={{ width: 120 }}>
                        <GaugeChart
                          id="purity-gauge"
                          nrOfLevels={6}
                          percent={Math.max(0, Math.min(1, result.purityPercent / 100))}
                          textColor="#111827"
                          formatTextValue={(v) => `${result.purityPercent.toFixed(1)}%`}
                          animate={false}
                        />
                      </div>

                      <div className="ml-3">
                        <div className={`text-sm font-medium ${result.adulterationFlag ? "text-red-600" : "text-green-600"}`}>
                          {result.adulterationFlag ? "ADULTERATION DETECTED" : "PASS"}
                        </div>
                        <div className="text-xs text-slate-500">Confidence: {(result.confidence * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <strong>Recommendation:</strong> {result.recommendation}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={handleDownloadPDF} className="px-3 py-1 bg-blue-600 text-white rounded mr-2">Download Report (PDF)</button>
                      <button onClick={() => { alert("Saved to history (demo)"); }} className="px-3 py-1 bg-slate-100 rounded">Save to history</button>
                    </div>
                  </div>

                  <div className="w-full md:w-64 p-3 bg-slate-50 rounded">
                    <div className="text-sm text-slate-600">Taste profile (Rasa)</div>
                    <div className="mt-2 space-x-2">
                      {result.tasteProfile.map((t) => (
                        <span key={t} className="inline-block px-2 py-1 bg-white rounded border text-xs">{t}</span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-slate-500">Model: {modelVersion}</div>
                  </div>
                </div>

                <div>
                  <div className="border-b">
                    <nav className="-mb-px flex gap-2" aria-label="Results tabs">
                      <button className="px-3 py-2 border-b-2 border-blue-600 text-blue-600">Visuals</button>
                      <button className="px-3 py-2 border-b-2 border-transparent text-slate-600">Explainability</button>
                      <button className="px-3 py-2 border-b-2 border-transparent text-slate-600">Raw Data</button>
                    </nav>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-4 bg-white p-3 rounded shadow-sm">
                        <h4 className="text-sm font-medium">Radar fingerprint</h4>
                        <div className="mt-2 h-64">
                          <Plot
                            data={[
                              {
                                type: "scatterpolar",
                                r: getRadarTrace(resultSensors).values,
                                theta: getRadarTrace(resultSensors).labels,
                                fill: "toself",
                                name: "Sample",
                              },
                            ]}
                            layout={{
                              margin: { t: 10, l: 10, r: 10, b: 10 },
                              polar: { radialaxis: { visible: true, range: [0, 1] } },
                              showlegend: false,
                            }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="text-sm font-medium">Voltammogram (Voltage vs Current)</h4>
                        <div className="mt-2 h-44">
                          <Plot
                            data={[
                              {
                                x: resultSensors.voltammetry.map((_, i) => i),
                                y: resultSensors.voltammetry,
                                mode: "lines+markers",
                                name: "Voltammogram",
                                line: { color: "#2563eb" },
                              },
                            ]}
                            layout={{
                              margin: { t: 20, l: 40, r: 20, b: 40 },
                              xaxis: { title: "Voltage (mV)" },
                              yaxis: { title: "Current (mA)" },
                              showlegend: false,
                            }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <ExplainabilityCard shap={demoShap} summary={result.adulterationFlag ? "SHAP analysis shows RF resonator shift and elevated conductivity were the top contributors to the adulteration prediction, consistent with presence of added salts or moisture." : "SHAP highlights normal RF signature and voltammetry peaks matching authenticated reference."} />

                      <div className="mt-4 bg-white p-3 rounded shadow-sm overflow-auto max-h-64">
                        <h4 className="text-sm font-medium mb-2">Raw sensor data</h4>
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {JSON.stringify(resultSensors, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
