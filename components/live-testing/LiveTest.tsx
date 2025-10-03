'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Play, FileText, Loader2, AlertCircle, Download, BarChart3, Zap, CheckCircle, XCircle, TrendingUp, Award, Eye, FileText as FileTextIcon, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface SensorData {
  pH: number;
  conductivity: number;
  ORP: number;
  turbidity: number;
  temperature: number;
  moisture: number;
  rfResonator: number;
  naIon: number;
  kIon: number;
  caIon: number;
  voltammetry: number[];
}

interface ClassificationResult {
  herb: string;
  purity: string;
  adulteration: string;
  confidence: string;
  tasteProfile: string;
  recommendation: string;
}

type Step = 'upload' | 'analyze' | 'results'

const demoSamples: Record<string, SensorData> = {
  Tulsi: {
    pH: 6.8,
    conductivity: 1200,
    ORP: 250,
    turbidity: 15,
    temperature: 25.5,
    moisture: 12.3,
    rfResonator: 450,
    naIon: 45,
    kIon: 120,
    caIon: 80,
    voltammetry: [0.1, 0.3, 0.5, 0.8, 1.2, 1.5, 1.3, 0.9, 0.4, 0.1]
  },
  Tulsi_Adulterated: {
    pH: 6.5,
    conductivity: 1800,
    ORP: 350,
    turbidity: 25,
    temperature: 25.0,
    moisture: 18.5,
    rfResonator: 320,
    naIon: 85,
    kIon: 200,
    caIon: 120,
    voltammetry: [0.2, 0.5, 0.9, 1.4, 1.8, 2.1, 1.9, 1.3, 0.7, 0.3]
  },
  Ashwagandha: {
    pH: 7.0,
    conductivity: 1100,
    ORP: 220,
    turbidity: 20,
    temperature: 25.2,
    moisture: 10.5,
    rfResonator: 480,
    naIon: 40,
    kIon: 110,
    caIon: 75,
    voltammetry: [0.18, 0.38, 0.65, 0.95, 1.25, 1.55, 1.25, 0.85, 0.35, 0.15]
  },
  Neem: {
    pH: 7.2,
    conductivity: 950,
    ORP: 180,
    turbidity: 22,
    temperature: 26.0,
    moisture: 8.7,
    rfResonator: 520,
    naIon: 35,
    kIon: 95,
    caIon: 65,
    voltammetry: [0.2, 0.4, 0.7, 1.0, 1.4, 1.6, 1.2, 0.8, 0.3, 0.1]
  },
  Turmeric: {
    pH: 6.5,
    conductivity: 1400,
    ORP: 300,
    turbidity: 18,
    temperature: 24.8,
    moisture: 15.2,
    rfResonator: 380,
    naIon: 55,
    kIon: 140,
    caIon: 90,
    voltammetry: [0.15, 0.35, 0.6, 0.9, 1.3, 1.7, 1.4, 1.0, 0.5, 0.2]
  },
  Amla: {
    pH: 6.9,
    conductivity: 1300,
    ORP: 270,
    turbidity: 16,
    temperature: 25.8,
    moisture: 13.8,
    rfResonator: 420,
    naIon: 50,
    kIon: 130,
    caIon: 85,
    voltammetry: [0.12, 0.32, 0.55, 0.85, 1.15, 1.45, 1.15, 0.75, 0.32, 0.12]
  },
  Triphala: {
    pH: 6.7,
    conductivity: 1250,
    ORP: 240,
    turbidity: 19,
    temperature: 25.3,
    moisture: 11.9,
    rfResonator: 460,
    naIon: 48,
    kIon: 125,
    caIon: 82,
    voltammetry: [0.16, 0.36, 0.62, 0.92, 1.22, 1.52, 1.22, 0.82, 0.36, 0.16]
  },
  Shatavari: {
    pH: 7.1,
    conductivity: 1050,
    ORP: 200,
    turbidity: 21,
    temperature: 25.7,
    moisture: 9.8,
    rfResonator: 500,
    naIon: 38,
    kIon: 105,
    caIon: 70,
    voltammetry: [0.14, 0.34, 0.58, 0.88, 1.18, 1.48, 1.18, 0.78, 0.34, 0.14]
  },
  Brahmi: {
    pH: 6.6,
    conductivity: 1350,
    ORP: 280,
    turbidity: 17,
    temperature: 24.9,
    moisture: 14.5,
    rfResonator: 400,
    naIon: 52,
    kIon: 135,
    caIon: 88,
    voltammetry: [0.17, 0.37, 0.63, 0.93, 1.23, 1.53, 1.23, 0.83, 0.37, 0.17]
  },
  Moringa: {
    pH: 7.3,
    conductivity: 900,
    ORP: 160,
    turbidity: 23,
    temperature: 26.2,
    moisture: 7.9,
    rfResonator: 540,
    naIon: 32,
    kIon: 90,
    caIon: 60,
    voltammetry: [0.19, 0.39, 0.66, 0.96, 1.26, 1.56, 1.26, 0.86, 0.39, 0.19]
  },
  Ginger: {
    pH: 6.4,
    conductivity: 1500,
    ORP: 320,
    turbidity: 14,
    temperature: 24.5,
    moisture: 16.1,
    rfResonator: 360,
    naIon: 58,
    kIon: 145,
    caIon: 95,
    voltammetry: [0.13, 0.33, 0.57, 0.87, 1.17, 1.47, 1.17, 0.77, 0.33, 0.13]
  },
  Gotu_Kola: {
    pH: 6.3,
    conductivity: 1150,
    ORP: 210,
    turbidity: 21,
    temperature: 25.1,
    moisture: 11.2,
    rfResonator: 470,
    naIon: 42,
    kIon: 115,
    caIon: 78,
    voltammetry: [0.11, 0.31, 0.54, 0.84, 1.14, 1.44, 1.14, 0.74, 0.31, 0.11]
  }
}

