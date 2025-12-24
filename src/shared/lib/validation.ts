const NUMERIC_INPUT_PATTERN = /^[0-9]*\.?[0-9]*$/;

export function isValidNumericInput(value: string, maxDecimals?: number): boolean {
  if (!NUMERIC_INPUT_PATTERN.test(value)) return false;

  if (maxDecimals !== undefined) {
    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1) {
      const decimals = value.length - decimalIndex - 1;
      if (decimals > maxDecimals) return false;
    }
  }

  return true;
}

export function getPrecisionFromStep(step: number): number {
  const stepStr = step.toString();
  const decimalIndex = stepStr.indexOf('.');
  if (decimalIndex === -1) return 0;
  return stepStr.length - decimalIndex - 1;
}

export function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function floorToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.floor(value * factor) / factor;
}

export function ceilToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.ceil(value * factor) / factor;
}

export function formatWithPrecision(value: number, precision: number): string {
  return value.toFixed(precision).replace(/\.?0+$/, '');
}
