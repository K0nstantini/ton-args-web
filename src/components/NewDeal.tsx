import { Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from '../css/NewDeal.module.css'
import { Address, Sender } from "@ton/ton";
import { NumberField } from "./NumberField";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useMain } from "../hooks/useMain";
import { useTonConnect } from "../hooks/useTonConnect";

const MIN_TON_AMOUNT = 0.1;
const MAX_FEE = 100; // TODO: fix

type Props = {
  close: () => void,
}

export function NewDeal({ close }: Props) {
  const { sender, connected } = useTonConnect();
  const [addrValue, setAddrValue] = useState('');
  const [address, setAddress] = useState<null | Address>();
  const [amount, setAmount] = useState(MIN_TON_AMOUNT);
  const [fee, setFee] = useState(0);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [newDeal, setNewDeal] = useState(false);
  const mainContract = useMain(newDeal);

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
    setCanCreate(!newDeal && address != null && amount >= MIN_TON_AMOUNT && fee >= 0 && fee <= MAX_FEE)
  }, [address, amount, fee, newDeal]);

  useEffect(() => {
    if (!newDeal || !mainContract || !address) return;
    setNewDeal(false);
    if (connected) {
      mainContract.sendNewDeal(sender, address, amount, fee);
    } else {
      alert("Wallet not connected");
    }
  }, [mainContract, newDeal]);

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
        onClick={() => setNewDeal(true)}>
        Create
      </Button>
    </Paper>

  );
};

