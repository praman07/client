export class AppError extends Error {
  public code: string
  public statusCode?: number

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}
