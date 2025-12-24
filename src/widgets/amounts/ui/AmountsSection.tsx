import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { SectionTitle, AmountInput } from '../../../shared/ui';
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

type LastChanged = 'in' | 'out' | null;

export const AmountsSection = () => {
  const [inAmount, setInAmount] = useState(String(EXCHANGE_FORM_CONFIG.inAmount.min));
  const [outAmount, setOutAmount] = useState('');
  const [prices, setPrices] = useState<[string, string] | null>(null);
  const lastChanged = useRef<LastChanged>(null);

  const debouncedInAmount = useDebounce(inAmount, EXCHANGE_FORM_CONFIG.debounceDelay);
  const debouncedOutAmount = useDebounce(outAmount, EXCHANGE_FORM_CONFIG.debounceDelay);

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

    calcExchange(initialValue, null)
      .then((response) => {
        setOutAmount(String(response.outAmount));
        setPrices(response.price);
      })
      .catch((error) => {
        console.error('Failed to load initial exchange rate:', error);
      });
  }, []);

  useEffect(() => {
    if (lastChanged.current !== 'in') return;

    const numericValue = parseFloat(debouncedInAmount);
    if (isNaN(numericValue) || numericValue === 0) return;

    calcExchange(numericValue, null)
      .then((response) => {
        setOutAmount(String(response.outAmount));
        setPrices(response.price);
      })
      .catch((error) => {
        console.error('Failed to calculate exchange:', error);
      });
  }, [debouncedInAmount]);

  useEffect(() => {
    if (lastChanged.current !== 'out') return;

    const numericValue = parseFloat(debouncedOutAmount);
    if (isNaN(numericValue) || numericValue === 0) return;

    calcExchange(null, numericValue)
      .then((response) => {
        setInAmount(String(response.inAmount));
        setPrices(response.price);
      })
      .catch((error) => {
        console.error('Failed to calculate exchange:', error);
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
    </Box>
  );
};
