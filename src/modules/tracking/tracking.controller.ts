import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  async addTracking(@Body() data: any) {
    return this.trackingService.insert(data);
  }

  @Post('/queue')
  async addTrackingToQueue(@Body() data: any) {
    return this.trackingService.insertWithQueue(data);
  }

  @Get(':vehicleId')
  async list(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.list(vehicleId);
  }

  @Get('/report/:vehicleId')
  async report(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getVehicleReport(vehicleId);
  }
}
