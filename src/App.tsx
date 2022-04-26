import { useQuery } from 'react-query';
import { Car, getInputs, getTrips, Trip } from './lib/api';
import { useState } from 'react';
import Chart from './components/Chart';
import * as R from 'ramda';
import { Comparison, Fuel } from './lib/calcTrip';

function App() {
  const inputsQuery = useQuery<Car[], string>('inputs', getInputs);
  const tripsQuery = useQuery<Trip[], string>('trips', getTrips);
  const [selectedTripName, setSelectedTripName] = useState('');
  const [comparison, setComparsion] = useState<Comparison>('cost');
  const [showSavings, setShowSavings] = useState(false);
  const [fuelType, setFuelType] = useState<Fuel>('electricity');
  const [selecetedCar, setSelectedCar] = useState<Car | null>(null);
  const [selecetedTrip, setSelectedTrip] = useState<Car | null>(null);

  function handleChange(event: { target: { value: string } }) {
    const newSelectedCarName = event.target.value;
    const car = R.find(R.propEq('name', newSelectedCarName))(
      inputsQuery.data
    ) as Car;
    const trip = R.find(R.propEq('name', newSelectedCarName))(
      tripsQuery.data
    ) as Trip;
    setSelectedTripName(newSelectedCarName);
    setSelectedCar(car);
    setSelectedTrip(trip);
    if (car.classification === 'EV') {
      setFuelType('electricity');
    }
    if (!car.classification && car.fuelType === 'Gasoline') {
      setFuelType('gas');
    }
  }

  function handleComparisonChange(event: { target: { value: string } }) {
    setComparsion(event.target.value as Comparison);
  }
  function handleSavingsChange() {
    setShowSavings(!showSavings);
  }
  function handlefuelTypeChange(event: { target: { value: string } }) {
    setFuelType(event.target.value as Fuel);
  }

  if (inputsQuery.isLoading && tripsQuery.isLoading) {
    return <span>Loading...</span>;
  }

  if (inputsQuery.isError || tripsQuery.isError) {
    return <span>Error</span>;
  }

  if (inputsQuery.data === undefined || tripsQuery.data === undefined) {
    return <span>No data</span>;
  }

  return (
    <div className="w-screen h-screen p-2 grid grid-rows-[auto_1fr]">
      <select
        value={selectedTripName}
        name="trips"
        id="trips-select"
        onChange={handleChange}
        className="form-select px-4 py-3 rounded"
      >
        <option value="">--Please choose a trip--</option>

        {tripsQuery?.data?.map((trip, index) => (
          <option key={trip.name} value={trip.name}>
            {trip.name}
          </option>
        ))}
      </select>
      <div className="grid grid-rows-[1fr_auto]">
        {selecetedCar && selecetedTrip ? (
          <>
            <Chart
              trip={selecetedTrip}
              car={selecetedCar}
              inputs={inputsQuery.data}
              tripName={selectedTripName}
              comparison={comparison}
              showSavings={showSavings}
              carFuel={fuelType}
            />
            <div className="inline-flex gap-4">
              <label className="grow block">
                <span className="text-gray-700">Comparison Type</span>
                <select
                  value={comparison}
                  name="comparison"
                  id="comparison-select"
                  onChange={handleComparisonChange}
                  className="form-select px-4 py-3 rounded mt-1 block w-full"
                >
                  <option value="cost">Cost</option>
                  <option value="emissions">Emissions</option>
                </select>
              </label>
              {selecetedCar?.classification === 'PHEV' ? (
                <label className="grow block">
                  <span className="text-gray-700">Plugin Hybrid Fuel Type</span>
                  <select
                    value={fuelType}
                    name="fuel"
                    id="fuel-select"
                    onChange={handlefuelTypeChange}
                    className="form-select px-4 py-3 rounded mt-1 block w-full"
                  >
                    <option value="electricity">Electricity</option>
                    <option value="gas">Gas</option>
                  </select>
                </label>
              ) : null}
              <label className="flex flex-col items-center">
                <span className="text-gray-700">Show Savings</span>
                <input
                  type="checkbox"
                  name="savings"
                  defaultChecked={showSavings}
                  onChange={handleSavingsChange}
                  className="form-checkbox rounded w-8 h-8 mt-3 block"
                />
              </label>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
