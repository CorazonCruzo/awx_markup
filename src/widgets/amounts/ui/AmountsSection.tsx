import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { SectionTitle, AmountInput, LoadingOverlay } from '../../../shared/ui';
import { COLORS } from '../../../shared/config/theme';
import { EXCHANGE_FORM_CONFIG, calcExchange } from '../../../shared/api';
import { useDebounce } from '../../../shared/hooks';

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

  const isInAmountBelowMin = useMemo(() => {
    if (inAmount === '') return true;
    const numericValue = parseFloat(inAmount);
    if (isNaN(numericValue)) return true;
    return numericValue < EXCHANGE_FORM_CONFIG.inAmount.min;
  }, [inAmount]);


  const outAmountLimits = useMemo(() => {
    if (!prices) return { min: undefined, max: undefined };

    const rate = parseFloat(prices[0]);

    return {
      min: EXCHANGE_FORM_CONFIG.inAmount.min * rate,
      max: EXCHANGE_FORM_CONFIG.inAmount.max * rate,
    };
  }, [prices]);

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

    const numericValue = parseFloat(debouncedInAmount);
    if (isNaN(numericValue) || numericValue === 0) return;
    if (numericValue < EXCHANGE_FORM_CONFIG.inAmount.min) return;

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
    if (lastChanged.current !== 'out') return;

    const numericValue = parseFloat(debouncedOutAmount);
    if (isNaN(numericValue) || numericValue === 0) return;

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
    lastChanged.current = 'in';
    setInAmount(value);

    const numericValue = parseFloat(value);
    const isBelowMin = value === '' || isNaN(numericValue) || numericValue < EXCHANGE_FORM_CONFIG.inAmount.min;

    if (isBelowMin) {
      setOutAmount('');
    }
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
            value={isInAmountBelowMin ? '' : outAmount}
            onChange={handleOutAmountChange}
            min={outAmountLimits.min}
            max={outAmountLimits.max}
            step={EXCHANGE_FORM_CONFIG.outAmount.step}
            disabled={isInAmountBelowMin}
          />
        </InputsContainer>

        {isInAmountBelowMin && (
          <ErrorMessage>
            Минимальная сумма: {EXCHANGE_FORM_CONFIG.inAmount.min.toLocaleString('ru-RU')}
          </ErrorMessage>
        )}
      </ContentWrapper>
    </Box>
  );
};
