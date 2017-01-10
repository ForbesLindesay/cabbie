export type HttpResponse = {
  statusCode: number,
  headers: {[key: string]: string},
  body: Buffer,
  getBody: () => string,
};
