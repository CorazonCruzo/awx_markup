import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { SectionTitle, AmountInput, LoadingOverlay } from '../../../shared/ui';
import { COLORS } from '../../../shared/config/theme';
import { EXCHANGE_FORM_CONFIG, calcExchange } from '../../../shared/api';
import { useDebounce } from '../../../shared/hooks';
import { getPrecisionFromStep, floorToPrecision, ceilToPrecision, formatWithPrecision } from '../../../shared/lib';

const LabelsRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 20,
  marginBottom: 10,
});

const InputsContainer = styled(Box)({
  display: 'flex',
  gap: 12,
});

const ErrorMessage = styled(Typography)({
  color: COLORS.TEXT_SECONDARY,
  fontSize: '13px',
  marginTop: 8,
  textAlign: 'center',
});

const ContentWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLoading',
})<{ isLoading: boolean }>(({ isLoading }) => ({
  position: 'relative',
  ...(isLoading && {
    '& *': {
      outline: 'none !important',
    },
  }),
}));


type LastChanged = 'in' | 'out' | null;

export const AmountsSection = () => {
  const [inAmount, setInAmount] = useState(String(EXCHANGE_FORM_CONFIG.inAmount.min));
  const [outAmount, setOutAmount] = useState('');
  const [prices, setPrices] = useState<[string, string] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChanged, setLastChanged] = useState<LastChanged>(null);
  const lastChangedRef = useRef<LastChanged>(null);

  const debouncedInAmount = useDebounce(inAmount, EXCHANGE_FORM_CONFIG.debounceDelay);
  const debouncedOutAmount = useDebounce(outAmount, EXCHANGE_FORM_CONFIG.debounceDelay);

  const inAmountStatus = useMemo(() => {
    if (inAmount === '' || inAmount === '.') return 'empty';
    const numericValue = parseFloat(inAmount);
    if (isNaN(numericValue) || numericValue === 0) return 'empty';
    if (numericValue < EXCHANGE_FORM_CONFIG.inAmount.min) return 'below_min';
    if (numericValue > EXCHANGE_FORM_CONFIG.inAmount.max) return 'above_max';
    return 'valid';
  }, [inAmount]);

  const isInAmountInvalid = inAmountStatus === 'below_min' || inAmountStatus === 'above_max';

  const outPrecision = getPrecisionFromStep(EXCHANGE_FORM_CONFIG.outAmount.step);

  const outAmountLimits = useMemo(() => {
    if (!prices) return { min: undefined, max: undefined };

    const rate = parseFloat(prices[0]);

    return {
      min: floorToPrecision(EXCHANGE_FORM_CONFIG.inAmount.min * rate, outPrecision),
      max: ceilToPrecision(EXCHANGE_FORM_CONFIG.inAmount.max * rate, outPrecision),
    };
  }, [prices, outPrecision]);

  const outAmountStatus = useMemo(() => {
    if (outAmount === '' || outAmount === '.') return 'empty';
    const numericValue = parseFloat(outAmount);
    if (isNaN(numericValue) || numericValue === 0) return 'empty';

    const { min, max } = outAmountLimits;
    if (min !== undefined && numericValue < min) return 'below_min';
    if (max !== undefined && numericValue > max) return 'above_max';
    return 'valid';
  }, [outAmount, outAmountLimits]);

  const isOutAmountInvalid = outAmountStatus === 'below_min' || outAmountStatus === 'above_max';

  const hasInAmountError = isInAmountInvalid && lastChanged === 'in';
  const hasOutAmountError = isOutAmountInvalid && lastChanged === 'out';

  useEffect(() => {
    const initialValue = EXCHANGE_FORM_CONFIG.inAmount.min;

    setIsLoading(true);
    calcExchange(initialValue, null)
      .then((response) => {
        setOutAmount(String(response.outAmount));
        setPrices(response.price);
      })
      .catch((error) => {
        console.error('Failed to load initial exchange rate:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (lastChangedRef.current !== 'in') return;

    if (debouncedInAmount === '' || debouncedInAmount === '.') {
      setOutAmount('');
      return;
    }

    const numericValue = parseFloat(debouncedInAmount);
    if (isNaN(numericValue) || numericValue === 0) {
      setOutAmount('');
      return;
    }

    const { min, max } = EXCHANGE_FORM_CONFIG.inAmount;

    if (numericValue < min || numericValue > max) {
      setOutAmount('');
      return;
    }

    setIsLoading(true);
    calcExchange(numericValue, null)
      .then((response) => {
        setOutAmount(String(response.outAmount));
        setPrices(response.price);
      })
      .catch((error) => {
        console.error('Failed to calculate exchange:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedInAmount]);

  useEffect(() => {
    if (lastChangedRef.current !== 'out') return;

    if (debouncedOutAmount === '' || debouncedOutAmount === '.') {
      setInAmount('');
      return;
    }

    const numericValue = parseFloat(debouncedOutAmount);
    if (isNaN(numericValue) || numericValue === 0) {
      setInAmount('');
      return;
    }

    if (prices) {
      const rate = parseFloat(prices[0]);
      const min = floorToPrecision(EXCHANGE_FORM_CONFIG.inAmount.min * rate, outPrecision);
      const max = ceilToPrecision(EXCHANGE_FORM_CONFIG.inAmount.max * rate, outPrecision);

      if (numericValue < min || numericValue > max) {
        setInAmount('');
        return;
      }
    }

    setIsLoading(true);
    calcExchange(null, numericValue)
      .then((response) => {
        setInAmount(String(response.inAmount));
        setPrices(response.price);
      })
      .catch((error) => {
        console.error('Failed to calculate exchange:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedOutAmount]);

  const handleInAmountChange = (value: string) => {
    lastChangedRef.current = 'in';
    setLastChanged('in');
    setInAmount(value);
  };

  const handleOutAmountChange = (value: string) => {
    lastChangedRef.current = 'out';
    setLastChanged('out');
    setOutAmount(value);
  };

  return (
    <Box>
      <SectionTitle>Объемы</SectionTitle>

      <ContentWrapper isLoading={isLoading}>
        {isLoading && <LoadingOverlay text="Вычисляем сумму по текущему курсу" backgroundColor={COLORS.BG_PAGE} />}

        <LabelsRow>
          <Typography variant="subtitle2">
            Отдаете (лот 1000)
          </Typography>
          <Typography variant="subtitle2">
            Получаете (лот 1000)
          </Typography>
        </LabelsRow>

        <InputsContainer>
          <AmountInput
            currencyName="Ethereum"
            currencyCode="ETH"
            value={inAmount}
            onChange={handleInAmountChange}
            min={EXCHANGE_FORM_CONFIG.inAmount.min}
            max={EXCHANGE_FORM_CONFIG.inAmount.max}
            step={EXCHANGE_FORM_CONFIG.inAmount.step}
            hasError={hasInAmountError}
          />
          <AmountInput
            currencyName="Рубль"
            currencyCode="RUR"
            value={outAmount}
            onChange={handleOutAmountChange}
            min={outAmountLimits.min}
            max={outAmountLimits.max}
            step={EXCHANGE_FORM_CONFIG.outAmount.step}
            hasError={hasOutAmountError}
          />
        </InputsContainer>

        {hasInAmountError && inAmountStatus === 'below_min' && (
          <ErrorMessage>
            Минимум для отдачи: {EXCHANGE_FORM_CONFIG.inAmount.min.toLocaleString('ru-RU')}
          </ErrorMessage>
        )}
        {hasInAmountError && inAmountStatus === 'above_max' && (
          <ErrorMessage>
            Максимум для отдачи: {EXCHANGE_FORM_CONFIG.inAmount.max.toLocaleString('ru-RU')}
          </ErrorMessage>
        )}
        {hasOutAmountError && outAmountStatus === 'below_min' && outAmountLimits.min !== undefined && (
          <ErrorMessage>
            Минимум для получения: {formatWithPrecision(outAmountLimits.min, outPrecision)}
          </ErrorMessage>
        )}
        {hasOutAmountError && outAmountStatus === 'above_max' && outAmountLimits.max !== undefined && (
          <ErrorMessage>
            Максимум для получения: {formatWithPrecision(outAmountLimits.max, outPrecision)}
          </ErrorMessage>
        )}
      </ContentWrapper>
    </Box>
  );
};
