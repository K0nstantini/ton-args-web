import { useEffect, useState } from "react";
import styles from '../css/ExistedDeal.module.css'
import { NumberField } from "./NumberField";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Address, OpenedContract, address } from "@ton/core";
import Deal, { DealInfo, DealUser } from "../contracts/deal";
import { Button, Checkbox, FormControlLabel, FormHelperText, IconButton, Paper, SvgIcon, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonAddress } from "@tonconnect/ui-react";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

type Props = {
  deal: OpenedContract<Deal>,
  dealInfo: DealInfo,
  close: () => void,
}

export function ExistedDeal({ deal, dealInfo, close }: Props) {
  const { sender, connected } = useTonConnect();
  const connectedAddress = useTonAddress();

  const [info, setInfo] = useState(dealInfo);
  const [users, setUsers] = useState(dealInfo.users.map(u => new UserInfo(u, connectedAddress)));
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isArbiter, setIsArbiter] = useState(false);
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState(0);
  const [approve, setApprove] = useState(info.users.length > 1);

  useEffect(() => {
    setStatus(info.draw ? 'Draw. You can take your money back' : (info.approved ? 'Awaiting results' : 'Active'));
  }, [info]);

  useEffect(() => {
    setIsArbiter(isCurrentUser(info.arbiter, connectedAddress));
    setUsers(info.users.map(u => new UserInfo(u, connectedAddress)));
  }, [connectedAddress, info]);

  useEffect(() => {
    setUser(users.find(u => u.connected) || null);
  }, [users]);

  const refresh = async () => {
    const info = await deal.getInfo();
    if (info) setInfo(info);
  };

  const addAmount = async () => {
    await deal.sendAdd(sender, amount, approve);
  };

  return (
    <Paper
      className={styles.paper}
      elevation={3}>
      <div className={styles.refreshClose}>
        <IconButton
          aria-label="refresh"
          onClick={refresh}>
          <RefreshOutlinedIcon />
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={close}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="h6" > Deal:</Typography>
        <Typography> {deal.address.toString()} </Typography>
      </div>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="h6" > Arbiter: </Typography>
        <Typography> {info.arbiter.toString()} </Typography>
      </div>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="h6" > Status: </Typography>
        <Typography> {status} </Typography>
      </div>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="h6" > Arbiter fee: </Typography>
        <Typography> {info.arbiterFee} %</Typography>
      </div>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="h6" > Contract fee: </Typography>
        <Typography> {info.mainFee} %</Typography>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Participant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.address}
                selected={user != null}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                <TableCell component="th" scope="row"><PlainText text={row.status} /></TableCell>
                <TableCell align="right"><PlainText text={row.amount} /></TableCell>
                <TableCell ><PlainText text={row.address} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {connected && !isArbiter && !info.approved && (!user || !user.refused) &&
        <div className={styles.joinAdd}>
          <div className={styles.amountApprove}>
            <NumberField
              className={styles.amount}
              label="Amount"
              tonIcon
              onChange={setAmount} />
            {(!user || !user.approved) && info.users.length > 1 && <Tooltip title="If you are the last participant and no further participants or actions are expected, set this option.">
              <FormControlLabel control={<Switch checked={approve} onChange={() => setApprove(!approve)} />} label="Approve" />
            </Tooltip>
            }
          </div>
          <Button
            disabled={amount <= 0}
            variant="outlined"
            onClick={addAmount}>
            {user ? 'Add' : 'Join'}
          </Button>
          {user && !user.approved && info.users.length > 1 && <Button
            variant="outlined"
            color="success" >
            Approve
          </Button>
          }
          {user && !user.refused && <Button
            variant="outlined"
            color="warning" >
            Withdraw
          </Button>
          }
        </div>
      }
      {!connected && <Typography className={styles.noConnection}>Connect to action</Typography>}
    </Paper>

  );
};

class UserInfo {
  address: string;
  amount: string;
  approved: boolean;
  refused: boolean;
  status: string;
  connected: boolean;

  constructor(info: DealUser, conAddr: string) {
    this.address = info.address.toString();
    this.amount = info.sum.toString();
    this.approved = info.approved;
    this.refused = info.refused;
    this.status = info.refused ? 'refused' : (info.approved ? 'approved' : 'active');
    this.connected = isCurrentUser(info.address,conAddr);
  }
}

type TProps = {
  text: string
}

// const HeaderText: React.FC<TProps> = ({ text }) => {
//   return (
//     <Typography variant="h6"> {text} </Typography>
//   );
// };


const PlainText: React.FC<TProps> = ({ text }) => {
  return (
    <Typography> {text} </Typography>
  );
};

function isCurrentUser(addr: Address, conAddr: string) {
  try {
    return Address.normalize(addr) == Address.normalize(Address.parse(conAddr));
  } catch {
    return false;
  }
}

