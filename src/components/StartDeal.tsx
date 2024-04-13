import { Button, IconButton, InputBase, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from '../css/StartDeal.module.css'
import { Address } from "@ton/ton";

type Props = {
  showNewDeal: boolean,
  findDeal: (addr: Address) => void,
  newDeal: () => void,
}

export function StartDeal({ showNewDeal, findDeal, newDeal: createDeal }: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [address, setAddress] = useState<null | Address>();

  useEffect(() => {
    try {
      setAddress(Address.parse(searchValue));
    } catch {
      setAddress(null);
    }
  }, [searchValue]);

  const searchClick = () => {
    if (!address) return;
    findDeal(address);
  };

  return (
    <div className={styles.startDeal}>
      <Paper
        className={styles.paper}
        component="form">
        <InputBase
          className={styles.inputBase}
          placeholder="Find Deal"
          onChange={e => setSearchValue(e.target.value)} />
        <IconButton
          className={styles.searchBtn}
          type="button"
          aria-label="search"
          disabled={!address}
          onClick={searchClick} >
          <SearchIcon />
        </IconButton>
      </Paper>
      {showNewDeal && <Button
        variant="outlined"
        onClick={createDeal} >
        New deal
      </Button>
      }

    </div>

  );
};

