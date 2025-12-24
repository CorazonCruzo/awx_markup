import { Box, Typography, styled } from '@mui/material';
import { SectionTitle, AmountInput } from '../../../shared/ui';

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
          value="1 300.00000"
        />
        <AmountInput
          currencyName="Рубль"
          currencyCode="RUR"
          value="1 200.00"
        />
      </InputsContainer>
    </Box>
  );
};
