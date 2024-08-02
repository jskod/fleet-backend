import { Module } from '@nestjs/common';
import { Tracking, TrackingSchema } from './models/tracking.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { BullModule } from '@nestjs/bullmq';
import { TrackingQueue } from '../queues/tracking.queue';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
    BullModule.registerQueue({
      name: TrackingQueue,
      defaultJobOptions: {
        removeOnComplete: 100,
        backoff: { type: 'fixed', delay: 5000 },
        attempts: 3,
      },
    }),
  ],
  providers: [TrackingService],
  controllers: [TrackingController],
  exports: [TrackingService],
})
export class TrackingModule {}
