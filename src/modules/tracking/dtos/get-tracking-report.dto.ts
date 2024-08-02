import { ApiProperty } from '@nestjs/swagger';

class TirePressureDto {
  @ApiProperty()
  frontLeft: number;

  @ApiProperty()
  frontRight: number;

  @ApiProperty()
  rearLeft: number;

  @ApiProperty()
  rearRight: number;
}

export class TrackingReportOutputDto {
  @ApiProperty()
  hoursOperated: number;

  @ApiProperty()
  totalDistance: number;

  @ApiProperty()
  averageSpeed: number;

  @ApiProperty()
  maxSpeed: number;

  @ApiProperty()
  averageTirePressure: TirePressureDto;

  @ApiProperty()
  averageBatteryVoltage: number;

  @ApiProperty()
  minBatteryVoltage: number;

  @ApiProperty()
  alertCount: number;
}
