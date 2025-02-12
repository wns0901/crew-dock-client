import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const DividerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  margin: '20px 0',
});

const Line = styled(Box)({
  flexGrow: 1,
  height: '1px',
  backgroundColor: 'rgba(0, 0, 0, 0.12)'
});

const Text = styled(Typography)({
  margin: '0 16px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontSize: '0.875rem'
});

const DividerWithText = ({ content }) => {
  return (
    <DividerContainer>
      <Line />
      <Text>{content}</Text>
      <Line />
    </DividerContainer>
  );
};

export default DividerWithText;