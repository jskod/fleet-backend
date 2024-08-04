import { Module } from '@nestjs/common';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TrackingModule } from './modules/tracking/tracking.module';
import { BullModule } from '@nestjs/bullmq';
import { CreateTrackingConsumer } from './modules/queues/consumers/create-tracking-consumer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isE2e = configService.get('NODE_ENV') === 'e2e';
        return {
          uri: configService.get('APP_MONGO_URI'),
          dbName: isE2e ? 'fleet_db_e2e' : 'fleet_db',
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get('APP_REDIS_HOST'),
            port: parseInt(configService.get('APP_REDIS_PORT')) || 6379,
          },
        };
      },
      inject: [ConfigService],
    }),
    VehicleModule,
    TrackingModule,
  ],
  providers: [CreateTrackingConsumer],
})
export class AppModule {}
