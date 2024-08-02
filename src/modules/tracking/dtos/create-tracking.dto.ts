import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  altitude: number;

  @IsNumber()
  heading: number;

  @IsNumber()
  speed: number;
}

class TirePressureDto {
  @IsNumber()
  frontLeft: number;

  @IsNumber()
  frontRight: number;

  @IsNumber()
  rearLeft: number;

  @IsNumber()
  rearRight: number;
}

class VehicleStatusDto {
  @IsBoolean()
  engineRunning: boolean;

  @IsNumber()
  fuelLevel: number;

  @IsNumber()
  batteryVoltage: number;

  @IsNumber()
  odometer: number;

  @ValidateNested()
  @Type(() => TirePressureDto)
  tirePressure: TirePressureDto;
}

class AlertDto {
  @IsString()
  type: string;

  @IsNumber()
  value: number;

  @IsNumber()
  threshold: number;

  @IsString()
  timestamp: string;
}

export class CreateTrackingDto {
  @IsString()
  vehicleId: string;

  @IsString()
  timestamp: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => VehicleStatusDto)
  vehicleStatus: VehicleStatusDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertDto)
  alerts: AlertDto[];
}
