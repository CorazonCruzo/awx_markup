import { Box, IconButton, Typography, styled } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { COLORS } from '../../config/theme';

interface AmountInputProps {
  currencyName: string;
  currencyCode: string;
  value: string;
  isSelected?: boolean;
}

const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ isSelected }) => ({
  flex: 1,
  outline: isSelected ? `3px solid ${COLORS.BORDER_FOCUS}` : 'none',
  outlineOffset: 0,
}));

const Container = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '28px 8px 12px 8px',
  backgroundColor: COLORS.BG_CARD,
  borderRadius: 12,
  position: 'relative',
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
  textAlign: 'center',
  color: COLORS.TEXT_PRIMARY,
  padding: 0,
  '&:focus': {
    outline: 'none',
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
  '& .MuiSvgIcon-root': {
    fontSize: 22,
    color: COLORS.TEXT_PRIMARY,
  },
});

export const AmountInput = ({
  currencyName,
  currencyCode,
  value,
  isSelected = false,
}: AmountInputProps) => {
  return (
    <Wrapper isSelected={isSelected}>
      <Container>
        <CurrencyLabel>{currencyName}, {currencyCode}</CurrencyLabel>

        <ActionButton size="small">
          <RemoveIcon />
        </ActionButton>

        <StyledInput
          type="text"
          value={value}
          readOnly
        />

        <ActionButton size="small">
          <AddIcon />
        </ActionButton>
      </Container>
    </Wrapper>
  );
};
