import { VehicleStatus, VehicleType } from '../models/vehicle.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterVehicleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Vehicle Identification Number' })
  vin: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Vehicle model' })
  model: string;

  @IsString()
  @IsEnum(VehicleType)
  @ApiProperty({ enum: VehicleType })
  type: VehicleType;

  @IsString()
  @IsEnum(VehicleStatus)
  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;
}
