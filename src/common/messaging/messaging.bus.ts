export interface Bus {
  send<TRequest, TResult>(pattern: string, message: TRequest, options?: BusOptionsArgument): Promise<TResult>;

  publish<TRequest>(pattern: string, message: TRequest): void;
}


export interface BusOptionsArgument {
  headers: { [key: string]: string; }
}
