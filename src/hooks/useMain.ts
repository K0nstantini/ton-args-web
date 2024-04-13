import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import Main from "../contracts/main";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useMain(condition: boolean) {
  const address = import.meta.env.VITE_MAIN_CONTRACT;
  if (!address) throw new Error("Main address is not set in .env file");
  const client = useTonClient();

  const mainContract = useAsyncInitialize(async () => {
    if (!client || !condition) return;
    const contract = new Main(
      Address.parse(address)
    );
    return client.open(contract) as OpenedContract<Main>;
  }, [client, condition]);

  return mainContract;
}
