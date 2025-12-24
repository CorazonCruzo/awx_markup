import { useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { SectionTitle, AmountInput } from '../../../shared/ui';
import { EXCHANGE_FORM_CONFIG } from '../../../shared/api';

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

export const AmountsSection = () => {
  const [inAmount, setInAmount] = useState(String(EXCHANGE_FORM_CONFIG.inAmount.min));
  const [outAmount, setOutAmount] = useState('');

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
          onChange={setInAmount}
          min={EXCHANGE_FORM_CONFIG.inAmount.min}
          max={EXCHANGE_FORM_CONFIG.inAmount.max}
          step={EXCHANGE_FORM_CONFIG.inAmount.step}
        />
        <AmountInput
          currencyName="Рубль"
          currencyCode="RUR"
          value={outAmount}
          onChange={setOutAmount}
          step={EXCHANGE_FORM_CONFIG.outAmount.step}
        />
      </InputsContainer>
    </Box>
  );
};
