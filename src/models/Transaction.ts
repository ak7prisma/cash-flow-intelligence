import {
  Timestamp,
  QueryDocumentSnapshot,
  type SnapshotOptions,
  type DocumentData,
  type FirestoreDataConverter,
  type WithFieldValue,
} from "firebase/firestore";

export type TransactionType = "income" | "expense";

export class Transaction {
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

  /**
   * Returns the amount formatted as IDR currency.
   * Income is prefixed with "+", expense with "-".
   * Example: "+ Rp 1.500.000" or "- Rp 250.000"
   */
  getFormattedAmount(): string {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.amount);

    return this.type === "income" ? `+ ${formatted}` : `- ${formatted}`;
  }

  /**
   * Returns a plain object representation (useful for debugging / serialization).
   */
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

/**
 * Firestore data converter for the Transaction class.
 * Handles bidirectional mapping between Transaction instances and Firestore documents.
 *
 * - toFirestore: converts Transaction → Firestore doc (Date → Timestamp)
 * - fromFirestore: converts Firestore doc → Transaction (Timestamp → Date)
 */
export const transactionConverter: FirestoreDataConverter<Transaction> = {
  toFirestore(transaction: WithFieldValue<Transaction>): DocumentData {
    return {
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: Timestamp.fromDate(transaction.date as Date),
      ...(transaction.note !== undefined && { note: transaction.note }),
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): Transaction {
    const data = snapshot.data(options);
    return new Transaction({
      id: snapshot.id,
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: (data.date as Timestamp).toDate(),
      note: data.note,
    });
  },
};
