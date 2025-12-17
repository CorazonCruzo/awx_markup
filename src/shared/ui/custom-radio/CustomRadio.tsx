import { Radio, RadioProps, styled } from '@mui/material';
import { COLORS } from '../../config/theme';

const RadioIcon = styled('span')({
  width: 22,
  height: 22,
  borderRadius: '50%',
  border: `2px solid ${COLORS.TEXT_PRIMARY}`,
  backgroundColor: COLORS.BG_CARD,
  boxSizing: 'border-box',
});

const RadioCheckedIcon = styled('span')({
  width: 22,
  height: 22,
  borderRadius: '50%',
  border: `5px solid ${COLORS.PRIMARY_YELLOW}`,
  backgroundColor: COLORS.PRIMARY_BLACK,
  boxSizing: 'border-box',
});

export const CustomRadio = (props: RadioProps) => {
  return (
    <Radio
      icon={<RadioIcon />}
      checkedIcon={<RadioCheckedIcon />}
      disableRipple
      {...props}
      sx={{ padding: '8px' }}
    />
  );
};
