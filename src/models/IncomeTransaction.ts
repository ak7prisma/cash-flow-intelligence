import { Transaction } from "./BaseTransaction";

/*
  INHERITANCE: IncomeTransaction inherits from Transaction.
*/
export class IncomeTransaction extends Transaction {
  constructor(params: Omit<ConstructorParameters<typeof Transaction>[0], "type">) {
    super({ ...params, type: "income" });
  }

  /*
   Implementation of Polymorphism for Income.
  */
  override getFormattedAmount(): string {
    return `+ ${this.formatCurrency(this.amount)}`;
  }
}
