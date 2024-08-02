import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TrackingDocument = HydratedDocument<Tracking>;

@Schema()
class Location {
  @Prop({ required: true })
  @ApiProperty()
  latitude: number;

  @Prop({ required: true })
  @ApiProperty()
  longitude: number;

  @Prop({ required: true })
  @ApiProperty()
  altitude: number; // in meters

  @Prop({ required: true })
  @ApiProperty()
  heading: number; // in degrees

  @Prop({ required: true })
  @ApiProperty()
  speed: number; // in km/h
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema()
class TirePressure {
  @Prop({ required: true })
  @ApiProperty()
  frontLeft: number; // in psi

  @Prop({ required: true })
  @ApiProperty()
  frontRight: number; // in psi

  @Prop({ required: true })
  @ApiProperty()
  rearLeft: number; // in psi

  @Prop({ required: true })
  @ApiProperty()
  rearRight: number; // in psi
}

const TirePressureSchema = SchemaFactory.createForClass(TirePressure);

@Schema()
class VehicleStatus {
  @Prop({ required: true })
  @ApiProperty()
  engineRunning: boolean;

  @Prop({ required: true })
  @ApiProperty()
  fuelLevel: number; // in percentage

  @Prop({ required: true })
  @ApiProperty()
  batteryVoltage: number; // in volts

  @Prop({ required: true })
  @ApiProperty()
  odometer: number; // in kilometers

  @Prop({ required: true, type: TirePressureSchema })
  @ApiProperty()
  tirePressure: TirePressure;
}

const VehicleStatusSchema = SchemaFactory.createForClass(VehicleStatus);

@Schema()
class Alert {
  @Prop({ required: true })
  @ApiProperty()
  type: string;

  @Prop({ required: true })
  @ApiProperty()
  value: number; // in km/h

  @Prop({ required: true })
  @ApiProperty()
  threshold: number; // in km/h

  @Prop({ required: true })
  @ApiProperty()
  timestamp: string; // ISO date string
}

const AlertSchema = SchemaFactory.createForClass(Alert);

@Schema()
export class Tracking {
  @Prop({ required: true })
  @ApiProperty()
  vehicleId: string;

  @Prop({ default: Date.now })
  @ApiProperty()
  timestamp: string;

  @Prop({ required: true, type: LocationSchema })
  @ApiProperty()
  location: Location;

  @Prop({ required: true, type: VehicleStatusSchema })
  @ApiProperty()
  vehicleStatus: VehicleStatus;

  @Prop({ required: true, type: [AlertSchema] })
  @ApiProperty({ type: [Alert] })
  alerts: Types.Array<Alert>;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
