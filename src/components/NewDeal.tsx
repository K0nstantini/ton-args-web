import { Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from '../css/NewDeal.module.css'
import { Address } from "@ton/ton";
import { NumberField } from "./NumberField";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const MIN_TON_AMOUNT = 1;
const MAX_FEE = 100; // TODO: fix

type Props = {
  close: () => void,
}

export function NewDeal({ close }: Props) {
  const [addrValue, setAddrValue] = useState('');
  const [address, setAddress] = useState<null | Address>();
  const [amount, setAmount] = useState(MIN_TON_AMOUNT);
  const [fee, setFee] = useState(0);

  const [invalidAddress, setInvalidAddress] = useState(false);
  const [canCreate, setCanCreate] = useState(false);


  useEffect(() => {
    try {
      setAddress(Address.parse(addrValue));
    } catch {
      setAddress(null);
    }
  }, [addrValue]);

  useEffect(() => {
    setInvalidAddress(!address && addrValue.length > 0)
  }, [addrValue, address]);

  useEffect(() => {
    setCanCreate(address != null && amount >= MIN_TON_AMOUNT && fee >= 0 && fee <= MAX_FEE)
  }, [address, amount, fee]);

  const newDeal = () => {
  }

  return (
    <Paper
      className={styles.paper}
      elevation={3}>
      <div className={styles.close}>
        <IconButton
          aria-label="close"
          onClick={close}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <Typography
        className={styles.header}
        component="h2"
        variant="h6"
        gutterBottom>
        New deal
      </Typography>
      <TextField
        className={styles.address}
        label={invalidAddress ? 'Invalid address' : 'Arbiter address'}
        error={invalidAddress}
        variant="outlined"
        onChange={e => setAddrValue(e.target.value)} />
      <div className={styles.amountAndFee} >
        <NumberField
          className={styles.amount}
          label="Amount, TON"
          onChange={setAmount} />
        <NumberField
          className={styles.fee}
          label="Arbiter Fee, %"
          onChange={setFee} />
      </div>
      <Button
        className={styles.create}
        variant="outlined"
        disabled={!canCreate}
        onClick={newDeal}>
        Create
      </Button>
    </Paper>

  );
};

