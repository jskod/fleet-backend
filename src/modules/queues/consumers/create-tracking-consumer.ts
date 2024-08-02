import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { CreateTrackingQueueDataType, TrackingQueue } from '../tracking.queue';
import { Job } from 'bullmq';
import { TrackingService } from '../../tracking/tracking.service';

@Processor(TrackingQueue, {
  concurrency: 5, // concurrency can be adjusted based on load and resources of server
})
export class CreateTrackingConsumer extends WorkerHost {
  constructor(private readonly trackingService: TrackingService) {
    super();
  }

  async process(job: Job<CreateTrackingQueueDataType>) {
    await this.trackingService.insert(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} on attempt ${job.attemptsStarted}...`,
    );
  }

  @OnWorkerEvent('failed')
  onError(job: Job) {
    console.log(
      `Error processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
