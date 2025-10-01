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

export let samples_db: Sample[] = [];
