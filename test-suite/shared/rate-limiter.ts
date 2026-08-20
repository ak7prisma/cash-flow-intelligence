export interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();

    this.timestamps = this.timestamps.filter((ts) => now - ts < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      const oldest = this.timestamps[0];
      const waitMs = this.windowMs - (now - oldest);
      if (waitMs > 0) {
        console.log(`Rate limit: ${this.maxRequests} req / ${this.windowMs / 1000}s reached, waiting ${(waitMs / 1000).toFixed(1)}s...`);
        await sleep(waitMs);
      }
      this.timestamps = this.timestamps.filter((ts) => now + waitMs - ts < this.windowMs);
    }

    this.timestamps.push(Date.now());
  }
}

export const defaultRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60_000
});
