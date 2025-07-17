/**
 * JWT Header Claims as defined in RFC 7519
 */
export interface JWTHeader {
  /** The type of token, typically "JWT" */
  typ?: string;
  /** The algorithm used for signing */
  alg: string;
  /** Content type, used when the JWT contains a JWE */
  cty?: string;
  /** Key ID, used to identify the key used for signing */
  kid?: string;
  /** X.509 URL, URL of the X.509 certificate */
  x5u?: string;
  /** X.509 Certificate Chain, array of base64-encoded certificates */
  x5c?: string[];
  /** X.509 Certificate SHA-1 Thumbprint */
  x5t?: string;
  /** X.509 Certificate SHA-256 Thumbprint */
  'x5t#S256'?: string;
  /** Critical header parameters that must be understood */
  crit?: string[];
  /** Additional custom header parameters */
  [key: string]: any;
}

/**
 * JWT Payload Claims as defined in RFC 7519
 */
export interface JWTPayload {
  // Registered Claim Names
  /** Issuer - identifies the principal that issued the JWT */
  iss?: string;
  /** Subject - identifies the principal that is the subject of the JWT */
  sub?: string;
  /** Audience - identifies the recipients that the JWT is intended for */
  aud?: string | string[];
  /** Expiration Time - identifies the expiration time on or after which the JWT must not be accepted for processing */
  exp?: number;
  /** Not Before - identifies the time before which the JWT must not be accepted for processing */
  nbf?: number;
  /** Issued At - identifies the time at which the JWT was issued */
  iat?: number;
  /** JWT ID - provides a unique identifier for the JWT */
  jti?: string;
  
  // Additional custom claims
  [key: string]: any;
}

/**
 * Complete JWT structure
 */
export interface JWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature?: string;
}

/**
 * JWT Decode Result
 */
export interface JWTDecodeResult {
  /** The decoded JWT object */
  jwt: JWT;
  /** Whether the JWT is valid (not expired, not before time, etc.) */
  isValid: boolean;
  /** Validation errors if any */
  errors: string[];
  /** Whether the JWT has expired */
  isExpired: boolean;
  /** Whether the JWT is not yet valid (before nbf time) */
  isNotYetValid: boolean;
}

/**
 * JWT Validation Options
 */
export interface JWTValidationOptions {
  /** Whether to validate expiration time */
  validateExp?: boolean;
  /** Whether to validate not-before time */
  validateNbf?: boolean;
  /** Clock skew tolerance in seconds (default: 30) */
  clockSkew?: number;
  /** Expected issuer */
  expectedIssuer?: string;
  /** Expected audience */
  expectedAudience?: string | string[];
  /** Current time for validation (useful for testing) */
  currentTime?: number;
} 