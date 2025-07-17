import { JWTDecoder, jwtDecode, jwtDecodeAndValidate, jwtIsExpired, jwtGetTimeUntilExpiration, jwtValidate, jwtGetPayload, jwtGetHeader, JWTValidationOptions } from './index';

// Example JWT tokens for testing
const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const futureJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJuYmYiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const customClaimsJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHA6Ly9leGFtcGxlLmNvbSIsImF1ZCI6Im15YXBwIiwicm9sZSI6ImFkbWluIiwiZGVwYXJ0bWVudCI6ImVuZ2luZWVyaW5nIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('JWT Decoder Examples', () => {
  
  test('Basic JWT decoding', () => {
    const decoded = JWTDecoder.decode(validJWT);
    
    expect(decoded.header).toEqual({
      alg: 'HS256',
      typ: 'JWT'
    });
    
    expect(decoded.payload).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
      exp: 9999999999
    });
    
    expect(decoded.signature).toBeDefined();
  });

  test('Using convenience function', () => {
    const decoded = jwtDecode(validJWT);
    expect(decoded.payload.name).toBe('John Doe');
  });

  test('JWT validation - valid token', () => {
    const result = jwtDecodeAndValidate(validJWT);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.isExpired).toBe(false);
    expect(result.isNotYetValid).toBe(false);
  });

  test('JWT validation - expired token', () => {
    const result = jwtDecodeAndValidate(expiredJWT);
    
    expect(result.isValid).toBe(false);
    expect(result.isExpired).toBe(true);
    expect(result.errors).toContain('JWT has expired');
  });

  test('JWT validation - future token (nbf)', () => {
    const result = jwtDecodeAndValidate(futureJWT);
    
    expect(result.isValid).toBe(false);
    expect(result.isNotYetValid).toBe(true);
    expect(result.errors).toContain('JWT is not yet valid (before nbf time)');
  });

  test('JWT validation with custom options', () => {
    const options: JWTValidationOptions = {
      validateExp: false, // Don't validate expiration
      validateNbf: false, // Don't validate not-before
      expectedIssuer: 'http://example.com',
      expectedAudience: 'myapp'
    };
    
    const result = jwtDecodeAndValidate(customClaimsJWT, options);
    
    expect(result.isValid).toBe(true);
    expect(result.jwt.payload.iss).toBe('http://example.com');
    expect(result.jwt.payload.aud).toBe('myapp');
    expect(result.jwt.payload.role).toBe('admin');
    expect(result.jwt.payload.department).toBe('engineering');
  });

  test('Get specific parts of JWT', () => {
    const payload = jwtGetPayload(validJWT);
    const header = jwtGetHeader(validJWT);
    
    expect(payload.name).toBe('John Doe');
    expect(header.alg).toBe('HS256');
  });

  test('Check if token is expired', () => {
    expect(jwtIsExpired(validJWT)).toBe(false);
    expect(jwtIsExpired(expiredJWT)).toBe(true);
  });

  test('Get time until expiration', () => {
    const timeUntilExp = jwtGetTimeUntilExpiration(validJWT);
    expect(timeUntilExp).toBeGreaterThan(0);
    
    const expiredTime = jwtGetTimeUntilExpiration(expiredJWT);
    expect(expiredTime).toBe(0);
  });

  test('Error handling - invalid token', () => {
    expect(() => {
      JWTDecoder.decode('invalid.token.here');
    }).toThrow('Failed to decode JWT');
  });

  test('Error handling - malformed token', () => {
    expect(() => {
      JWTDecoder.decode('not.a.jwt');
    }).toThrow('Failed to decode JWT: Invalid base64url encoding');
  });

  test('Error handling - empty token', () => {
    expect(() => {
      JWTDecoder.decode('');
    }).toThrow('JWT token must be a non-empty string');
  });
});

// Example usage in React Native app
export const exampleUsage = () => {
  // Example 1: Simple decoding
  const token = 'your.jwt.token.here';
  const decoded = jwtDecode(token);
  console.log('User name:', decoded.payload.name);
  
  // Example 2: Validation with options
  const validationResult = jwtDecodeAndValidate(token, {
    expectedIssuer: 'https://your-auth-server.com',
    expectedAudience: 'your-app-id',
    clockSkew: 60 // 1 minute tolerance
  });
  
  if (validationResult.isValid) {
    console.log('Token is valid!');
    console.log('User role:', validationResult.jwt.payload.role);
  } else {
    console.log('Token validation failed:', validationResult.errors);
  }
  
  // Example 3: Check expiration
  if (jwtIsExpired(token)) {
    console.log('Token has expired, need to refresh');
  } else {
    const timeLeft = jwtGetTimeUntilExpiration(token);
    console.log(`Token expires in ${timeLeft} seconds`);
  }
}; 