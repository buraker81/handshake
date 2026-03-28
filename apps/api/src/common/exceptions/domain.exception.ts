import { HttpException } from '@nestjs/common'

export const DomainErrorCodes = {
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  MODEL_DUPLICATE: 'MODEL_DUPLICATE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
} as const

export type DomainErrorCode =
  (typeof DomainErrorCodes)[keyof typeof DomainErrorCodes]

const ERRORS: Record<DomainErrorCode, { message: string; status: number }> = {
  MODEL_NOT_FOUND: { message: 'Model not found', status: 404 },
  MODEL_DUPLICATE: { message: 'A model with this hash already exists', status: 409 },
  UNAUTHORIZED: { message: 'Authentication required', status: 401 },
  FORBIDDEN: { message: 'You do not own this resource', status: 403 },
}

export class DomainException extends HttpException {
  constructor(public readonly code: DomainErrorCode) {
    super({ code, message: ERRORS[code].message }, ERRORS[code].status)
  }
}
