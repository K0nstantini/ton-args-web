import { useEffect, useState } from "react";
import styles from '../css/ExistedDeal.module.css'
import { NumberField } from "./NumberField";
import { Address, OpenedContract } from "@ton/core";
import Deal, { DealInfo, DealUser } from "../contracts/deal";
import { Button, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonAddress } from "@tonconnect/ui-react";
import { CloseBtn } from "./buttons/CloseBtn";
import { RefreshBtn } from "./buttons/RefreshBtn";
import { isCurrentUser } from "../Utils";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { AddressField } from "./AddressField";

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
  const [approve, setApprove] = useState(info.users.length > 1 || !user);
  const [availability, setAvailability] = useState(true);
  const [winner, setWinner] = useState<Address | null | undefined>();

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
    if (info) {
      setInfo(info);
    } else {
      setAvailability(false);
    }
  };

  const sendAddAmount = async () => {
    await deal.sendAdd(sender, amount, approve);
  };

  const sendApprove = async () => {
    await deal.sendApprove(sender);
  };

  const sendWithdraw = async () => {
    await deal.sendWithdraw(sender);
  };

  const sendWinner = async () => {
    await deal.sendWinner(sender, winner);
  };

  return (
    <Paper
      className={styles.paper}
      elevation={3}>
      <div className={styles.refreshClose}>
        <RefreshBtn onClick={refresh}></RefreshBtn>
        <CloseBtn onClick={close}></CloseBtn>
      </div>
      {availability ?
        <div className={styles.data}>
          <Typography className={styles.status} variant="h6" > {status}</Typography>
          <div className={styles.addressesAndFees}>
            <Addresses deal={deal.address} arbiter={info.arbiter} />
            <Fees arbiterFee={info.arbiterFee} contractFee={info.mainFee} />
          </div>
          <UsersTable users={users} />
          {connected &&
            <Actions
              info={info}
              user={user}
              isArbiter={isArbiter}
              approve={approve}
              amount={amount}
              winner={winner}
              setApprove={setApprove}
              setAmount={setAmount}
              setWinner={setWinner}
              sendAddAmount={sendAddAmount}
              sendApprove={sendApprove}
              sendWithdraw={sendWithdraw}
              sendWinner={sendWinner}/>
          }
          {!connected && <Typography className={styles.noConnection}>Connect to action</Typography>}
        </div>
        : <Typography className={styles.notAccessible}>Contract not accessible</Typography>}
    </Paper>

  );
};

class UserInfo {
  address: string;
  amount: string;
  approved: boolean;
  refused: boolean;
  connected: boolean;

  constructor(info: DealUser, conAddr: string) {
    this.address = info.address.toString();
    this.amount = info.sum.toString();
    this.approved = info.approved;
    this.refused = info.refused;
    this.connected = isCurrentUser(info.address, conAddr);
  }
}

type TProps = {
  text: string
}

const PlainText: React.FC<TProps> = ({ text }) => {
  return (
    <Typography> {text} </Typography>
  );
};

type FeesProps = {
  arbiterFee: number,
  contractFee: number
}

function Fees({ arbiterFee, contractFee }: FeesProps) {
  return (
    <Paper className={styles.fees}>
      <div className={styles.fee}>
        <Typography variant="subtitle2">Arbiter fee</Typography>
        <Typography variant="body2"> {arbiterFee} %</Typography>
      </div>
      <div className={styles.fee}>
        <Typography variant="subtitle2">Contract fee</Typography>
        <Typography variant="body2"> {contractFee} %</Typography>
      </div>
    </Paper>
  );
}

type AddrProps = {
  deal: Address,
  arbiter: Address
}

function Addresses({ deal, arbiter }: AddrProps) {
  return (
    <div className={styles.addresses}>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="subtitle1" > Deal:</Typography>
        <Typography variant="body1"> {deal.toString()} </Typography>
      </div>
      <div className={styles.addr}>
        <Typography className={styles.header} variant="subtitle1" > Arbiter: </Typography>
        <Typography variant="body1"> {arbiter.toString()} </Typography>
      </div>
    </div>

  );
}

type TableProps = {
  users: UserInfo[]
}

function UsersTable({ users }: TableProps) {
  return (
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
              selected={row.connected}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
              {row.refused
                ? <TableCell sx={{ color: 'darkred' }}><CancelOutlinedIcon /></TableCell>
                : row.approved
                  ? <TableCell sx={{ color: 'green' }}><CheckCircleOutlineOutlinedIcon /></TableCell>
                  : <TableCell><AccessTimeOutlinedIcon /></TableCell>
              }
              <TableCell align="right"><PlainText text={row.amount} /></TableCell>
              <TableCell ><PlainText text={row.address} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type ActionsProps = {
  info: DealInfo,
  user: UserInfo | null,
  isArbiter: boolean,
  approve: boolean,
  amount: number,
  winner: Address | null | undefined,
  setApprove: (approve: boolean) => void,
  setAmount: (amount: number) => void,
  setWinner: (addr: Address | null | undefined) => void,
  sendAddAmount: () => void,
  sendApprove: () => void,
  sendWithdraw: () => void,
  sendWinner: () => void,
}

function Actions({ info, user, isArbiter, approve, winner, amount, setApprove, setAmount, sendAddAmount, sendApprove, setWinner, sendWithdraw, sendWinner }: ActionsProps) {
  const showApproveSwitch = !user || (!user.approved && info.users.length > 1);
  const showApproveBtn = user && !user.approved && info.users.length > 1;
  const showWithdrawBtn = user && !user.refused;
  const incorrectAddr = winner != null && info.users.every(u => Address.normalize(u.address) != Address.normalize(winner));
  const withdrawDisabled = winner != undefined && (!winner || incorrectAddr);

  return (
    <div className={styles.action}>
      {!approve &&
        <div>
          <div className={styles.amountApprove}>
            <NumberField
              className={styles.amount}
              label="Amount"
              tonIcon
              onChange={setAmount} />
            {showApproveSwitch &&
              <Tooltip title="If you are the last participant and no further participants or actions are expected, set this option.">
                <FormControlLabel control={<Switch checked={approve} onChange={() => setApprove(!approve)} />} label="Approve" />
              </Tooltip>
            }
          </div>
          <Button
            disabled={amount <= 0}
            variant="outlined"
            onClick={sendAddAmount}>
            {user ? 'Add' : 'Join'}
          </Button>
        </div>
      }
      {showApproveBtn &&
        <Button
          variant="outlined"
          color="success"
          onClick={sendApprove}>
          Approve
        </Button>
      }
      {showWithdrawBtn &&
        <Button
          variant="outlined"
          color="warning"
          onClick={sendWithdraw}>
          Withdraw
        </Button>
      }
      {isArbiter &&
        <div className={styles.winner}>
          <AddressField
            className={styles.winnerAddr}
            fullWidth
            label="Winner address (empty if draw)"
            incorrectAddr={incorrectAddr}
            onChange={setWinner}/>
          <Button
            disabled={withdrawDisabled}
            variant="outlined"
            onClick={sendWinner}>
            Award
          </Button>
        </div>
      }
    </div>
  );
}
