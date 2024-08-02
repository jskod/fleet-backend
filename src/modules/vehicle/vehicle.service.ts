import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './models/vehicle.model';
import { Model } from 'mongoose';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';
import { CreateMaintenanceLogDto } from './dtos/create-maintenance-log.dto';
import { Maintenance, MaintenanceDocument } from './models/maintenance.model';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<MaintenanceDocument>,
  ) {}

  async register(data: RegisterVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleModel.findOne({ vin: data.vin });

    if (existingVehicle) {
      throw new ConflictException('Vehicle already exists');
    }

    return await this.vehicleModel.create(data);
  }

  async listVehicles(): Promise<Vehicle[]> {
    return this.vehicleModel.find().sort({ createdAt: -1 });
  }

  async createMaintenanceLog(
    data: CreateMaintenanceLogDto,
  ): Promise<Maintenance> {
    return await this.maintenanceModel.create(data);
  }

  async getMaintenanceLogs(vehicleId: string): Promise<Maintenance[]> {
    return this.maintenanceModel.find({ vehicleId }).sort({ date: -1 });
  }
}
