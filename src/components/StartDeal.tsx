import { Button, InputAdornment, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import styles from '../css/StartDeal.module.css'
import { Address, OpenedContract } from "@ton/ton";
import { useAsyncInitialize } from "../hooks/useAsyncInitialize";
import Deal, { DealInfo } from "../contracts/deal";
import { useTonClient } from "../hooks/useTonClient";

type Props = {
  showNewDeal: boolean,
  findDeal: (contract: OpenedContract<Deal>, info: DealInfo) => void,
  newDeal: () => void,
}

export function StartDeal({ showNewDeal, findDeal, newDeal: createDeal }: Props) {
  const client = useTonClient();
  const [searchValue, setSearchValue] = useState('');
  const [address, setAddress] = useState<null | Address>();
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [dealInfo, setDealInfo] = useState<DealInfo | null>(null);

  const dealContract = useAsyncInitialize(async () => {
    if (!client || !address) return;
    const contract = new Deal(address);
    return client.open(contract) as OpenedContract<Deal>;
  }, [client, address]);

  useEffect(() => {
    try {
      setAddress(Address.parse(searchValue));
    } catch {
      setAddress(null);
    }
  }, [searchValue]);

  useEffect(() => {
    setInvalidAddress(!address && searchValue.length > 0)
  }, [searchValue, address]);

  useEffect(() => {
    async function getData() {
      if (!dealContract) return;
      const info = await dealContract.getInfo();
      setDealInfo(info);
    }
    getData();
  }, [dealContract]);


  const searchClick = () => {
    if (!dealContract || !dealInfo) return;
    setSearchValue('');
    findDeal(dealContract, dealInfo);
  };

  return (
    <Paper
      className={styles.paper}
      elevation={3}>
      <TextField
        className={styles.search}
        variant="outlined"
        placeholder="Find Deal"
        error={invalidAddress}
        label={invalidAddress ? 'Invalid address' : ''}
        value={searchValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" >
              <Button
                variant="outlined"
                disabled={!dealInfo || !address}
                onClick={searchClick}>
                <ArrowForwardIosOutlinedIcon />
              </Button>
            </InputAdornment>
          ),
        }}
        onChange={e => setSearchValue(e.target.value)}
      />
      {showNewDeal && <Button
        variant="outlined"
        onClick={createDeal} >
        New deal
      </Button>
      }

    </Paper>

  );
};

