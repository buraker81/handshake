import { HttpException } from '@nestjs/common'

const MESSAGES: Record<string, string> = {
  MODEL_NOT_FOUND: 'Model not found',
  MODEL_DUPLICATE: 'A model with this hash already exists',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not own this resource',
}

export class DomainException extends HttpException {
  constructor(public readonly code: string, statusCode: number) {
    super({ code, message: MESSAGES[code] ?? code }, statusCode)
  }
}
