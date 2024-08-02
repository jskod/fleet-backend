import { Test, TestingModule } from '@nestjs/testing';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dtos/create-tracking.dto';

describe('TrackingController', () => {
  let controller: TrackingController;
  let mockTrackingService: jest.Mocked<Partial<TrackingService>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        {
          provide: TrackingService,
          useValue: {
            insert: jest.fn(),
            list: jest.fn(),
            insertWithQueue: jest.fn(),
            getVehicleReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TrackingController>(TrackingController);
    mockTrackingService = module.get(TrackingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add new tracking', async () => {
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

    await controller.addTracking(data);

    expect(mockTrackingService.insert).toHaveBeenCalledWith(data);
  });

  it('should list tracking for vehicle', async () => {
    await controller.list('test-1');

    expect(mockTrackingService.list).toHaveBeenCalledWith('test-1');
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

    await controller.addTrackingToQueue(data);

    expect(mockTrackingService.insertWithQueue).toHaveBeenCalledWith(data);
  });

  it('should return report for vehicle', async () => {
    await controller.report('test-1');

    expect(mockTrackingService.getVehicleReport).toHaveBeenCalledWith('test-1');
  });
});
