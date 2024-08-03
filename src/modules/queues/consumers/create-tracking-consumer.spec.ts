import { Test, TestingModule } from '@nestjs/testing';
import { CreateTrackingConsumer } from './create-tracking-consumer';
import { TrackingService } from '../../tracking/tracking.service';
import { Job } from 'bullmq';
import { CreateTrackingQueueDataType } from '../tracking.queue';

describe('CreateTrackingConsumer', () => {
  let provider: CreateTrackingConsumer;
  let mockTrackingService: jest.Mocked<TrackingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTrackingConsumer,
        {
          provide: TrackingService,
          useValue: {
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<CreateTrackingConsumer>(CreateTrackingConsumer);
    mockTrackingService = module.get(TrackingService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
    expect(mockTrackingService).toBeDefined();
  });

  it('should process the tracking service job', async () => {
    const job: Job<CreateTrackingQueueDataType> = {
      id: 'test-1',
      data: {
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
      },
    } as any;

    await provider.process(job);

    expect(mockTrackingService.insert).toHaveBeenCalledWith(job.data);
  });

  it('should log job processing when activating the job', () => {
    const job: Job<CreateTrackingQueueDataType> = {
      id: 'test-1',
      data: {
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
      },
    } as any;

    const spyConsole = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    provider.onActive(job);

    expect(spyConsole).toHaveBeenCalledWith(
      expect.stringContaining('job test-1'),
    );
  });

  it('should log error when job is failed', () => {
    const job: Job<CreateTrackingQueueDataType> = {
      id: 'test-1',
      data: {
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
      },
    } as any;

    const spyConsole = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    provider.onError(job);

    expect(spyConsole).toHaveBeenCalledWith(
      expect.stringContaining('Error processing job test-1'),
    );
  });
});
