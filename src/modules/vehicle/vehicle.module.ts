import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './models/vehicle.model';
import { Maintenance, MaintenanceSchema } from './models/maintenance.model';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
      },
      {
        name: Maintenance.name,
        schema: MaintenanceSchema,
      },
    ]),
  ],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
