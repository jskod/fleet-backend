/**
 * This file will be used by mongodb init runner to seed the data at the time of container creation.
 */

const vehicleIds = [
  '66accde6b4c0e66659b93999',
  '66accde6b4c0e66659b93998',
  '66accde6b4c0e66659b9399b',
  '66accde6b4c0e66659b9399a',
  '66accde6b4c0e66659b9399c',
  '66accde6b4c0e66659b9399d',
  '66accde6b4c0e66659b9399e',
  '66accde6b4c0e66659b9399f',
  '66accde6b4c0e66659b939a0',
  '66accde6b4c0e66659b939a1',
];

db = db.getSiblingDB('fleet_db');

const vehicles = [];
for (let i = 0; i < 10; i++) {
  const types = [
    'excavator',
    'bulldozer',
    'dumptruck',
    'crane',
    'concretemixer',
  ];

  vehicles.push({
    _id: vehicleIds[i],
    vin: `VIN-${i}`,
    model: `Model ${i}`,
    type: types[i % 5],
    status: 'active',
  });
}

db.vehicles.insertMany(vehicles);
