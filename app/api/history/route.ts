import { NextRequest, NextResponse } from 'next/server';
import { samples_db } from '../../../lib/data';

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

interface HistoryResponse {
  sampleID: string;
  herbName: string;
  testedOn: string;
  purityPercent: number;
  adulterationFlag: boolean;
  confidenceScore: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sampleID = searchParams.get('sampleID');

  const results: HistoryResponse[] = [];

  for (const sample of samples_db) {
    if (sampleID === null || sample.sampleID === sampleID) {
      results.push({
        sampleID: sample.sampleID,
        herbName: "Tulsi",
        testedOn: sample.timestamp,
        purityPercent: 92.5,
        adulterationFlag: false,
        confidenceScore: 0.87,
      });
    }
  }

  if (sampleID && results.length === 0) {
    return NextResponse.json({ error: 'No history found for the given sampleID' }, { status: 404 });
  }

  return NextResponse.json(results);
}
