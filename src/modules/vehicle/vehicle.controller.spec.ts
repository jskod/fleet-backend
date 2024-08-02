import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';
import { VehicleStatus, VehicleType } from './models/vehicle.model';
import { CreateMaintenanceLogDto } from './dtos/create-maintenance-log.dto';
import { ObjectId } from 'mongodb';

describe('VehicleController', () => {
  let controller: VehicleController;
  let mockVehicleService: jest.Mocked<VehicleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            register: jest.fn(),
            createMaintenanceLog: jest.fn(),
            listVehicles: jest.fn(),
            getMaintenanceLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    mockVehicleService = module.get(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new vehicle', async () => {
    const data: RegisterVehicleDto = {
      vin: 'VIN-Test',
      model: 'MODEL-Test',
      type: VehicleType.Crane,
      status: VehicleStatus.Active,
    };

    await controller.register(data);

    expect(mockVehicleService.register).toHaveBeenCalledWith(data);
  });

  it('should list vehicles', async () => {
    await controller.listVehicles();

    expect(mockVehicleService.listVehicles).toHaveBeenCalled();
  });

  it('should create maintenance log for vehicle', async () => {
    const data: CreateMaintenanceLogDto = {
      vehicleId: new ObjectId(),
      date: new Date(),
      description: 'test description',
      partsReplaced: [],
      performedBy: 'user1',
      mileageAtService: 100,
      cost: 12,
    };

    await controller.createMaintenanceLog(data);

    expect(mockVehicleService.createMaintenanceLog).toHaveBeenCalledWith(data);
  });

  it('should create maintenance log for vehicle', async () => {
    await controller.getMaintenanceLogs('test-1');

    expect(mockVehicleService.getMaintenanceLogs).toHaveBeenCalledWith(
      'test-1',
    );
  });
});
