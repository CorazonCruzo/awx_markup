import {
  Box,
  FormControlLabel,
  RadioGroup,
  styled,
} from '@mui/material';
import { SectionTitle, FormTextField, CustomCheckbox, CustomRadio } from '../../../shared/ui';
import { COLORS } from '../../../shared/config/theme';

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
});

const FieldCard = styled(Box)({
  backgroundColor: COLORS.BG_CARD,
  borderRadius: 8,
  border: `1px solid ${COLORS.BORDER_DEFAULT}`,
  padding: '0 16px',
  marginBottom: 16,
});

const SimpleFieldCard = styled(FieldCard)({
  padding: '4px 16px',
});

const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: 0,
  marginRight: 0,
  gap: 8,
  '& .MuiFormControlLabel-label': {
    fontSize: '16px',
    color: COLORS.TEXT_SECONDARY,
  },
});

const RadioLabel = styled(FormControlLabel)({
  marginLeft: 0,
  marginRight: 0,
  gap: 10,
  '& .MuiFormControlLabel-label': {
    fontSize: '16px',
    color: COLORS.TEXT_PRIMARY,
  },
  '& .MuiRadio-root': {
    padding: 0,
    '& .MuiSvgIcon-root': {
      width: 22,
      height: 22,
    },
  },
  '&:first-of-type': {
    marginRight: 32,
  },
});

const RadioSection = styled(Box)({
  paddingTop: 14,
  paddingBottom: 6,
});

export const DetailsSection = () => {
  return (
    <Box>
      <Header>
        <SectionTitle>Реквизиты</SectionTitle>
        <StyledFormControlLabel
          control={<CustomCheckbox defaultChecked size="small" />}
          label="Сохранить реквизиты"
          labelPlacement="start"
        />
      </Header>

      <FieldCard>
        <RadioSection>
          <RadioGroup defaultValue="card" row>
            <RadioLabel
              value="card"
              control={<CustomRadio size="small" />}
              label="Номер карты"
            />
            <RadioLabel
              value="contract"
              control={<CustomRadio size="small" />}
              label="Номер договора"
            />
          </RadioGroup>
        </RadioSection>
        <Box sx={{ paddingBottom: '4px', marginTop: '-4px' }}>
          <FormTextField label="Номер карты" />
        </Box>
      </FieldCard>

      <SimpleFieldCard>
        <FormTextField label="ФИО владельца" />
      </SimpleFieldCard>

      <SimpleFieldCard>
        <FormTextField label="Адрес" />
      </SimpleFieldCard>
    </Box>
  );
};
