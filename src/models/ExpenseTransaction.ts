import { Transaction } from "./BaseTransaction";

/*
 INHERITANCE: ExpenseTransaction inherits from Transaction.
*/
export class ExpenseTransaction extends Transaction {
  constructor(params: Omit<ConstructorParameters<typeof Transaction>[0], "type">) {
    super({ ...params, type: "expense" });
  }

  /*
   Implementation of Polymorphism for Expense.
  */
  override getFormattedAmount(): string {
    return `- ${this.formatCurrency(this.amount)}`;
  }
}
