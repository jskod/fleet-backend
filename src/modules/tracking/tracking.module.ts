import { Module } from '@nestjs/common';
import { Tracking, TrackingSchema } from './models/tracking.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
  ],
  providers: [TrackingService],
  controllers: [TrackingController],
})
export class TrackingModule {}
