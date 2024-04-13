import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import Deal from "../contracts/deal";

export function useDeal(address: Address, condition: boolean) {
	const client = useTonClient();

	const dealContract = useAsyncInitialize(async () => {
		if (!client || !condition) return;
		const contract = new Deal(address);
		return client.open(contract) as OpenedContract<Deal>;
	}, [client, condition]);

	return dealContract;
}
