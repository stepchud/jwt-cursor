"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTDecoder = void 0;
/**
 * JWT Decoder for React Native
 * Implements RFC 7519 JWT specification for decoding and validation
 */
class JWTDecoder {
    /**
     * Decodes a JWT token string into its components
     * @param token - The JWT token string
     * @returns The decoded JWT object
     * @throws Error if the token format is invalid
     */
    static decode(token) {
        if (!token || typeof token !== 'string') {
            throw new Error('JWT token must be a non-empty string');
        }
        const parts = token.split('.');
        if (parts.length !== 2 && parts.length !== 3) {
            throw new Error('JWT token must have 2 or 3 parts separated by dots');
        }
        try {
            const header = this.decodeBase64Url(parts[0]);
            const payload = this.decodeBase64Url(parts[1]);
            const signature = parts.length === 3 ? parts[2] : undefined;
            return {
                header: JSON.parse(header),
                payload: JSON.parse(payload),
                signature
            };
        }
        catch (error) {
            throw new Error(`Failed to decode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Decodes and validates a JWT token
     * @param token - The JWT token string
     * @param options - Validation options
     * @returns JWT decode result with validation information
     */
    static decodeAndValidate(token, options = {}) {
        const jwt = this.decode(token);
        const validation = this.validate(jwt, options);
        return {
            jwt,
            ...validation
        };
    }
    /**
     * Validates a decoded JWT
     * @param jwt - The decoded JWT object
     * @param options - Validation options
     * @returns Validation result
     */
    static validate(jwt, options = {}) {
        const errors = [];
        const currentTime = options.currentTime ?? Math.floor(Date.now() / 1000);
        const clockSkew = options.clockSkew ?? this.DEFAULT_CLOCK_SKEW;
        // Validate header
        if (!jwt.header.alg) {
            errors.push('JWT header must contain an algorithm (alg)');
        }
        // Validate expiration time
        if (options.validateExp !== false && jwt.payload.exp !== undefined) {
            if (currentTime > jwt.payload.exp + clockSkew) {
                errors.push('JWT has expired');
            }
        }
        // Validate not-before time
        if (options.validateNbf !== false && jwt.payload.nbf !== undefined) {
            if (currentTime < jwt.payload.nbf - clockSkew) {
                errors.push('JWT is not yet valid (before nbf time)');
            }
        }
        // Validate issuer
        if (options.expectedIssuer && jwt.payload.iss !== options.expectedIssuer) {
            errors.push(`JWT issuer mismatch. Expected: ${options.expectedIssuer}, Got: ${jwt.payload.iss}`);
        }
        // Validate audience
        if (options.expectedAudience) {
            const expectedAuds = Array.isArray(options.expectedAudience)
                ? options.expectedAudience
                : [options.expectedAudience];
            const tokenAud = Array.isArray(jwt.payload.aud)
                ? jwt.payload.aud
                : jwt.payload.aud ? [jwt.payload.aud] : [];
            const hasValidAudience = expectedAuds.some(expected => tokenAud.includes(expected));
            if (!hasValidAudience) {
                errors.push(`JWT audience mismatch. Expected one of: ${expectedAuds.join(', ')}, Got: ${tokenAud.join(', ')}`);
            }
        }
        const isExpired = options.validateExp !== false &&
            jwt.payload.exp !== undefined &&
            currentTime > jwt.payload.exp + clockSkew;
        const isNotYetValid = options.validateNbf !== false &&
            jwt.payload.nbf !== undefined &&
            currentTime < jwt.payload.nbf - clockSkew;
        return {
            isValid: errors.length === 0,
            errors,
            isExpired,
            isNotYetValid
        };
    }
    /**
     * Decodes a base64url-encoded string
     * @param input - The base64url-encoded string
     * @returns The decoded string
     */
    static decodeBase64Url(input) {
        // Replace URL-safe characters
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if necessary
        const pad = base64.length % 4;
        if (pad) {
            base64 += new Array(5 - pad).join('=');
        }
        try {
            // React Native compatible base64 decoding
            // Try to use atob if available (some React Native environments have it)
            if (typeof globalThis.atob === 'function') {
                return globalThis.atob(base64);
            }
            // Fallback to our custom base64 decoder
            return this.base64Decode(base64);
        }
        catch (error) {
            throw new Error('Invalid base64url encoding');
        }
    }
    /**
     * Simple base64 decoder for React Native
     * @param base64 - The base64 string to decode
     * @returns The decoded string
     */
    static base64Decode(base64) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        let i = 0;
        // Remove padding
        base64 = base64.replace(/=+$/, '');
        while (i < base64.length) {
            const encoded1 = chars.indexOf(base64.charAt(i++));
            const encoded2 = chars.indexOf(base64.charAt(i++));
            const encoded3 = chars.indexOf(base64.charAt(i++));
            const encoded4 = chars.indexOf(base64.charAt(i++));
            const byte1 = (encoded1 << 2) | (encoded2 >> 4);
            const byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            const byte3 = ((encoded3 & 3) << 6) | encoded4;
            result += String.fromCharCode(byte1);
            if (encoded3 !== -1)
                result += String.fromCharCode(byte2);
            if (encoded4 !== -1)
                result += String.fromCharCode(byte3);
        }
        return result;
    }
    /**
     * Gets the payload from a JWT token without validation
     * @param token - The JWT token string
     * @returns The decoded payload
     */
    static getPayload(token) {
        const jwt = this.decode(token);
        return jwt.payload;
    }
    /**
     * Gets the header from a JWT token
     * @param token - The JWT token string
     * @returns The decoded header
     */
    static getHeader(token) {
        const jwt = this.decode(token);
        return jwt.header;
    }
    /**
     * Checks if a JWT token is expired
     * @param token - The JWT token string
     * @param clockSkew - Clock skew tolerance in seconds
     * @returns True if the token is expired
     */
    static isExpired(token, clockSkew = this.DEFAULT_CLOCK_SKEW) {
        try {
            const jwt = this.decode(token);
            if (!jwt.payload.exp) {
                return false; // No expiration time means it never expires
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return currentTime > jwt.payload.exp + clockSkew;
        }
        catch {
            return true; // Invalid tokens are considered expired
        }
    }
    /**
     * Gets the time until a JWT token expires
     * @param token - The JWT token string
     * @returns Time until expiration in seconds, or null if no expiration
     */
    static getTimeUntilExpiration(token) {
        try {
            const jwt = this.decode(token);
            if (!jwt.payload.exp) {
                return null;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExp = jwt.payload.exp - currentTime;
            return timeUntilExp > 0 ? timeUntilExp : 0;
        }
        catch {
            return 0; // Invalid tokens are considered expired
        }
    }
}
exports.JWTDecoder = JWTDecoder;
JWTDecoder.DEFAULT_CLOCK_SKEW = 30; // 30 seconds
