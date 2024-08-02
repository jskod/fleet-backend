export const TrackingQueue = 'create-tracking';

type Location = {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
};

type TirePressure = {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
};

type VehicleStatus = {
  engineRunning: boolean;
  fuelLevel: number;
  batteryVoltage: number;
  odometer: number;
  tirePressure: TirePressure;
};

type Alert = {
  type: string;
  value: number;
  threshold: number;
  timestamp: string;
};

export type CreateTrackingQueueDataType = {
  vehicleId: string;
  timestamp: string;
  location: Location;
  vehicleStatus: VehicleStatus;
  alerts: Alert[];
};
