import { VehicleStatus, VehicleType } from '../models/vehicle.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterVehicleDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsEnum(VehicleType)
  type: string;

  @IsString()
  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}
