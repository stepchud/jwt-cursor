// Export types
export type {
  JWT,
  JWTHeader,
  JWTPayload,
  JWTDecodeResult,
  JWTValidationOptions
} from './types';

// Export the main decoder class
export { JWTDecoder } from './decoder';

// Convenience functions for common use cases
import { JWTDecoder } from './decoder';

export const jwtDecode = JWTDecoder.decode;
export const jwtValidate = JWTDecoder.validate;
export const jwtDecodeAndValidate = JWTDecoder.decodeAndValidate;
export const jwtGetPayload = JWTDecoder.getPayload;
export const jwtGetHeader = JWTDecoder.getHeader;
export const jwtIsExpired = JWTDecoder.isExpired;
export const jwtGetTimeUntilExpiration = JWTDecoder.getTimeUntilExpiration; 