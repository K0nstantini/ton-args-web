import { Contract, Address, Cell, ContractProvider, Sender, beginCell } from "@ton/core";

export default class Main implements Contract {
	constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

  async sendNewDeal(provider: ContractProvider, via: Sender, address: Address, amount: number, fee: number) {
		const messageBody = beginCell()
			.storeUint(1032836919, 32)
			.storeAddress(address)
			.storeUint(fee * 10_000, 16)
			.storeCoins(amount * 1_000_000_000) // TODO: fix
			.storeBit(0)
			.endCell();

		await provider.internal(via, {
			value: (amount + 0.1).toFixed(3).toString(),
			body: messageBody
		});
	}
}
