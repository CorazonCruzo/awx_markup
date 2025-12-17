import { Checkbox, CheckboxProps, styled } from '@mui/material';
import { COLORS } from '../../config/theme';

const CheckboxIcon = styled('span')({
  width: 20,
  height: 20,
  borderRadius: 4,
  border: `2px solid ${COLORS.BORDER_DEFAULT}`,
  backgroundColor: COLORS.BG_CARD,
});

const CheckboxCheckedIcon = styled('span')({
  width: 20,
  height: 20,
  borderRadius: 4,
  backgroundColor: COLORS.PRIMARY_YELLOW,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    width: 10,
    height: 6,
    borderLeft: `2px solid ${COLORS.PRIMARY_BLACK}`,
    borderBottom: `2px solid ${COLORS.PRIMARY_BLACK}`,
    transform: 'rotate(-45deg)',
    marginBottom: 2,
  },
});

export const CustomCheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox
      icon={<CheckboxIcon />}
      checkedIcon={<CheckboxCheckedIcon />}
      disableRipple
      {...props}
      sx={{ padding: '4px', ...props.sx }}
    />
  );
};
