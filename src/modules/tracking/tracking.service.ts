import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from './models/tracking.model';
import { Model, PipelineStage } from 'mongoose';
import { CreateTrackingDto } from './dtos/create-tracking.dto';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CreateTrackingQueueDataType,
  TrackingQueue,
} from '../queues/tracking.queue';
import { Queue } from 'bullmq';
import { TrackingReportOutputDto } from './dtos/get-tracking-report.dto';

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

  async getVehicleReport(vehicleId: string) {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: { vehicleId },
        },
        {
          $sort: { vehicleId: 1, timestamp: 1 },
        },
        {
          // Group by vehicleId to calculate metrics for each vehicle
          $group: {
            _id: '$vehicleId',
            firstTimestamp: { $first: '$timestamp' },
            lastTimestamp: { $last: '$timestamp' },
            firstOdometer: { $first: '$vehicleStatus.odometer' },
            lastOdometer: { $last: '$vehicleStatus.odometer' },
            timestamps: { $push: '$timestamp' },
            engineStatuses: { $push: '$vehicleStatus.engineRunning' },
            speeds: { $push: '$location.speed' },
            tirePressures: { $push: '$vehicleStatus.tirePressure' },
            batteryVoltages: { $push: '$vehicleStatus.batteryVoltage' },
            alerts: { $push: '$alerts' },
          },
        },
        {
          // Convert strings to appropriate types
          $addFields: {
            firstTimestamp: { $toDate: '$firstTimestamp' },
            lastTimestamp: { $toDate: '$lastTimestamp' },
            firstOdometer: { $toDouble: '$firstOdometer' },
            lastOdometer: { $toDouble: '$lastOdometer' },
          },
        },
        {
          // Calculate total distance and total hours operated
          $project: {
            hoursOperated: {
              $divide: [
                { $subtract: ['$lastTimestamp', '$firstTimestamp'] },
                1000 * 60 * 60, // Convert milliseconds to hours
              ],
            },
            totalDistance: {
              $subtract: ['$lastOdometer', '$firstOdometer'],
            },
            averageSpeed: { $round: [{ $avg: '$speeds' }, 2] },
            maxSpeed: { $round: [{ $max: '$speeds' }, 2] },
            averageTirePressure: {
              frontLeft: { $round: [{ $avg: '$tirePressures.frontLeft' }, 2] },
              frontRight: {
                $round: [{ $avg: '$tirePressures.frontRight' }, 2],
              },
              rearLeft: { $round: [{ $avg: '$tirePressures.rearLeft' }, 2] },
              rearRight: { $round: [{ $avg: '$tirePressures.rearRight' }, 2] },
            },
            averageBatteryVoltage: { $avg: '$batteryVoltages' },
            minBatteryVoltage: { $min: '$batteryVoltages' },
            alertCount: {
              $sum: {
                $map: {
                  input: '$alerts',
                  as: 'alert',
                  in: { $size: '$$alert' },
                },
              },
            },
          },
        },
      ];

      return await this.trackingModel.aggregate<TrackingReportOutputDto>(
        pipeline,
      );
    } catch (error) {
      console.log('error in aggregate', error);
    }
  }
}
