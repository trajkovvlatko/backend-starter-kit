import IParam from '../interfaces/IParam';

export function withMaxLimit(reqLimit: IParam): number {
  let limit = 10;
  if (typeof reqLimit === 'string') limit = parseInt(reqLimit);
  if (isNaN(limit) || limit > 10) limit = 10;
  return limit;
}

export function withOffset(reqOffset: IParam): number {
  let offset = 0;
  if (typeof reqOffset === 'string') offset = parseInt(reqOffset);
  if (isNaN(offset) || offset < 0) offset = 0;
  return offset;
}

