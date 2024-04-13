import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  label: string,
  onChange: (value: number) => void,
  className?: string,
}

export function NumberField({ label, onChange, className }: Props) {
  const [value, setValue] = useState('0');

  const changeValue = (v: string) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(v)) {
      setValue(v);
    } else if (v.length == 0) {
      setValue('0');
    }
  };

  useEffect(() => {
    onChange(Number(value));
  }, [value]);

  return (
    <TextField
      className={className ? className : ''}
      label={label}
      variant="outlined"
      value={value}
      inputProps={{ style: { textAlign: 'right' } }}
      onChange={e => changeValue(e.target.value)} />
  );
};

