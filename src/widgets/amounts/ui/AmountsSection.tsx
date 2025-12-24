import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { SectionTitle, AmountInput, LoadingOverlay } from '../../../shared/ui';
import { COLORS } from '../../../shared/config/theme';
import { EXCHANGE_FORM_CONFIG, calcExchange } from '../../../shared/api';
import { useDebounce } from '../../../shared/hooks';
import { roundToPrecision, getPrecisionFromStep } from '../../../shared/lib';

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
  const lastChanged = useRef<LastChanged>(null);

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

  const isInAmountEmpty = inAmountStatus === 'empty';

  const outPrecision = getPrecisionFromStep(EXCHANGE_FORM_CONFIG.outAmount.step);

  const outAmountLimits = useMemo(() => {
    if (isInAmountEmpty || !prices) return { min: undefined, max: undefined };

    const rate = parseFloat(prices[0]);

    return {
      min: roundToPrecision(EXCHANGE_FORM_CONFIG.inAmount.min * rate, outPrecision),
      max: roundToPrecision(EXCHANGE_FORM_CONFIG.inAmount.max * rate, outPrecision),
    };
  }, [prices, isInAmountEmpty, outPrecision]);

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
    if (lastChanged.current !== 'in') return;

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
    let valueToSend = numericValue;
    let shouldUpdateInput = false;

    if (numericValue < min) {
      valueToSend = min;
      shouldUpdateInput = true;
    } else if (numericValue > max) {
      valueToSend = max;
      shouldUpdateInput = true;
    }

    setIsLoading(true);
    calcExchange(valueToSend, null)
      .then((response) => {
        setOutAmount(String(response.outAmount));
        setPrices(response.price);
        if (shouldUpdateInput) {
          setInAmount(String(valueToSend));
        }
      })
      .catch((error) => {
        console.error('Failed to calculate exchange:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedInAmount]);

  useEffect(() => {
    if (lastChanged.current !== 'out') return;

    if (debouncedOutAmount === '' || debouncedOutAmount === '.') {
      return;
    }

    const numericValue = parseFloat(debouncedOutAmount);
    if (isNaN(numericValue) || numericValue === 0) return;

    const { min, max } = outAmountLimits;

    let valueToSend = numericValue;
    let shouldUpdateInput = false;

    if (min !== undefined && numericValue < min) {
      valueToSend = min;
      shouldUpdateInput = true;
    } else if (max !== undefined && numericValue > max) {
      valueToSend = max;
      shouldUpdateInput = true;
    }

    setIsLoading(true);
    calcExchange(null, valueToSend)
      .then((response) => {
        setInAmount(String(response.inAmount));
        setPrices(response.price);
        if (shouldUpdateInput) {
          setOutAmount(String(valueToSend));
        }
      })
      .catch((error) => {
        console.error('Failed to calculate exchange:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedOutAmount]);

  const handleInAmountChange = (value: string) => {
    lastChanged.current = 'in';
    setInAmount(value);
  };

  const handleOutAmountChange = (value: string) => {
    lastChanged.current = 'out';
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
          />
          <AmountInput
            currencyName="Рубль"
            currencyCode="RUR"
            value={outAmount}
            onChange={handleOutAmountChange}
            min={outAmountLimits.min}
            max={outAmountLimits.max}
            step={EXCHANGE_FORM_CONFIG.outAmount.step}
          />
        </InputsContainer>

        {inAmountStatus === 'below_min' && (
          <ErrorMessage>
            Минимум для отдачи: {EXCHANGE_FORM_CONFIG.inAmount.min.toLocaleString('ru-RU')}
          </ErrorMessage>
        )}
        {inAmountStatus === 'above_max' && (
          <ErrorMessage>
            Максимум для отдачи: {EXCHANGE_FORM_CONFIG.inAmount.max.toLocaleString('ru-RU')}
          </ErrorMessage>
        )}
      </ContentWrapper>
    </Box>
  );
};
