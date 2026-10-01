import { Response } from 'express';
import { ResponseAPI } from '../types/index.js';
import { nanoid } from 'nanoid';

/**
 * Send standard success response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string = 'Thành công',
  data: T = null as unknown as T,
  code: number = 200,
  extra: Partial<ResponseAPI<T>> = {}
): Response => {
  const response: ResponseAPI<T> = {
    error: false,
    code,
    message,
    data,
    traceId: `tr_${nanoid(8)}`,
    ...extra,
  };
  return res.status(code).json(response);
};

/**
 * Send standard error response
 */
export const sendError = (
  res: Response,
  message: string = 'Đã có lỗi xảy ra',
  code: number = 500,
  traceId?: string
): Response => {
  const response: ResponseAPI<null> = {
    error: true,
    code,
    message,
    data: null,
    traceId: traceId || `tr_${nanoid(8)}`,
  };
  return res.status(code).json(response);
};
