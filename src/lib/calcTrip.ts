import { COST, EMISSIONS, MONTHS } from './constants';
import { Car, Trip } from './api';
import * as R from 'ramda';

export type Comparison = 'cost' | 'emissions';

export type Fuel = 'gas' | 'electricity';

interface CalcTripInput {
  trip: Trip;
  car: Car;
  fuel: Fuel;
  comparison: Comparison;
}

interface CalcTripMonthInput extends CalcTripInput {
  month: typeof MONTHS[number];
}

interface CalcTripReturn {
  month: typeof MONTHS[number];
  name: string;
  value: number;
}

function calcTripMonth({
  fuel,
  month,
  trip,
  car,
  comparison,
}: CalcTripMonthInput): number {
  const fuelEconmy = fuel === 'gas' ? 'mpg' : 'mpkwh';
  if (comparison === 'cost') {
    return (trip[month] / car[fuelEconmy]) * COST[fuel];
  } else {
    return (trip[month] / car[fuelEconmy]) * EMISSIONS[fuel];
  }
}

export function calcTrip({
  fuel,
  trip,
  car,
  comparison,
}: CalcTripInput): CalcTripReturn[] {
  let carName = car.name;
  if (car.fuelType === 'PHEV') {
    if (fuel === 'gas') {
      carName = `${carName} (Gas Only)`;
    } else {
      carName = `${carName} (Electricity Only)`;
    }
  }
  return MONTHS.map((month) => ({
    name: carName,
    month,
    value: calcTripMonth({ fuel, month, trip, car, comparison }),
  }));
}

export function calcSavingsData(
  gasCarData: CalcTripReturn[],
  otherCarData: CalcTripReturn[]
): CalcTripReturn[] {
  const zipped = R.zip(gasCarData, otherCarData);
  return zipped.map(([gasCar, otherCar]) => ({
    name: otherCar.name,
    month: otherCar.month,
    value: gasCar.value - otherCar.value,
  }));
}

export function calcMaxValue(carData: CalcTripReturn[]): number {
  return R.pipe(R.map(R.prop('value')), (x: number[]) => Math.max(...x))(
    carData
  );
}
