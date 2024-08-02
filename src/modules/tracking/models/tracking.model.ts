import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TrackingDocument = HydratedDocument<Tracking>;

@Schema()
class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  altitude: number; // in meters

  @Prop({ required: true })
  heading: number; // in degrees

  @Prop({ required: true })
  speed: number; // in km/h
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema()
class TirePressure {
  @Prop({ required: true })
  frontLeft: number; // in psi

  @Prop({ required: true })
  frontRight: number; // in psi

  @Prop({ required: true })
  rearLeft: number; // in psi

  @Prop({ required: true })
  rearRight: number; // in psi
}

const TirePressureSchema = SchemaFactory.createForClass(TirePressure);

@Schema()
class VehicleStatus {
  @Prop({ required: true })
  engineRunning: boolean;

  @Prop({ required: true })
  fuelLevel: number; // in percentage

  @Prop({ required: true })
  batteryVoltage: number; // in volts

  @Prop({ required: true })
  odometer: number; // in kilometers

  @Prop({ required: true, type: TirePressureSchema })
  tirePressure: TirePressure;
}

const VehicleStatusSchema = SchemaFactory.createForClass(VehicleStatus);

@Schema()
class Alert {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  value: number; // in km/h

  @Prop({ required: true })
  threshold: number; // in km/h

  @Prop({ required: true })
  timestamp: string; // ISO date string
}

const AlertSchema = SchemaFactory.createForClass(Alert);

@Schema()
export class Tracking {
  @Prop({ required: true })
  vehicleId: string;

  @Prop({ default: Date.now })
  timestamp: string;

  @Prop({ required: true, type: LocationSchema })
  location: Location;

  @Prop({ required: true, type: VehicleStatusSchema })
  vehicleStatus: VehicleStatus;

  @Prop({ required: true, type: [AlertSchema] })
  alerts: Types.Array<Alert>;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
