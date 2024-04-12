import { Contract, Address, Cell } from "@ton/core";

export default class Main implements Contract {
	constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }
}
