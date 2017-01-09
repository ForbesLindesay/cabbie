export type HttpResponse = {
  statusCode: number,
  headers: {[key: string]: string},
  body: Buffer,
  url: string,
  getBody: () => string,
};
