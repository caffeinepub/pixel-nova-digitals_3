/**
 * Helper to normalize admin auth results from various response formats.
 * Supports both Result-style ({__kind__:'ok'|'err'}) and Motoko-variant-style ({ok:...}/{err:...}).
 */

type ResultStyleResponse = 
  | { __kind__: 'ok'; ok: string }
  | { __kind__: 'err'; err: string };

type VariantStyleResponse = 
  | { ok: string }
  | { err: string };

type UnknownResponse = any;

export interface NormalizedAuthResult {
  okToken?: string;
  errMessage?: string;
}

export function normalizeAdminAuthResult(response: UnknownResponse): NormalizedAuthResult {
  // Handle null/undefined
  if (!response) {
    return { errMessage: 'No response from server' };
  }

  // Result-style: { __kind__: 'ok', ok: token } or { __kind__: 'err', err: message }
  if (typeof response === 'object' && '__kind__' in response) {
    if (response.__kind__ === 'ok' && 'ok' in response) {
      const token = response.ok;
      if (typeof token === 'string' && token.length > 0) {
        return { okToken: token };
      }
      return { errMessage: 'Empty token received' };
    }
    if (response.__kind__ === 'err' && 'err' in response) {
      return { errMessage: String(response.err || 'Authentication failed') };
    }
  }

  // Motoko variant-style: { ok: token } or { err: message }
  if (typeof response === 'object') {
    if ('ok' in response && !('err' in response)) {
      const token = response.ok;
      if (typeof token === 'string' && token.length > 0) {
        return { okToken: token };
      }
      return { errMessage: 'Empty token received' };
    }
    if ('err' in response && !('ok' in response)) {
      return { errMessage: String(response.err || 'Authentication failed') };
    }
  }

  // Unknown format
  return { errMessage: 'Unexpected response format from server' };
}
