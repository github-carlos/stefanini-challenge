export type HttpRequest = {
  params: any,
  body: any
}

export interface HttpError {
  message: string;
  status: number;
}

export type HttpResponse = {
  status: number,
  body: any;
}