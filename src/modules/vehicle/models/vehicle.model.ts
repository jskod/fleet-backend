import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  vin: string;

  @Prop({ required: true })
  @ApiProperty()
  model: string;

  @Prop({ type: String, enum: VehicleType, required: true })
  @ApiProperty({ enum: VehicleType })
  type: string;

  @Prop({ default: VehicleStatus.Active })
  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;

  @Prop({ default: Date.now })
  @ApiProperty()
  createdAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
