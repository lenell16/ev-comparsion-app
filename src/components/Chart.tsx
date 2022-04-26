import * as R from 'ramda';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from 'victory';

import { USDshort } from '../lib/utils';
import {
  calcTrip,
  calcSavingsData,
  calcMaxValue,
  Comparison,
  Fuel,
} from '../lib/calcTrip';
import { Car, Trip } from '../lib/api';

interface Props {
  car: Car;
  trip: Trip;
  inputs: Car[];
  tripName: string;
  showSavings: boolean;
  comparison: Comparison;
  carFuel: Fuel;
}

function getYAxisLabel(comparison: string, savings: boolean) {
  if (comparison === 'cost') {
    if (savings) {
      return 'Trip Cost Savings (dollars)';
    }
    return 'Trip Cost (dollars)';
  }
  if (savings) {
    return 'Trip Emmission Savings (lbs CO2)';
  }
  return 'Trip Emmission (lbs CO2)';
}

function Chart({
  trip,
  car,
  inputs,
  tripName,
  showSavings,
  comparison,
  carFuel,
}: Props) {
  const audiQ7 = R.find(R.propEq('fuelType', 'Gasoline'))(inputs) as Car;
  console.log(inputs);
  const audiData = calcTrip({
    fuel: 'gas',
    trip,
    car: audiQ7,
    comparison,
  });
  const carData = calcTrip({
    fuel: carFuel,
    trip,
    car,
    comparison,
  });

  console.log(carData);

  const savingsData = calcSavingsData(audiData, carData);

  const maxValue = Math.max(calcMaxValue(audiData), calcMaxValue(carData));

  return (
    <VictoryChart domainPadding={{ x: 20 }} maxDomain={{ y: maxValue }}>
      <VictoryAxis
        label="Months"
        style={{
          axisLabel: { fontSize: 13, padding: 30, fontStyle: 'italic' },
          tickLabels: { fontSize: 13 },
        }}
      />
      <VictoryAxis
        style={{
          axisLabel: { fontSize: 13, padding: 39, fontStyle: 'italic' },
          tickLabels: { fontSize: 13 },
        }}
        label={getYAxisLabel(comparison, showSavings)}
        dependentAxis
        tickCount={10}
        tickFormat={(t) => (comparison === 'cost' ? USDshort.format(t) : t)}
      />
      {showSavings ? (
        <VictoryBar data={savingsData} x="month" y="value" />
      ) : (
        <VictoryGroup offset={10} colorScale={'qualitative'}>
          <VictoryBar data={audiData} x="month" y="value" />
          <VictoryBar data={carData} x="month" y="value" />
        </VictoryGroup>
      )}
    </VictoryChart>
  );
}

export default Chart;
