import { inject, injectable } from "tsyringe";

import { IDatabaseRepository, Metrics } from "@database/IDatabaseRepository";

@injectable()
export class GetMetricsUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(): Promise<Metrics[]> {
    const metrics = await this.repository.getMetrics();

    if (!metrics) return [];

    return metrics;
  }
}
