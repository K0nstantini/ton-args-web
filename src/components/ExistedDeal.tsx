import { useEffect, useState } from "react";
import styles from '../css/ExistedDeal.module.css'
import { NumberField } from "./NumberField";
import { Address, OpenedContract } from "@ton/core";
import Deal, { DealInfo, DealUser } from "../contracts/deal";
import { Button, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonAddress } from "@tonconnect/ui-react";
import { CloseBtn } from "./buttons/CloseBtn";
import { RefreshBtn } from "./buttons/RefreshBtn";
import { isCurrentUser } from "../Utils";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
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
  const [users, setUsers] = useState(dealInfo.users.map(u => new UserInfo(info, u, connectedAddress)));
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isArbiter, setIsArbiter] = useState(false);
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState(0);
  const [approve, setApprove] = useState(info.users.length > 1 || !user);
  const [availability, setAvailability] = useState(true);
  const [winner, setWinner] = useState<Address | null | undefined>();

  useEffect(() => {
    setStatus(info.draw ? 'Draw. You can withdraw your funds.' : (info.approved ? 'Awaiting results' : 'Active'));
  }, [info]);

  useEffect(() => {
    setIsArbiter(isCurrentUser(info.arbiter, connectedAddress));
    setUsers(info.users.map(u => new UserInfo(info, u, connectedAddress)));
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
      {availability &&
        <div className={styles.data}>
          <Typography className={styles.status} variant="h6" > {status}</Typography>
          <div className={styles.addressesAndFees}>
            <Addresses deal={deal.address} arbiter={info.arbiter} />
            <Fees arbiterFee={info.arbiterFee} contractFee={info.mainFee} />
          </div>
          <UsersTable info={info} users={users} />
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
              sendWinner={sendWinner} />
          }
          {!connected && <Typography className={styles.noConnection}>Connect to action</Typography>}
        </div>
      }
      {!availability && <Typography className={styles.notAccessible}>Contract not accessible</Typography>}
    </Paper>

  );
};

class UserInfo {
  address: string;
  amount: string;
  approved: boolean;
  approvedIsValid: boolean;
  refused: boolean;
  connected: boolean;

  constructor(info: DealInfo, usr: DealUser, conAddr: string) {
    this.address = usr.address.toString();
    this.amount = usr.sum.toString();
    this.approved = usr.approved > 0;
    this.approvedIsValid = usr.approved > 0 && usr.approved >= info.lastCancel;
    this.refused = usr.refused;
    this.connected = isCurrentUser(usr.address, conAddr);
  }
}

type TProps = {
  text: string
}

const PlainText: React.FC<TProps> = ({ text }) => {
  return (
    <Typography sx={{ typography: { sm: 'body1', xs: 'body2' } }}> {text} </Typography>
  );
};

type FeesProps = {
  arbiterFee: number,
  contractFee: number
}

function Fees({ arbiterFee, contractFee }: FeesProps) {
  return (
    <Paper
      className={styles.fees}
      sx={{
        '@media (max-width: 750px)': {
          boxShadow: 'none',
        },
      }}
    >
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

// del ':', move out isMobile (and from other places)
function Addresses({ deal, arbiter }: AddrProps) {
  const isMobile = useMediaQuery('(max-width:750px)');
  const needShortAddr = useMediaQuery('(max-width:450px)');
  return (
    <div className={styles.addresses}>
      <div className={styles.addr}>
        <Typography
          className={styles.addrHeader}
          variant="subtitle1"
          sx={isMobile ? { typography: 'subtitle2' } : {}}>
          Deal:
        </Typography>
        <Typography sx={{ typography: { sm: 'body1', xs: 'body2' } }} > {needShortAddr ? shortAddr(deal.toString()) : deal.toString()} </Typography>
      </div>
      <div className={styles.addr}>
        <Typography
          className={styles.addrHeader}
          variant="subtitle1"
          sx={isMobile ? { typography: 'subtitle2' } : {}}>
          Arbiter:
        </Typography>
        <Typography sx={{ typography: { sm: 'body1', xs: 'body2' } }}> {needShortAddr ? shortAddr(arbiter.toString()) : arbiter.toString()} </Typography>
      </div>
    </div>

  );
}

type TableProps = {
  info: DealInfo,
  users: UserInfo[]
}

function UsersTable({ info, users }: TableProps) {
  const isMobile = useMediaQuery('(max-width:750px)');

  const Draw = () => {
    return (
      <Tooltip title="Funds available for withdrawal">
        <TableCell sx={{ color: 'green' }}><PaidOutlinedIcon /></TableCell>
      </Tooltip>
    );
  };

  const Refused = () => {
    return (
      <Tooltip title="Participant requests fund withdrawal">
        <TableCell sx={{ color: 'darkred' }}><CancelOutlinedIcon /></TableCell>
      </Tooltip>
    );
  };

  const Approved = () => {
    return (
      <Tooltip title="Participant approved">
        <TableCell sx={{ color: 'green' }}><CheckCircleOutlineOutlinedIcon /></TableCell>
      </Tooltip>
    );
  };

  const ExpiredApproved = () => {
    return (
      <Tooltip title="Participant approval expired">
        <TableCell sx={{ color: 'darkorange' }}><ErrorOutlineOutlinedIcon /></TableCell>
      </Tooltip>
    );
  };

  const AwaitingAction = () => {
    return (
      <Tooltip title="Awaiting further action">
        <TableCell><AccessTimeOutlinedIcon /></TableCell>
      </Tooltip>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" >
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
              {info.draw ? <Draw />
                : row.refused ? <Refused />
                  : row.approvedIsValid ? <Approved />
                    : row.approved ? <ExpiredApproved />
                      : <AwaitingAction />
              }
              <TableCell align="right" sx={{ color: 'darkgreen' }}><PlainText text={row.amount} /></TableCell>
              <TableCell ><PlainText text={isMobile ? shortAddr(row.address) : row.address} />
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
  const showAddJoint = !info.approved && !isArbiter && !info.draw;
  const showApproveSwitch = showAddJoint && (!user || (!user.approvedIsValid && info.users.length > 1));
  const showApproveBtn = !info.draw && user && !user.approvedIsValid && info.users.length > 1;
  const showWithdrawBtn = user && !user.refused; // mb not show if contract is yet approved but user already refused
  const incorrectAddr = winner != null && info.users.every(u => Address.normalize(u.address) != Address.normalize(winner));
  const withdrawDisabled = winner != undefined && (!winner || incorrectAddr);
  const showAward = isArbiter && info.approved && !info.draw;

  return (
    <div className={styles.action}>
      {showAddJoint &&
        <div className={styles.addJoin}>
          <NumberField
            label="Amount"
            fullWidth
            tonIcon
            onChange={setAmount} />
          <Button
            className={styles.addJoinBtn}
            disabled={amount <= 0}
            variant="outlined"
            onClick={sendAddAmount}>
            {user ? 'Add' : 'Join'}
          </Button>
        </div>
      }
      {showApproveSwitch &&
        <div className={styles.approve}>
          <Tooltip title="If you are the last participant and no further participants or actions are expected, set this option.">
            <Switch checked={approve} onChange={() => setApprove(!approve)} />
          </Tooltip>
          <Typography>Approve</Typography>
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
      {showAward &&
        <div className={styles.winner}>
          <AddressField
            fullWidth
            label="Winner address (empty if draw)"
            incorrectAddr={incorrectAddr}
            onChange={setWinner} />
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

function shortAddr(addr: string) {
  if (addr.length <= 8) {
    return addr;
  } else {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  }
}
