import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import { RegisterVehicleDto } from '../src/modules/vehicle/dtos/register-vehicle.dto';
import {
  VehicleStatus,
  VehicleType,
} from '../src/modules/vehicle/models/vehicle.model';
import { CreateMaintenanceLogDto } from '../src/modules/vehicle/dtos/create-maintenance-log.dto';
import { ObjectId } from 'mongodb';

describe('VehicleController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.setGlobalPrefix('/api/v1');

    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    await mongoose.connect(process.env.APP_MONGO_URI, {
      dbName: 'fleet_db_e2e',
    });
  });

  afterEach(async () => {
    await mongoose.connection.db.collection('vehicles').deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });

  it('/vehicle (POST)', async () => {
    const expected: RegisterVehicleDto = {
      vin: 'Vin-Test',
      type: VehicleType.Crane,
      model: 'Model-Test',
      status: VehicleStatus.Active,
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/vehicle')
      .send(expected);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(expected));
  });

  it('/vehicle/list (GET)', async () => {
    const expected = {
      vin: 'VIN-Test',
      model: 'MODEL-Test',
      type: 'crane',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await mongoose.connection.db.collection('vehicles').insertOne(expected);

    const response = await request(app.getHttpServer())
      .get('/api/v1/vehicle/list')
      .expect(200);

    expect(response.body).toEqual([{ ...expected, _id: expect.any(String) }]);
  });

  it('/vehicle/log (POST)', async () => {
    const expected: CreateMaintenanceLogDto = {
      vehicleId: new ObjectId(),
      cost: 12,
      description: 'test description',
      mileageAtService: 100,
      performedBy: 'test',
      date: new Date(),
      partsReplaced: [],
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/vehicle/log')
      .send(expected);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        cost: 12,
        description: 'test description',
        mileageAtService: 100,
        performedBy: 'test',
        date: expect.any(String),
        partsReplaced: [],
      }),
    );
  });
});
