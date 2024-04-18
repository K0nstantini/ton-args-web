import { Typography, useMediaQuery, useTheme } from '@mui/material';
import styles from '../css/Header.module.css'

export const Header = () => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div className={styles.header}>
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ typography: { sm: 'h4', xs: 'h5' } }}
      >
        Bet on Everything with
      </Typography>
      <Typography
        className={styles.tonLabel}
        component="h2"
        variant={isWideScreen ? "h4" : "h5"}
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        TON
      </Typography>
    </div>
  );
};
