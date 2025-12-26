class ConflictError extends Error {
  statusCode = 409;

  constructor(message = 'Конфликт данных') {
    super(message);
    this.name = 'ConflictError';
  }
}

export default ConflictError;
