import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import {
  Vehicle,
  VehicleDocument,
  VehicleStatus,
  VehicleType,
} from './models/vehicle.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Maintenance, MaintenanceDocument } from './models/maintenance.model';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';
import { CreateMaintenanceLogDto } from './dtos/create-maintenance-log.dto';
import { ObjectId } from 'mongodb';

describe('VehicleService', () => {
  let service: VehicleService;
  let mockVehicleModel: jest.Mocked<Model<VehicleDocument>>;
  let mockMaintenanceModel: jest.Mocked<
    jest.Mocked<Model<MaintenanceDocument>>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getModelToken(Vehicle.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn().mockImplementation(() => ({ sort: jest.fn() })),
          },
        },
        {
          provide: getModelToken(Maintenance.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockImplementation(() => ({ sort: jest.fn() })),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    mockVehicleModel = module.get(getModelToken(Vehicle.name));
    mockMaintenanceModel = module.get(getModelToken(Maintenance.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockVehicleModel).toBeDefined();
    expect(mockMaintenanceModel).toBeDefined();
  });

  it('should register a new vehicle', async () => {
    const data: RegisterVehicleDto = {
      vin: 'VIN-Test',
      model: 'MODEL-Test',
      type: VehicleType.Crane,
      status: VehicleStatus.Active,
    };

    mockVehicleModel.create = jest.fn().mockResolvedValueOnce(data);

    const result = await service.register(data);

    expect(mockVehicleModel.findOne).toHaveBeenCalledWith({ vin: 'VIN-Test' });
    expect(mockVehicleModel.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it('should throw error when vin is already existing', async () => {
    const data: RegisterVehicleDto = {
      vin: 'VIN-Test',
      model: 'MODEL-Test',
      type: VehicleType.Crane,
      status: VehicleStatus.Active,
    };

    mockVehicleModel.findOne = jest.fn().mockResolvedValueOnce(data);

    await expect(service.register(data)).rejects.toThrow(
      'Vehicle already exists',
    );
  });

  it('should list all vehicles', async () => {
    const mockSort = jest.fn().mockResolvedValueOnce([]);
    mockVehicleModel.find = jest
      .fn()
      .mockImplementation(() => ({ sort: mockSort }));

    await service.listVehicles();

    expect(mockVehicleModel.find).toHaveBeenCalled();
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('should add a maintenance log for vehicle', async () => {
    const data: CreateMaintenanceLogDto = {
      vehicleId: new ObjectId(),
      date: new Date(),
      cost: 1500,
      performedBy: 'John',
      mileageAtService: 39012,
    };

    mockMaintenanceModel.create = jest.fn().mockResolvedValueOnce(data);

    const result = await service.createMaintenanceLog(data);
    expect(mockMaintenanceModel.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it('should return list of maintenance logs for vehicle', async () => {
    const expected = [
      {
        vehicleId: new ObjectId(),
        date: new Date(),
        cost: 1500,
        performedBy: 'John',
        mileageAtService: 39012,
      },
    ];

    const mockSort = jest.fn().mockResolvedValueOnce(expected);
    mockMaintenanceModel.find = jest
      .fn()
      .mockImplementation(() => ({ sort: mockSort }));

    const result = await service.getMaintenanceLogs('test-1');

    expect(mockMaintenanceModel.find).toHaveBeenCalledWith({
      vehicleId: 'test-1',
    });
    expect(mockSort).toHaveBeenCalledWith({ date: -1 });
    expect(result).toEqual(expected);
  });
});
