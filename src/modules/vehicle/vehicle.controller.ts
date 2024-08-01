import { Body, Controller, Post } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { RegisterVehicleDto } from './dtos/register-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async register(@Body() vehicle: RegisterVehicleDto) {
    return this.vehicleService.register(vehicle);
  }
}
