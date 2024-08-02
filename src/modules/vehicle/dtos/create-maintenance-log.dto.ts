import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceLogDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Vehicle Id' })
  vehicleId: Types.ObjectId;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Description for the log', required: false })
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  cost: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'technician or company name' })
  performedBy: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  partsReplaced?: string[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  mileageAtService: number;
}
