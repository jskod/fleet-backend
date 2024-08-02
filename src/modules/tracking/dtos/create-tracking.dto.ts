import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @IsNumber()
  @ApiProperty()
  latitude: number;

  @IsNumber()
  @ApiProperty()
  longitude: number;

  @IsNumber()
  @ApiProperty()
  altitude: number;

  @IsNumber()
  @ApiProperty()
  heading: number;

  @IsNumber()
  @ApiProperty()
  speed: number;
}

class TirePressureDto {
  @IsNumber()
  @ApiProperty()
  frontLeft: number;

  @IsNumber()
  @ApiProperty()
  frontRight: number;

  @IsNumber()
  @ApiProperty()
  rearLeft: number;

  @IsNumber()
  @ApiProperty()
  rearRight: number;
}

class VehicleStatusDto {
  @IsBoolean()
  @ApiProperty()
  engineRunning: boolean;

  @IsNumber()
  @ApiProperty()
  fuelLevel: number;

  @IsNumber()
  @ApiProperty()
  batteryVoltage: number;

  @IsNumber()
  @ApiProperty()
  odometer: number;

  @ValidateNested()
  @Type(() => TirePressureDto)
  @ApiProperty()
  tirePressure: TirePressureDto;
}

class AlertDto {
  @IsString()
  @ApiProperty()
  type: string;

  @IsNumber()
  @ApiProperty()
  value: number;

  @IsNumber()
  @ApiProperty()
  threshold: number;

  @IsString()
  @ApiProperty()
  timestamp: string;
}

export class CreateTrackingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  timestamp: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @ApiProperty()
  location: LocationDto;

  @ValidateNested()
  @Type(() => VehicleStatusDto)
  @ApiProperty()
  vehicleStatus: VehicleStatusDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertDto)
  @ApiProperty()
  alerts: AlertDto[];
}
