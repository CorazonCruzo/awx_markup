import { Box, styled } from '@mui/material';
import { WithdrawalMethodSection } from '../../../widgets/withdrawal-method';
import { AmountsSection } from '../../../widgets/amounts';
import { DetailsSection } from '../../../widgets/details';
import { COLORS } from '../../../shared/config/theme';

const PageContainer = styled(Box)({
  maxWidth: 440,
  margin: '0 auto',
  padding: '24px 16px',
  backgroundColor: COLORS.BG_PAGE,
  minHeight: '100vh',
});

const Section = styled(Box)({
  marginBottom: 18,
});

export const WithdrawalPage = () => {
  return (
    <PageContainer>
      <Section>
        <WithdrawalMethodSection />
      </Section>

      <Section>
        <AmountsSection />
      </Section>

      <Section>
        <DetailsSection />
      </Section>
    </PageContainer>
  );
};
