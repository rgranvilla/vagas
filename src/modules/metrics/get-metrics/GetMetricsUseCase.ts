import { IDatabaseRepository, Metrics } from "@database";
import { inject, injectable } from "tsyringe";

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
