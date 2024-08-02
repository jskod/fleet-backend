import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from './models/tracking.model';
import { Model } from 'mongoose';
import { CreateTrackingDto } from './dtos/create-tracking.dto';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CreateTrackingQueueDataType,
  TrackingQueue,
} from '../queues/tracking.queue';
import { Queue } from 'bullmq';

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<TrackingDocument>,
    @InjectQueue(TrackingQueue)
    private trackingQueue: Queue<CreateTrackingQueueDataType>,
  ) {}

  async insert(data: CreateTrackingDto) {
    const newTracking = new this.trackingModel(data);
    await newTracking.save();
  }

  async list(vehicleId: string) {
    return this.trackingModel.find({ vehicleId });
  }

  async insertWithQueue(data: CreateTrackingDto) {
    try {
      await this.trackingQueue.add('add-tracking', data);
    } catch (error) {
      console.error(error);
    }
  }
}
