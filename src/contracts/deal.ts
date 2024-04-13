import { Contract, Address, Cell, ContractProvider } from "@ton/core";

export default class Deal implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

  async getInfo(provider: ContractProvider) {
    try {
    const { stack } = await provider.get("get_info", []);
      return {
        arbiter: stack.readAddress(),
        arbiterFee: stack.readNumber(),
        mainFee: stack.readNumber(),
        approved: stack.readBoolean(),
        draw: stack.readBoolean(),
      };
    } catch {
      return null;
    }
  }

}
