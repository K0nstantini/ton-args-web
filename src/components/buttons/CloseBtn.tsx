import { IconButton } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

type Props = {
  className?: string,
  onClick: () => void,
}

export function CloseBtn({className, onClick }: Props) {
  return (
    <IconButton
      className={className ? className : ''}
      aria-label="close"
      onClick={onClick}>
      <CloseOutlinedIcon />
    </IconButton>
  );
}
