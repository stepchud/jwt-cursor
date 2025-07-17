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

export const jwtDecode = JWTDecoder.decode.bind(JWTDecoder);
export const jwtValidate = JWTDecoder.validate.bind(JWTDecoder);
export const jwtDecodeAndValidate = JWTDecoder.decodeAndValidate.bind(JWTDecoder);
export const jwtGetPayload = JWTDecoder.getPayload.bind(JWTDecoder);
export const jwtGetHeader = JWTDecoder.getHeader.bind(JWTDecoder);
export const jwtIsExpired = JWTDecoder.isExpired.bind(JWTDecoder);
export const jwtGetTimeUntilExpiration = JWTDecoder.getTimeUntilExpiration.bind(JWTDecoder); 