import { Request, Response } from 'express';
import { HttpRequest, HttpResponse } from '../../presentation/controllers/ports'

export const adaptRoute = (fn: (request: HttpRequest) => Promise<HttpResponse>) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params
    }
    const httpResponse = await fn.bind(this)(httpRequest)
    res.status(httpResponse.status).json(httpResponse.body)
  }
}