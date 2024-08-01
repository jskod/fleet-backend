import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';
import { CreateMaintenanceLogDto } from './dtos/create-maintenance-log.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async register(@Body() vehicle: RegisterVehicleDto) {
    return this.vehicleService.register(vehicle);
  }

  @Get('/list')
  async listVehicles() {
    return this.vehicleService.listVehicles();
  }

  @Post('/log')
  async createMaintenanceLog(@Body() maintenanceLog: CreateMaintenanceLogDto) {
    return this.vehicleService.createMaintenanceLog(maintenanceLog);
  }

  @Get('/log/:vehicleId')
  async getMaintenanceLogs(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.getMaintenanceLogs(vehicleId);
  }
}
