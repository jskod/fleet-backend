import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTrackingDto } from './dtos/create-tracking.dto';
import { Tracking } from './models/tracking.model';
import { TrackingReportOutputDto } from './dtos/get-tracking-report.dto';
import { GeLiveLocationAndStatusOutputDto } from './dtos/ge-live-location-and-status.dto';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Add new vehicle tracking' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle tracking created successfully.',
    type: Tracking,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiBody({ type: CreateTrackingDto })
  async addTracking(@Body() data: CreateTrackingDto) {
    return this.trackingService.insert(data);
  }

  @Post('/queue')
  @ApiOperation({
    summary: 'Add new vehicle tracking data using queue to manage high loads',
  })
  @ApiResponse({
    status: 201,
    description: 'Requested to process tracking data received successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiBody({ type: CreateTrackingDto })
  async addTrackingToQueue(@Body() data: CreateTrackingDto) {
    return this.trackingService.insertWithQueue(data);
  }

  @Get(':vehicleId')
  @ApiOperation({
    summary: 'Get tracking history for a vehicle',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of history for a vehicle.',
    type: [Tracking],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiParam({ type: String, name: 'vehicleId' })
  async list(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.list(vehicleId);
  }

  @Get('/report/:vehicleId')
  @ApiOperation({
    summary: 'Get tracking report for a vehicle',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns tracking report for a vehicle.',
    type: TrackingReportOutputDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiParam({ type: String, name: 'vehicleId' })
  async report(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getVehicleReport(vehicleId);
  }

  @ApiOperation({ summary: 'Live Track a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Returns status and coords for vehicle',
    type: GeLiveLocationAndStatusOutputDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiParam({ type: String, name: 'vehicleId' })
  @Get('/live/:vehicleId')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getVehicleLocationAndStatus(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getVehicleLiveLocationData();
  }
}
