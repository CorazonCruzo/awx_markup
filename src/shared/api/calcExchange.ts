import { CalcRequest, CalcResponse } from './types';
import { API_CONFIG } from './config';

export async function calcExchange(
  inAmount: number | null,
  outAmount: number | null
): Promise<CalcResponse> {
  const request: CalcRequest = {
    pairId: API_CONFIG.PAIR_ID,
    inAmount,
    outAmount,
  };

  const response = await fetch(API_CONFIG.CALC_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
