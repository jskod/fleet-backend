import * as dotenv from 'dotenv';

dotenv.config();

const SIMULATION_INTERVAL =
  parseInt(process.env.APP_SIMULATION_INTERVAL) || 5000;
const NUMBER_OF_DEVICES = parseInt(process.env.NUMBER_OF_DEVICES) || 10;
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000/tracking';

// Following vehicleIds are used for db seeding
// keeping vehicleIds hardcoded for demo and simulate data
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

interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
}

interface TirePressure {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
}

interface VehicleStatus {
  engineRunning: boolean;
  fuelLevel: number;
  batteryVoltage: number;
  odometer: number;
  tirePressure: TirePressure;
}

interface Alert {
  type: string;
  value: number;
  threshold: number;
  timestamp: string;
}

interface DeviceData {
  vehicleId: string;
  timestamp: string;
  location: Location;
  vehicleStatus: VehicleStatus;
  alerts: Alert[];
}

const generateRandomLocation = (): Location => {
  return {
    latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
    altitude: 30.5 + (Math.random() - 0.5) * 5,
    heading: Math.random() * 360,
    speed: Math.random() * 100,
  };
};

const generateRandomTirePressure = (): TirePressure => {
  return {
    frontLeft: 30 + Math.random() * 5,
    frontRight: 30 + Math.random() * 5,
    rearLeft: 30 + Math.random() * 5,
    rearRight: 30 + Math.random() * 5,
  };
};

const generateVehicleStatus = (): VehicleStatus => {
  return {
    engineRunning: Math.random() > 0.5,
    fuelLevel: Math.random() * 100,
    batteryVoltage: 12 + Math.random(),
    odometer: 10000 + Math.random() * 5000,
    tirePressure: generateRandomTirePressure(),
  };
};

const generateAlerts = (): Alert[] => {
  if (Math.random() > 0.8) {
    return [
      {
        type: 'overspeed',
        value: 80 + Math.random() * 20,
        threshold: 75,
        timestamp: new Date().toISOString(),
      },
    ];
  }
  return [];
};

const generateDeviceData = (vehicleId: string): DeviceData => {
  return {
    vehicleId,
    timestamp: new Date().toISOString(),
    location: generateRandomLocation(),
    vehicleStatus: generateVehicleStatus(),
    alerts: generateAlerts(),
  };
};

const sendDeviceData = async (deviceData: DeviceData) => {
  try {
    console.log(deviceData);

    const response = await fetch(SERVER_URL, {
      body: JSON.stringify(deviceData),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `Data sent for device: ${deviceData.vehicleId}, status: ${response.status}`,
    );
  } catch (error) {
    console.error(
      `Error sending data for device: ${deviceData.vehicleId}`,
      error.message,
    );
  }
};

const simulateDataSendingForMultipleDevices = () => {
  setInterval(() => {
    for (let i = 0; i < NUMBER_OF_DEVICES; i++) {
      const data = generateDeviceData(vehicleIds[i]);
      sendDeviceData(data).catch((error) => {
        console.log(error);
      });
    }
  }, SIMULATION_INTERVAL);
};

simulateDataSendingForMultipleDevices();
