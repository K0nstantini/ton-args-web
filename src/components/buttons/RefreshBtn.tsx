import { IconButton } from "@mui/material";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

type Props = {
  onClick: () => void,
}

export function RefreshBtn({ onClick }: Props) {
  return (
        <IconButton
          aria-label="refresh"
          onClick={onClick}>
          <RefreshOutlinedIcon />
        </IconButton>
  );
}
