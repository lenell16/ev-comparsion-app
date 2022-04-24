export interface Car {
  name: string;
  year: number;
  make: string;
  model: string;
  series: string;
  style: string;
  covered: boolean;
  fuelType: string;
  classification: string;
  mpge: number;
  mpkwh: number;
  mpg: number;
  totalRange: number;
  capacity: number;
}

export interface Trip {
  name: string;
  year: number;
  make: string;
  model: string;
  series: string;
  style: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export async function getInputs(): Promise<Car[]> {
  return fetch('http://localhost:4000/inputs').then((res) => res.json());
}

export async function getTrips(): Promise<Trip[]> {
  return fetch('http://localhost:4000/trips').then((res) => res.json());
}
