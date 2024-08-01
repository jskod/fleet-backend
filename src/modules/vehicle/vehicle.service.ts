import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './models/vehicle.model';
import { Model } from 'mongoose';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  async register(data: RegisterVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleModel.findOne({ vin: data.vin });

    if (existingVehicle) {
      throw new ConflictException('Vehicle already exists');
    }

    const newVehicle = new this.vehicleModel(data);
    return newVehicle.save();
  }
}
