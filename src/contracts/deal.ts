import { Contract, Address, Cell, ContractProvider, Dictionary, Sender, beginCell } from "@ton/core";

export default class Deal implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

  async getInfo(provider: ContractProvider) {
    try {
      const { stack } = await provider.get("get_info", []);

      const arbiter = stack.readAddress();
      const arbiterFee = stack.readNumber() / 10_000;
      const mainFee = stack.readNumber() / 10_000;
      const approved = stack.readBoolean();
      const draw = stack.readBoolean();

      const values = stack.readCell().beginParse().loadDictDirect(Dictionary.Keys.Address(), Dictionary.Values.Cell()).values();
      const users: DealUser[] = values.map((c) => {
        const s = c.beginParse();
        const user: DealUser = {
          address: s.loadAddress(),
          sum: Number(s.loadCoins() / 1_000n) / 1_000_000,
          approved: s.loadBoolean(),
          refused: s.loadBoolean()
        };
        return user;
      });

      const info: DealInfo = {
        arbiter,
        arbiterFee,
        mainFee,
        approved,
        draw,
        users
        // addresses
      };
      return info;
    } catch {
      return null;
    }
  }

  async sendAdd(provider: ContractProvider, via: Sender, amount: number, approve: boolean) {
    const messageBody = beginCell()
      .storeUint(2719220571, 32)
      .storeCoins(amount * 1_000_000_000) // TODO: fix
      .storeBit(approve)
      .endCell();

    await provider.internal(via, {
      value: (amount + 0.1).toFixed(3).toString(),
      body: messageBody
    });
  }

  async sendApprove(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail("approve")
      .endCell();

    await provider.internal(via, {
      value: "0.1",
      body: messageBody
    });

  }

  async sendWithdraw(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail("withdraw")
      .endCell();

    await provider.internal(via, {
      value: "0.1",
      body: messageBody
    });
  }

  async sendWinner(provider: ContractProvider, via: Sender, addr: Address | null | undefined) {
    const messageBody = beginCell()
      .storeUint(2167593794, 32)
      .storeAddress(addr ? addr : this.address) // send self address if no winner
      .endCell();

    await provider.internal(via, {
      value: "0.1",
      body: messageBody
    });
  }

}

export interface DealInfo {
  arbiter: Address,
  arbiterFee: number,
  mainFee: number,
  approved: boolean,
  draw: boolean,
  users: DealUser[]
}

export interface DealUser {
  address: Address,
  sum: number,
  approved: boolean,
  refused: boolean
}
