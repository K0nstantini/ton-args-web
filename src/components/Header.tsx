import { Typography } from '@mui/material';
import styles from '../css/Header.module.css'

export const Header = () => {
  return (
    <div className={styles.header}>
      <Typography
        component="h2"
        variant="h4"
        gutterBottom>
        Bet on Everything with
      </Typography>
      <Typography
        className={styles.tonLabel}
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        TON
      </Typography>
    </div>
  );
};
