const express = require('express');
const read = require('read-file');
const { parse } = require('csv-parse/sync');
const cors = require('cors');
const R = require('ramda');

const app = express();
const port = 4000;

const getCarName = R.pipe(
  R.props(['year', 'model', 'make', 'series', 'style']),
  R.join(' ')
);

const inputsFile = read.sync('./server/inputs.csv', 'utf8');
let inputs = parse(inputsFile, {
  columns: true,
  skip_empty_lines: true,
});

inputs = inputs
  .map((car) => ({
    year: Number(car.Year),
    make: car.Make,
    model: car.Model,
    series: car.Series,
    style: car.Style,
    covered: Boolean(car['Covered?']),
    fuelType: car['Fuel Type'],
    classification: car.Classification,
    mpge: Number(car['MPGe (Note that this is electric mpge for PHEVs)']),
    mpkwh: Number(car['Miles per kWh']),
    mpg: Number(car['Miles per gallon']),
    totalRange: Number(car['Total Range']),
    capacity: Number(car['Capacity (kWh)']),
  }))
  .map((car) => ({ name: getCarName(car), ...car }));

const tripsFile = read.sync('./server/trips.csv', 'utf8');
let trips = parse(tripsFile, {
  columns: true,
  skip_empty_lines: true,
});
trips = trips
  .map((trip) =>
    Object.fromEntries(
      Object.entries(trip).map(([key, value]) => [
        key.toLowerCase(),
        isNaN(Number(value)) ? value : Number(value),
      ])
    )
  )
  .map((trip) => ({ name: getCarName(trip), ...trip }));

app.use(cors());

app.get('/inputs', (req, res) => {
  res.json(inputs);
});

app.get('/trips', (req, res) => {
  res.json(trips);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
