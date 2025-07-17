import { JWT, JWTHeader, JWTPayload, JWTDecodeResult, JWTValidationOptions } from './types';
/**
 * JWT Decoder for React Native
 * Implements RFC 7519 JWT specification for decoding and validation
 */
export declare class JWTDecoder {
    private static readonly DEFAULT_CLOCK_SKEW;
    /**
     * Decodes a JWT token string into its components
     * @param token - The JWT token string
     * @returns The decoded JWT object
     * @throws Error if the token format is invalid
     */
    static decode(token: string): JWT;
    /**
     * Decodes and validates a JWT token
     * @param token - The JWT token string
     * @param options - Validation options
     * @returns JWT decode result with validation information
     */
    static decodeAndValidate(token: string, options?: JWTValidationOptions): JWTDecodeResult;
    /**
     * Validates a decoded JWT
     * @param jwt - The decoded JWT object
     * @param options - Validation options
     * @returns Validation result
     */
    static validate(jwt: JWT, options?: JWTValidationOptions): Omit<JWTDecodeResult, 'jwt'>;
    /**
     * Decodes a base64url-encoded string
     * @param input - The base64url-encoded string
     * @returns The decoded string
     */
    private static decodeBase64Url;
    /**
     * Simple base64 decoder for React Native
     * @param base64 - The base64 string to decode
     * @returns The decoded string
     */
    private static base64Decode;
    /**
     * Gets the payload from a JWT token without validation
     * @param token - The JWT token string
     * @returns The decoded payload
     */
    static getPayload(token: string): JWTPayload;
    /**
     * Gets the header from a JWT token
     * @param token - The JWT token string
     * @returns The decoded header
     */
    static getHeader(token: string): JWTHeader;
    /**
     * Checks if a JWT token is expired
     * @param token - The JWT token string
     * @param clockSkew - Clock skew tolerance in seconds
     * @returns True if the token is expired
     */
    static isExpired(token: string, clockSkew?: number): boolean;
    /**
     * Gets the time until a JWT token expires
     * @param token - The JWT token string
     * @returns Time until expiration in seconds, or null if no expiration
     */
    static getTimeUntilExpiration(token: string): number | null;
}
