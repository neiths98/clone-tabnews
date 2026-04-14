export class InternalServerError extends Error {
  constructor({ cause }) {
    super('Um erro interno não esperado aconteceu.', { cause })
    this.statusCode = 500
    this.name = 'InternalServerError'
    this.action = 'Entre em contato com o suporte'
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}
