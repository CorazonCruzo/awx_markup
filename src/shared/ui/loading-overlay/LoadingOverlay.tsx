import { Box, CircularProgress, Typography, styled } from '@mui/material';

interface LoadingOverlayProps {
  text: string;
  backgroundColor?: string;
}

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ bgColor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: bgColor ?? 'transparent',
  zIndex: 1,
}));

export const LoadingOverlay = ({ text, backgroundColor }: LoadingOverlayProps) => (
  <Container bgColor={backgroundColor}>
    <CircularProgress size={16} />
    <Typography variant="body2">{text}</Typography>
  </Container>
);
