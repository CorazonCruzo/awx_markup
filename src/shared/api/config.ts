export const API_CONFIG = {
  PAIR_ID: 133,
  CALC_ENDPOINT: '/b2api/change/user/pair/calc',
} as const;

export const EXCHANGE_FORM_CONFIG = {
  inAmount: {
    min: 10000,
    max: 70000000,
    step: 100,
  },
  outAmount: {
    step: 0.000001,
  },
  debounceDelay: 300,
} as const;