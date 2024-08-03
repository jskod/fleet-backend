import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';
import { getQueueToken } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import {
  CreateTrackingQueueDataType,
  TrackingQueue,
} from '../queues/tracking.queue';
import { Tracking, TrackingDocument } from './models/tracking.model';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTrackingDto } from './dtos/create-tracking.dto';
import { Model } from 'mongoose';

describe('TrackingService', () => {
  let service: TrackingService;
  let mockTrackingModel: jest.Mocked<Model<TrackingDocument>>;
  let mockTrackingQueue: jest.Mocked<Queue<CreateTrackingQueueDataType>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: getQueueToken(TrackingQueue),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: getModelToken(Tracking.name),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    mockTrackingModel = module.get(getModelToken(Tracking.name));
    mockTrackingQueue = module.get(getQueueToken(TrackingQueue));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockTrackingModel).toBeDefined();
    expect(mockTrackingQueue).toBeDefined();
  });

  it('should insert new tracking', async () => {
    const data: CreateTrackingDto = {
      vehicleId: 'test1',
      timestamp: '2024-08-03T23:58:16.038Z',
      location: {
        latitude: 37.793169190714124,
        longitude: -122.37991487676067,
        altitude: 28.99365501009916,
        heading: 218.45610950238648,
        speed: 60,
      },
      vehicleStatus: {
        engineRunning: false,
        fuelLevel: 15.35,
        batteryVoltage: 12.14,
        odometer: 2050,
        tirePressure: {
          frontLeft: 30.19,
          frontRight: 32.05,
          rearLeft: 30.83,
          rearRight: 33.6,
        },
      },
      alerts: [],
    };

    const expected = {
      vehicleId: '66accde6b4c0e66659b93991',
      timestamp: '2024-08-03T23:58:16.038Z',
      location: {
        latitude: 37.793169190714124,
        longitude: -122.37991487676067,
        altitude: 28.99365501009916,
        heading: 218.45610950238648,
        speed: 60.43461495088866,
      },
      vehicleStatus: {
        engineRunning: false,
        fuelLevel: 15.357925934670025,
        batteryVoltage: 12.146335705322196,
        odometer: 2050,
        tirePressure: {
          frontLeft: 30.194332739627082,
          frontRight: 32.05558862615888,
          rearLeft: 30.835406356580265,
          rearRight: 33.60219715996445,
        },
      },
      alerts: [],
    };
    mockTrackingModel.create = jest.fn().mockResolvedValueOnce(expected);

    const result = await service.insert(data);

    expect(mockTrackingModel.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(expected);
  });

  it('should list all tracking for vehicle', async () => {
    const expected = [
      {
        vehicleId: '66accde6b4c0e66659b93991',
        timestamp: '2024-08-03T23:58:16.038Z',
        location: {
          latitude: 37.793169190714124,
          longitude: -122.37991487676067,
          altitude: 28.99365501009916,
          heading: 218.45610950238648,
          speed: 60.43461495088866,
        },
        vehicleStatus: {
          engineRunning: false,
          fuelLevel: 15.357925934670025,
          batteryVoltage: 12.146335705322196,
          odometer: 2050,
          tirePressure: {
            frontLeft: 30.194332739627082,
            frontRight: 32.05558862615888,
            rearLeft: 30.835406356580265,
            rearRight: 33.60219715996445,
          },
        },
        alerts: [],
      },
    ];

    mockTrackingModel.find = jest.fn().mockResolvedValueOnce(expected);

    const result = await service.list('test-1');

    expect(mockTrackingModel.find).toHaveBeenCalledWith({
      vehicleId: 'test-1',
    });

    expect(result).toEqual(expected);
  });

  it('should add tracking data to queue', async () => {
    const data: CreateTrackingDto = {
      vehicleId: 'test1',
      timestamp: '2024-08-03T23:58:16.038Z',
      location: {
        latitude: 37.793169190714124,
        longitude: -122.37991487676067,
        altitude: 28.99365501009916,
        heading: 218.45610950238648,
        speed: 60,
      },
      vehicleStatus: {
        engineRunning: false,
        fuelLevel: 15.35,
        batteryVoltage: 12.14,
        odometer: 2050,
        tirePressure: {
          frontLeft: 30.19,
          frontRight: 32.05,
          rearLeft: 30.83,
          rearRight: 33.6,
        },
      },
      alerts: [],
    };

    mockTrackingQueue.add = jest
      .fn()
      .mockResolvedValueOnce({ data, name: 'add-tracking' });

    const result: Job<any> = await service.insertWithQueue(data);

    expect(mockTrackingQueue.add).toHaveBeenCalledWith('add-tracking', data);
    expect(result.name).toBe('add-tracking');
    expect(result.data).toBe(data);
  });

  it('should log an error when failed to add job to queue', async () => {
    const data: CreateTrackingDto = {
      vehicleId: 'test1',
      timestamp: '2024-08-03T23:58:16.038Z',
      location: {
        latitude: 37.793169190714124,
        longitude: -122.37991487676067,
        altitude: 28.99365501009916,
        heading: 218.45610950238648,
        speed: 60,
      },
      vehicleStatus: {
        engineRunning: false,
        fuelLevel: 15.35,
        batteryVoltage: 12.14,
        odometer: 2050,
        tirePressure: {
          frontLeft: 30.19,
          frontRight: 32.05,
          rearLeft: 30.83,
          rearRight: 33.6,
        },
      },
      alerts: [],
    };

    const spyConsole = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());

    mockTrackingQueue.add = jest.fn().mockRejectedValueOnce(new Error());
    const result = await service.insertWithQueue(data);

    expect(mockTrackingQueue.add).toHaveBeenCalledWith('add-tracking', data);
    expect(result).toBeUndefined();
    expect(spyConsole).toHaveBeenCalled();
  });

  it('should generate report from tracking history', async () => {
    const expected = [
      {
        _id: '66accde6b4c0e66659b93998',
        hoursOperated: 0,
        totalDistance: 0,
        averageSpeed: 60.43,
        maxSpeed: 60.43,
        averageTirePressure: {
          frontLeft: 30.19,
          frontRight: 32.06,
          rearLeft: 30.84,
          rearRight: 33.6,
        },
        averageBatteryVoltage: 12.146335705322196,
        minBatteryVoltage: 12.146335705322196,
        alertCount: 0,
      },
    ];
    mockTrackingModel.aggregate = jest.fn().mockResolvedValueOnce(expected);

    const result = await service.getVehicleReport('test-1');

    expect(mockTrackingModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    expect(result).toEqual(expected[0]);
  });

  it('should handle error while generating report from tracking history', async () => {
    mockTrackingModel.aggregate = jest.fn().mockRejectedValueOnce(new Error());

    const spyConsole = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    const result = await service.getVehicleReport('test-1');

    expect(mockTrackingModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    expect(result).toBeUndefined();
    expect(spyConsole).toHaveBeenCalled();
  });
});
