export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function manipuladorDeErros(err, req, res, next) {
  console.error('[ERRO DO SERVIDOR]:', err.stack || err.message);


  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    sucesso: false,
    status,
    mensagem: err.message || 'Ocorreu um erro interno no servidor.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}