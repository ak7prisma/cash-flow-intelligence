export type TransactionType = "income" | "expense";

/*
  ABSTRACTION: The Transaction class is abstract and cannot be instantiated directly.
  It defines the blueprint for all financial movements.

  ENCAPSULATION: Data and behaviors are bundled together.
*/
export abstract class Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  note?: string;

  constructor(params: {
    id?: string;
    userId: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: Date;
    note?: string;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.amount = params.amount;
    this.type = params.type;
    this.category = params.category;
    this.date = params.date;
    this.note = params.note;
  }

  //Protected helper for currency formatting.
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /*
    POLYMORPHISM: This abstract method will have different implementations
    in IncomeTransaction and ExpenseTransaction.
  */
  abstract getFormattedAmount(): string;

  //Returns a plain object representation.
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      category: this.category,
      date: this.date.toISOString(),
      note: this.note,
    };
  }
}
