export interface IResponseFactoryDTO<D = undefined, E = undefined> {
  status: string;
  code: number;
  message: string;
  data?: D;
  error?: E;
}

export function responseFactory<D = undefined, E = undefined, F = undefined>({
  status,
  code,
  message,
  data,
  error,
}: IResponseFactoryDTO<D, E>): IResponseFactoryDTO<D, E> {
  const response = {
    status,
    code,
    message,
    data,
    error,
  };

  return response;
}
