import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

export enum VehicleStatus {
  Active = 'active',
  Maintenance = 'maintenance',
}

export enum VehicleType {
  Excavator = 'excavator',
  Bulldozer = 'bulldozer',
  DumpTruck = 'dumptruck',
  Crane = 'crane',
  ConcreteMixer = 'concretemixer',
}

@Schema()
export class Vehicle {
  @Prop({ required: true, unique: true })
  vin: string;

  @Prop({ required: true })
  model: string;

  @Prop({ type: String, enum: VehicleType, required: true })
  type: string;

  @Prop({ default: VehicleStatus.Active })
  status: VehicleStatus;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
