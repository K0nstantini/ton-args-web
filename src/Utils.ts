import { Address } from "@ton/core";

export function isCurrentUser(addr: Address, conAddr: string) {
  try {
    return Address.normalize(addr) == Address.normalize(Address.parse(conAddr));
  } catch {
    return false;
  }
}
