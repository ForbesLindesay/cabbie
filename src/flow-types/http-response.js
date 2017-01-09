export type HttpResponse = {
  statusCode: number,
  headers: {[key: string]: string},
  body: {getString: (format: 'utf8') => string},
  url: string,
  getBody: () => string,
};
