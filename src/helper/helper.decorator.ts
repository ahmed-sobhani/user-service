import { Inject, applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * Helper Service Decorator
 * @returns Helper Service Instance
 */
export function Helper(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(`HelperService`);
}

/**
 * 
 * @param field 
 * @returns 
 */
export function File(field: string): any {
  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}
