import jwt, { SignOptions } from 'jsonwebtoken';
import { IFTokens, JWTPayload } from '../types/index.js';

// Access token secret & expiration
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'luxdecor_access_secret_key_2026';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '1d';

// Refresh token secret & expiration
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'luxdecor_refresh_secret_key_2026';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Convert duration string to seconds
 */
const parseExpiresInSeconds = (duration: string): number => {
  if (duration.endsWith('d')) return parseInt(duration) * 86400;
  if (duration.endsWith('h')) return parseInt(duration) * 3600;
  if (duration.endsWith('m')) return parseInt(duration) * 60;
  if (duration.endsWith('s')) return parseInt(duration);
  return 86400; // default 1 day
};

/**
 * Generate Access and Refresh Tokens matching Pet_Manager `IFTokens`
 */
export const generateTokens = (payload: JWTPayload): IFTokens => {
  const expiresInSeconds = parseExpiresInSeconds(ACCESS_EXPIRES_IN);

  const accessOptions: SignOptions = {
    expiresIn: ACCESS_EXPIRES_IN as any,
  };

  const refreshOptions: SignOptions = {
    expiresIn: REFRESH_EXPIRES_IN as any,
  };

  const access_token = jwt.sign(payload, ACCESS_SECRET, accessOptions);
  const refresh_token = jwt.sign(payload, REFRESH_SECRET, refreshOptions);

  return {
    access_token,
    refresh_token,
    expires_in: expiresInSeconds,
  };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
};
