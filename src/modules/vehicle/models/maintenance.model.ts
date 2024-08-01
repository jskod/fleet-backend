import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MaintenanceDocument = HydratedDocument<Maintenance>;

@Schema()
export class Maintenance {
  @Prop({ required: true })
  vehicleId: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
