import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateMaintenanceLogDto {
  @IsMongoId()
  @IsNotEmpty()
  vehicleId: Types.ObjectId;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsNotEmpty()
  performedBy: string;

  @IsString({ each: true })
  @IsOptional()
  partsReplaced?: string[];

  @IsNumber()
  mileageAtService: number;
}
