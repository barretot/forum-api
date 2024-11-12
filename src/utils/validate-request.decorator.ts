import { UsePipes, applyDecorators } from '@nestjs/common'
import { ZodType, ZodTypeDef } from 'zod'

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

export function ValidateRquest<T>(schema: ZodType<T, ZodTypeDef, T>) {
  const validationPipe = new ZodValidationPipe(schema)
  return applyDecorators(UsePipes(validationPipe))
}
