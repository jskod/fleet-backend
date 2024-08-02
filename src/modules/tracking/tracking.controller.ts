import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  async addTracking(@Body() data: any) {
    console.log('data received', data);
    return this.trackingService.insert(data);
  }

  @Post('/queue')
  async addTrackingToQueue(@Body() data: any) {
    console.log('data received', data);
    return this.trackingService.insertWithQueue(data);
  }

  @Get(':vehicleId')
  async list(@Param('vehicleId') vehicleId: string) {
    console.log('data received', vehicleId);
    return this.trackingService.list(vehicleId);
  }
}
