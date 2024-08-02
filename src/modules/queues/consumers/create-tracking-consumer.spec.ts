import { Test, TestingModule } from '@nestjs/testing';
import { CreateTrackingConsumer } from './create-tracking-consumer';

describe('CreateTrackingConsumer', () => {
  let provider: CreateTrackingConsumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTrackingConsumer],
    }).compile();

    provider = module.get<CreateTrackingConsumer>(CreateTrackingConsumer);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
