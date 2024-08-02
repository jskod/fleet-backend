import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';
import { CreateMaintenanceLogDto } from './dtos/create-maintenance-log.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Vehicle } from './models/vehicle.model';
import { Maintenance } from './models/maintenance.model';

@ApiTags('vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'The vehicle has been successfully registered.',
    type: Vehicle,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: RegisterVehicleDto })
  async register(@Body() vehicle: RegisterVehicleDto) {
    return this.vehicleService.register(vehicle);
  }

  @Get('/list')
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of vehicles',
    type: [Vehicle],
  })
  async listVehicles() {
    return this.vehicleService.listVehicles();
  }

  @Post('/log')
  @ApiOperation({ summary: 'Add new maintenance log' })
  @ApiResponse({
    status: 201,
    description: 'Maintenance log added successfully',
    type: Maintenance,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateMaintenanceLogDto })
  async createMaintenanceLog(@Body() maintenanceLog: CreateMaintenanceLogDto) {
    return this.vehicleService.createMaintenanceLog(maintenanceLog);
  }

  @ApiOperation({ summary: 'Add new maintenance log' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of maintenance logs',
    type: Maintenance,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiParam({ type: String, name: 'vehicleId' })
  @Get('/log/:vehicleId')
  async getMaintenanceLogs(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.getMaintenanceLogs(vehicleId);
  }
}
