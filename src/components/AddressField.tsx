import { FilledInputProps, InputProps, OutlinedInputProps, TextField } from "@mui/material";
import { Address } from "@ton/core";
import { useEffect, useState } from "react";

type Props = {
  label: string,
  incorrectAddr?: boolean,
  fullWidth?: boolean,
  className?: string,
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps>,
  onChange: (addr: Address | null | undefined) => void
}

export function AddressField({ label, incorrectAddr, fullWidth, className, InputProps, onChange }: Props) {
  const [value, setValue] = useState('');
  const [address, setAddress] = useState<null | Address>();
  const [invalidAddress, setInvalidAddress] = useState(false);

  useEffect(() => {
    try {
      setAddress(Address.parse(value));
    } catch {
      setAddress(null);
    }
  }, [value]);

  useEffect(() => {
    if (address) {
      onChange(address);
    } else if (value.length == 0) {
      onChange(undefined);
    } else {
      onChange(null);
    }
  }, [address]);


  useEffect(() => {
    setInvalidAddress(!address && value.length > 0)
  }, [value, address]);

  return (
    <TextField
      className={className ? className : ''}
      variant="outlined"
      fullWidth={fullWidth}
      error={invalidAddress || incorrectAddr}
      label={invalidAddress ? 'Invalid address' : incorrectAddr ? 'Incorrect address' : label}
      InputProps={InputProps}
      onChange={e => setValue(e.target.value)}
    />
  );
};

