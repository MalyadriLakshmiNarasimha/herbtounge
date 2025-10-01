import { NextRequest, NextResponse } from 'next/server';

// Data models
interface IonSelective {
  Na: number;
  K: number;
  Ca: number;
}

interface SensorData {
  voltammetry: number[];
  pH: number;
  tds_ec: number;
  orp: number;
  turbidity: number;
  temperature: number;
  moisture: number;
  ion_selective: IonSelective;
  rf_resonator: number;
}

interface Sample {
  sampleID: string;
  timestamp: string;
  sensors: SensorData;
}

interface ClassificationResponse {
  herbName: string;
  purityPercent: number;
  adulterationFlag: boolean;
  confidenceScore: number;
  tasteProfile: string[];
  recommendation: string;
}

// In-memory storage for demo
let samples_db: Sample[] = [];

export async function POST(request: NextRequest) {
  try {
    const sample: Sample = await request.json();

    // Simulate ML model classification logic
    const purity = 90.0 + (sample.sensors.pH - 7) * 2; // simplistic example
    const clampedPurity = Math.max(0, Math.min(100, purity));
    const adulteration = clampedPurity < 85;
    const confidence = 0.8 + (clampedPurity / 100) * 0.2;
    const taste = adulteration ? ["bitter", "pungent"] : ["sweet", "mild"];
    const recommendation = adulteration ? "Use with caution" : "Safe for Ayurvedic use";

    // Save sample to in-memory DB
    samples_db.push(sample);

    const response: ClassificationResponse = {
      herbName: "Tulsi",
      purityPercent: clampedPurity,
      adulterationFlag: adulteration,
      confidenceScore: confidence,
      tasteProfile: taste,
      recommendation,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
