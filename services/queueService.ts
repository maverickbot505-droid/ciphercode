import { Queue, Worker } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

export class NotificationQueue {
  private queue: Queue;
  private worker?: Worker;

  constructor(queueName: string = 'notifications') {
    // In production, use Redis connection string
    const connection = {
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    };

    this.queue = new Queue(queueName, { connection });
  }

  async addNotification(
    data: any,
    options?: { retries: number; backoff: boolean }
  ): Promise<void> {
    const job = await this.queue.add(
      'send-notification',
      {
        ...data,
        id: uuidv4(),
      },
      {
        delays: [], // No delay by default
        removeOnComplete: true,
        removeOnFail: options?.retries ? { count: options.retries, age: 24 * 3600 } : false, // Keep failed jobs for 1 day
      }
    );

    job.on('completed', () => console.log(`Notification completed: ${job.id}`));
    job.on('failed', (err) => console.log(`Notification failed: ${job.id}`, err));
  }

  async addWithRetries(data: any, retries = 3): Promise<void> {
    const maxRetries = retries;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        await this.addNotification(data);
        break;
      } catch (error) {
        attempts++;
        if (attempts === maxRetries) {
          console.log('Max retries reached for notification');
        } else {
          // Exponential backoff: 1s, 2s, 4s...
          const delay = Math.pow(2, attempts - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  async getStatus(jobId: string): Promise<any> {
    return this.queue.getJobStatus(jobId);
  }
}

export function createQueueWorker(
  handler: (job: any, prisma: any) => Promise<void>
): Worker {
  const connection = {
    redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  };

  const worker = new Worker('notifications', async (job) => {
    console.log(`Processing job: ${job.name}`, job.data);
    await handler(job, new PrismaClient());
  }, { connection });

  return worker;
}
