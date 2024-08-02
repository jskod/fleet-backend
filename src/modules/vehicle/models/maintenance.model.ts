import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema()
export class Maintenance {
  @Prop({ required: true })
  @ApiProperty()
  vehicleId: Types.ObjectId;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop({ default: Date.now })
  @ApiProperty()
  date: Date;

  @Prop()
  @ApiProperty()
  cost: number;

  @Prop()
  @ApiProperty()
  performedBy: string;

  @Prop()
  @ApiProperty()
  partsReplaced: string[];

  @Prop()
  @ApiProperty()
  mileageAtService: number;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
