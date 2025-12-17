import { Typography } from '@mui/material';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <Typography variant="h6" component="h2">
      {children}
    </Typography>
  );
};
