import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeLiveLocationAndStatusOutputDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  speed: number;
}
