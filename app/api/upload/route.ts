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

interface UploadResponse {
  status: string;
  uploadedSamples: number;
  invalidRows: number;
}

export async function POST(request: NextRequest) {
  try {
    const samples: Sample[] = await request.json();

    let valid_samples = 0;
    let invalid_rows = 0;

    for (const sample of samples) {
      // Basic validation
      if (sample.sampleID && sample.sensors) {
        samples_db.push(sample);
        valid_samples += 1;
      } else {
        invalid_rows += 1;
      }
    }

    const response: UploadResponse = {
      status: "success",
      uploadedSamples: valid_samples,
      invalidRows: invalid_rows,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
