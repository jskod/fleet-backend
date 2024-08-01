import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema()
export class Maintenance {
  @Prop({ required: true })
  vehicleId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  cost: number;

  @Prop()
  performedBy: string;

  @Prop()
  partsReplaced: string[];

  @Prop()
  mileageAtService: number;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