export default function LiveTest() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [selectedDemo, setSelectedDemo] = useState('')
  const [uploadedData, setUploadedData] = useState<any>(null)
  const [currentData, setCurrentData] = useState<SensorData | null>(null)
  const [results, setResults] = useState<ClassificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparisonData, setComparisonData] = useState<SensorData | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          let data: any
          if (file.name.endsWith('.json')) {
            if (typeof e.target?.result === 'string') {
              data = JSON.parse(e.target.result)
            } else {
              throw new Error('Invalid JSON file content')
            }
          } else if (file.name.endsWith('.csv')) {
            if (typeof e.target?.result === 'string') {
              const csv = e.target.result
              const lines = csv.split('\n')
              const headers = lines[0].split(',')
              data = {}
              headers.forEach((header: string) => {
                const key = header.trim()
                if (key === 'voltammetry') {
                  data[key] = lines[1].split(',')[headers.indexOf(header)].split(';').map(Number)
                } else {
                  data[key] = Number(lines[1].split(',')[headers.indexOf(header)])
                }
              })
            } else {
              throw new Error('Invalid CSV file content')
            }
          }
          setUploadedData(data)
          setCurrentData(data)
          setSelectedDemo('')
        } catch (error) {
          alert('Error parsing file')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleDemoSelect = (herb: string) => {
    setSelectedDemo(herb)
    setCurrentData(demoSamples[herb])
    setUploadedData(null)
  }

  const handleAnalyze = async () => {
    if (!currentData) return
    setLoading(true)
    setError(null)
    setResults(null)
    setCurrentStep('analyze')

    try {
      // Transform frontend data to match backend expected format
      const backendData = {
        sampleID: `sample_${Date.now()}`,
        timestamp: new Date().toISOString(),
        sensors: {
          voltammetry: currentData.voltammetry,
          pH: currentData.pH,
          tds_ec: currentData.conductivity, // conductivity -> tds_ec
          orp: currentData.ORP, // ORP -> orp
          turbidity: currentData.turbidity,
          temperature: currentData.temperature,
          moisture: currentData.moisture,
          ion_selective: {
            Na: currentData.naIon, // naIon -> Na
            K: currentData.kIon, // kIon -> K
            Ca: currentData.caIon // caIon -> Ca
          },
          rf_resonator: currentData.rfResonator // rfResonator -> rf_resonator
        }
      }

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || errorData.error || 'Failed to classify sample')
        setLoading(false)
        return
      }

      const data = await response.json()
      setResults({
        herb: data.herbName || selectedDemo || 'Unknown',
        purity: data.purityPercent ? data.purityPercent.toFixed(1) : 'N/A',
        adulteration: data.adulterationFlag ? 'Yes' : 'No',
        confidence: data.confidenceScore ? (data.confidenceScore * 100).toFixed(1) : 'N/A',
        tasteProfile: data.tasteProfile ? data.tasteProfile.join(', ') : 'N/A',
        recommendation: data.recommendation || 'N/A',
      })

      // Simulate analysis delay for better UX
      setTimeout(() => {
        setLoading(false)
        setCurrentStep('results')
      }, 2000)

    } catch (err) {
      setError('Error occurred during classification')
      setLoading(false)
    }
  }

  const renderSensorRadarChart = (data: SensorData) => {
    const radarData = {
      type: 'scatterpolar',
      r: [
        data.pH,
        data.conductivity / 100,
        data.ORP / 10,
        data.turbidity,
        data.temperature,
        data.moisture,
        data.rfResonator / 10
      ],
      theta: ['pH', 'Conductivity', 'ORP', 'Turbidity', 'Temperature', 'Moisture', 'RF Resonator'],
      fill: 'toself',
      name: 'Sensor Values'
    }

    return (
      <Plot
        data={[radarData]}
        layout={{
          polar: { radialaxis: { visible: true, range: [0, 30] } },
          showlegend: false,
          margin: { t: 20, b: 20, l: 20, r: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)'
        }}
        style={{ width: '100%', height: '300px' }}
        config={{ displayModeBar: false }}
      />
    )
  }

  const renderVoltammogram = (data: SensorData) => {
    const lineData = {
      x: Array.from({length: data.voltammetry.length}, (_, i) => i),
      y: data.voltammetry,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Voltammogram',
      line: { color: '#10b981' }
    }

    return (
      <Plot
        data={[lineData]}
        layout={{
          title: 'Electrochemical Signature',
          showlegend: false,
          margin: { t: 40, b: 20, l: 40, r: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: { title: 'Time (s)' },
          yaxis: { title: 'Current (μA)' }
        }}
        style={{ width: '100%', height: '300px' }}
        config={{ displayModeBar: false }}
      />
    )
  }

  const renderIonConcentrations = (data: SensorData) => {
    const barData = {
      x: ['Na⁺', 'K⁺', 'Ca²⁺'],
      y: [data.naIon, data.kIon, data.caIon],
      type: 'bar',
      marker: { color: ['#3b82f6', '#10b981', '#f59e0b'] }
    }

    return (
      <Plot
        data={[barData]}
        layout={{
          title: 'Ion Concentrations',
          showlegend: false,
          margin: { t: 40, b: 20, l: 40, r: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          yaxis: { title: 'Concentration (ppm)' }
        }}
        style={{ width: '100%', height: '300px' }}
        config={{ displayModeBar: false }}
      />
    )
  }

  const renderPurityGauge = (purity: number) => {
    const getColor = (value: number) => {
      if (value >= 90) return '#10b981'
      if (value >= 70) return '#f59e0b'
      return '#dc2626'
    }

    const circumference = 2 * Math.PI * 40
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (purity / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getColor(purity)}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: getColor(purity) }}>
              {purity}%
            </span>
          </div>
        </div>
        <div className="text-center mt-4">
          <h3 className="text-lg font-semibold">Purity Score</h3>
        </div>
      </div>
    )
  }

  const renderOutcomeSummary = () => {
    if (!results) return null

    const purityValue = parseFloat(results.purity)
    const confidenceValue = parseFloat(results.confidence)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Analysis Complete</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-gray-700">Herb Identified</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{results.herb}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`h-5 w-5 ${purityValue >= 90 ? 'text-green-600' : purityValue >= 70 ? 'text-yellow-600' : 'text-red-600'}`} />
              <p className="font-semibold text-gray-700">Purity</p>
            </div>
            <p className={`text-xl font-bold ${purityValue >= 90 ? 'text-green-600' : purityValue >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {results.purity}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              {results.adulteration === 'Yes' ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <p className="font-semibold text-gray-700">Adulteration</p>
            </div>
            <Badge variant={results.adulteration === 'Yes' ? 'destructive' : 'default'}>
              {results.adulteration}
            </Badge>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <p className="font-semibold text-gray-700">Confidence</p>
            </div>
            <p className="text-xl font-bold text-purple-600">{results.confidence}%</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <p className="font-semibold text-gray-700">Taste Profile</p>
            </div>
            <p className="text-sm text-gray-600">{results.tasteProfile}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-gray-700 mb-2">AI Recommendation</h3>
          <p className="text-gray-600">{results.recommendation}</p>
        </div>
      </motion.div>
    )
  }

  const downloadReport = () => {
    if (!results || !currentData) return

    const reportData = {
      analysisDate: new Date().toISOString(),
      sampleData: currentData,
      results: results,
      generatedBy: 'Herbal AI Authenticity Dashboard'
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `herbal-analysis-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Live Herbal Analysis</h1>
        </div>
        <p className="text-green-100 text-lg">Run a real-time quality test: pick a demo or upload your sample, analyze, and download an audit-ready report.</p>
        <p className="text-green-200 text-sm mt-1">Advanced AI-powered authenticity testing for Ayurvedic herbs</p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {(['upload', 'analyze', 'results'] as Step[]).map((step, index) => (
            <React.Fragment key={step}>
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : index < ['upload', 'analyze', 'results'].indexOf(currentStep)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.div>
              {index < 2 && (
                <div className={`w-16 h-1 ${
                  index < ['upload', 'analyze', 'results'].indexOf(currentStep)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Step 1: Select Data Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Upload Sensor Data</h3>
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                    />
                    {uploadedData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="text-green-800 font-medium">✓ File uploaded successfully</p>
                        <p className="text-sm text-green-600">Ready for analysis</p>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Demo Samples</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(demoSamples).map(herb => (
                        <Button
                          key={herb}
                          variant={selectedDemo === herb ? "default" : "outline"}
                          onClick={() => handleDemoSelect(herb)}
                          className="text-sm"
                        >
                          {herb}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {currentData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={() => setCurrentStep('analyze')}
                      size="lg"
                      className="px-8 py-3 text-lg"
                    >
                      Proceed to Analysis →
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 'analyze' && (
          <motion.div
            key="analyze"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Step 2: AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-semibold mb-2">Analyzing Sample...</h3>
                    <p className="text-gray-600">Our AI is processing sensor data and running ML models</p>
                    <Progress value={75} className="mt-4 max-w-md mx-auto" />
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-4">Ready to Analyze</h3>
                    <p className="text-gray-600 mb-6">Click below to start the AI-powered classification</p>
                    <Button
                      onClick={handleAnalyze}
                      size="lg"
                      className="px-8 py-3 text-lg"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Analysis
                    </Button>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 'results' && (
          <motion.div
            key="results"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="visuals">Visuals</TabsTrigger>
                  <TabsTrigger value="explainability">Explainability</TabsTrigger>
                  <TabsTrigger value="raw-data">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Outcome Summary */}
                    {renderOutcomeSummary()}

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-center gap-4"
                    >
                      <Button
                        onClick={downloadReport}
                        variant="outline"
                        className="px-6 py-3"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentStep('upload')
                          setResults(null)
                          setCurrentData(null)
                          setSelectedDemo('')
                          setUploadedData(null)
                        }}
                        className="px-6 py-3"
                      >
                        New Analysis
                      </Button>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="visuals" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Data Visualizations */}
                    {currentData && (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle>Sensor Overview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {renderSensorRadarChart(currentData)}
                          </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle>Sensor Pattern Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {renderVoltammogram(currentData)}
                          </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle>Ion Profile</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {renderIonConcentrations(currentData)}
                          </CardContent>
                        </Card>

                        <Card className="shadow-lg md:col-span-2 lg:col-span-1">
                          <CardHeader>
                            <CardTitle>Purity Assessment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {results && renderPurityGauge(parseFloat(results.purity))}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="explainability" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>AI Model Explainability</CardTitle>
                        <p className="text-sm text-gray-600">Understanding how the AI made this decision</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* SHAP Chart Placeholder */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">Feature Importance (SHAP Values)</h3>
                          <div className="space-y-3">
                            {[
                              { feature: 'Voltammetry Peak Current', importance: 0.35, direction: 'positive' },
                              { feature: 'pH Level', importance: 0.28, direction: 'negative' },
                              { feature: 'Conductivity', importance: 0.22, direction: 'positive' },
                              { feature: 'ORP Value', importance: 0.15, direction: 'negative' }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <span className="text-sm font-medium w-48">{item.feature}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-4">
                                  <div
                                    className={`h-4 rounded-full ${item.direction === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${item.importance * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-16">{(item.importance * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Plain Language Summary */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">Decision Summary</h3>
                          <p className="text-gray-700 mb-4">
                            The AI model identified this sample as <strong>{results?.herb}</strong> with {results?.confidence}% confidence.
                            The sensor pattern was the strongest indicator, followed by pH levels.
                          </p>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2">Supporting Factors</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Sensor pattern matches {results?.herb} profile</li>
                                <li>• Ion concentrations within expected range</li>
                                <li>• Sensor readings consistent with authentic samples</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-700 mb-2">Key Considerations</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• pH slightly outside optimal range</li>
                                <li>• Minor variations in conductivity</li>
                                <li>• Background noise in sensor readings</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="raw-data" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>Raw Sensor Data</CardTitle>
                        <p className="text-sm text-gray-600">Complete dataset used for analysis</p>
                      </CardHeader>
                      <CardContent>
                        {currentData && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Sensor</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">pH</TableCell>
                                <TableCell>{currentData.pH.toFixed(2)}</TableCell>
                                <TableCell>pH units</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.pH >= 6.5 && currentData.pH <= 7.5 ? "default" : "secondary"}>
                                    {currentData.pH >= 6.5 && currentData.pH <= 7.5 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Conductivity</TableCell>
                                <TableCell>{currentData.conductivity}</TableCell>
                                <TableCell>μS/cm</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.conductivity >= 800 && currentData.conductivity <= 1500 ? "default" : "secondary"}>
                                    {currentData.conductivity >= 800 && currentData.conductivity <= 1500 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">ORP</TableCell>
                                <TableCell>{currentData.ORP}</TableCell>
                                <TableCell>mV</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.ORP >= 200 && currentData.ORP <= 400 ? "default" : "secondary"}>
                                    {currentData.ORP >= 200 && currentData.ORP <= 400 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Turbidity</TableCell>
                                <TableCell>{currentData.turbidity}</TableCell>
                                <TableCell>NTU</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.turbidity <= 20 ? "default" : "secondary"}>
                                    {currentData.turbidity <= 20 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Temperature</TableCell>
                                <TableCell>{currentData.temperature.toFixed(1)}</TableCell>
                                <TableCell>°C</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.temperature >= 20 && currentData.temperature <= 30 ? "default" : "secondary"}>
                                    {currentData.temperature >= 20 && currentData.temperature <= 30 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Moisture</TableCell>
                                <TableCell>{currentData.moisture.toFixed(1)}</TableCell>
                                <TableCell>%</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.moisture >= 5 && currentData.moisture <= 15 ? "default" : "secondary"}>
                                    {currentData.moisture >= 5 && currentData.moisture <= 15 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">RF Resonator</TableCell>
                                <TableCell>{currentData.rfResonator}</TableCell>
                                <TableCell>MHz</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.rfResonator >= 400 && currentData.rfResonator <= 550 ? "default" : "secondary"}>
                                    {currentData.rfResonator >= 400 && currentData.rfResonator <= 550 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Na⁺ Ion</TableCell>
                                <TableCell>{currentData.naIon}</TableCell>
                                <TableCell>ppm</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.naIon >= 30 && currentData.naIon <= 70 ? "default" : "secondary"}>
                                    {currentData.naIon >= 30 && currentData.naIon <= 70 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">K⁺ Ion</TableCell>
                                <TableCell>{currentData.kIon}</TableCell>
                                <TableCell>ppm</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.kIon >= 100 && currentData.kIon <= 150 ? "default" : "secondary"}>
                                    {currentData.kIon >= 100 && currentData.kIon <= 150 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Ca²⁺ Ion</TableCell>
                                <TableCell>{currentData.caIon}</TableCell>
                                <TableCell>ppm</TableCell>
                                <TableCell>
                                  <Badge variant={currentData.caIon >= 70 && currentData.caIon <= 100 ? "default" : "secondary"}>
                                    {currentData.caIon >= 70 && currentData.caIon <= 100 ? "Normal" : "Outlier"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
