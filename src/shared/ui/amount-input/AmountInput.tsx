import { ChangeEvent } from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { COLORS, MEDIA } from '../../config/theme';
import { isValidNumericInput, getPrecisionFromStep, roundToPrecision } from '../../lib';

interface AmountInputProps {
  currencyName: string;
  currencyCode: string;
  value: string;
  onChange: (value: string) => void;
  step: number;
  min?: number;
  max?: number;
}

const Wrapper = styled(Box)({
  flex: 1,
  outline: 'none',
  outlineOffset: 0,
  '&:focus-within': {
    outline: `3px solid ${COLORS.BORDER_FOCUS}`,
  },
});

const Container = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '28px 8px 12px 8px',
  backgroundColor: COLORS.BG_CARD,
  borderRadius: 12,
  position: 'relative',
  [MEDIA.SMALL]: {
    padding: '26px 6px 10px 6px',
  },
});

const CurrencyLabel = styled(Typography)({
  position: 'absolute',
  top: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '11px',
  color: COLORS.TEXT_SECONDARY,
  whiteSpace: 'nowrap',
});

const StyledInput = styled('input')({
  border: 'none',
  outline: 'none',
  fontSize: '15px',
  fontWeight: 400,
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  width: '100%',
  minWidth: 0,
  textAlign: 'center',
  color: COLORS.TEXT_PRIMARY,
  padding: 0,
  '&:focus': {
    outline: 'none',
  },
  [MEDIA.SMALL]: {
    fontSize: '13px',
  },
});

const ActionButton = styled(IconButton)({
  width: 32,
  height: 32,
  backgroundColor: COLORS.BG_PAGE,
  borderRadius: '50%',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: COLORS.BORDER_DEFAULT,
  },
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'auto',
    backgroundColor: COLORS.BG_PAGE,
    opacity: 0.5,
    '&:hover': {
      backgroundColor: COLORS.BG_PAGE,
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: 22,
    color: COLORS.TEXT_PRIMARY,
  },
  [MEDIA.SMALL]: {
    width: 24,
    height: 24,
    '& .MuiSvgIcon-root': {
      fontSize: 16,
    },
  },
});

export const AmountInput = ({
  currencyName,
  currencyCode,
  value,
  onChange,
  step,
  min,
  max,
}: AmountInputProps) => {
  const numericValue = parseFloat(value) || 0;
  const precision = getPrecisionFromStep(step);

  const isDecrementDisabled = min !== undefined && roundToPrecision(numericValue - step, precision) < min;
  const isIncrementDisabled = max !== undefined && roundToPrecision(numericValue + step, precision) > max;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (isValidNumericInput(newValue)) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = roundToPrecision(numericValue + step, precision);
    if (max === undefined || newValue <= max) {
      onChange(String(newValue));
    }
  };

  const handleDecrement = () => {
    const newValue = roundToPrecision(numericValue - step, precision);
    if (min === undefined || newValue >= min) {
      onChange(String(newValue));
    }
  };

  return (
    <Wrapper>
      <Container>
        <CurrencyLabel>{currencyName}, {currencyCode}</CurrencyLabel>

        <ActionButton size="small" onClick={handleDecrement} disabled={isDecrementDisabled}>
          <RemoveIcon />
        </ActionButton>

        <StyledInput
          type="text"
          value={value}
          onChange={handleInputChange}
        />

        <ActionButton size="small" onClick={handleIncrement} disabled={isIncrementDisabled}>
          <AddIcon />
        </ActionButton>
      </Container>
    </Wrapper>
  );
};
