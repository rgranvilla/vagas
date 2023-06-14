import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetMetricsUseCase } from "./GetMetricsUseCase";
("../../factories/responseFactory");

export async function GetMetricsController(req: Request, res: Response) {
  try {
    const getMetricsUseCase = container.resolve(GetMetricsUseCase);

    const metrics = await getMetricsUseCase.execute();

    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Metrics retrieval successful.",
      data: {
        metrics,
      },
    });

    return res.status(response.code).send(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
