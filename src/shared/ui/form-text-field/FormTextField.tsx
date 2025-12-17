import { Box, styled } from '@mui/material';
import { COLORS } from '../../config/theme';
import { EditIcon } from '../icons';

interface FormTextFieldProps {
  label: string;
  value?: string;
}

const Container = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 0',
  backgroundColor: COLORS.BG_CARD,
});

const StyledInput = styled('input')({
  border: 'none',
  outline: 'none',
  fontSize: '20px',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  width: '100%',
  color: COLORS.TEXT_PRIMARY,
  '&::placeholder': {
    color: COLORS.TEXT_PRIMARY,
  },
  '&:focus': {
    outline: 'none',
  },
});

const StyledEditIcon = styled(EditIcon)({
  fontSize: 30,
  color: COLORS.TEXT_PRIMARY,
});

export const FormTextField = ({ label, value = '' }: FormTextFieldProps) => {
  return (
    <Container>
      <StyledInput
        type="text"
        placeholder={label}
        value={value}
        readOnly
      />
      <StyledEditIcon />
    </Container>
  );
};
