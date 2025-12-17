import { Box, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import { SectionTitle } from '../../../shared/ui';

const ButtonsContainer = styled(Box)({
  marginTop: 20,
});

export const WithdrawalMethodSection = () => {
  return (
    <Box>
      <SectionTitle>Способ вывода</SectionTitle>
      <ButtonsContainer>
        <ToggleButtonGroup
          value="banks"
          exclusive
        >
          <ToggleButton value="banks">
            Банки
          </ToggleButton>
          <ToggleButton value="cash">
            Наличные
          </ToggleButton>
          <ToggleButton value="courier">
            Курьер
          </ToggleButton>
        </ToggleButtonGroup>
      </ButtonsContainer>
    </Box>
  );
};
