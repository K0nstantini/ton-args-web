import { IconButton } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

type Props = {
  onClick: () => void,
}

export function CloseBtn({ onClick }: Props) {
  return (
    <IconButton
      aria-label="close"
      onClick={onClick}>
      <CloseOutlinedIcon />
    </IconButton>
  );
}
