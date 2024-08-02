import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from './models/tracking.model';
import { Model } from 'mongoose';
import { CreateTrackingDto } from './dtos/create-tracking.dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<TrackingDocument>,
  ) {}

  async insert(data: CreateTrackingDto) {
    const newTracking = new this.trackingModel(data);
    await newTracking.save();
  }

  async list(vehicleId: string) {
    return this.trackingModel.find({ vehicleId });
  }
}
