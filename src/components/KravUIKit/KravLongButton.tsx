import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KRAVLongButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textTransform: 'none',
  width: '100%',
  fontFamily: 'Inter',
  color: '#fff',
  background: '#FF5C00',
  borderRadius: '4px',
  padding: '10px 16px',
  height: '40px',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: '#FF5C00',
  },
  '&:active': {
    background: '#FF5C00',
  },
  '&.Mui-disabled': {
    background: theme.longButton.disableBg,
    color: theme.longButton.disableText,
    cursor: 'not-allowed',
    pointerEvents: 'auto',
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KRAVLongButton
