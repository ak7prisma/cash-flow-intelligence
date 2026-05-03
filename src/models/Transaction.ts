import {
  Timestamp,
  QueryDocumentSnapshot,
  type SnapshotOptions,
  type DocumentData,
  type FirestoreDataConverter,
  type WithFieldValue,
} from "firebase/firestore";
import { Transaction } from "./BaseTransaction";
import { IncomeTransaction } from "./IncomeTransaction";
import { ExpenseTransaction } from "./ExpenseTransaction";

// Re-export everything so other files can still import from here
export * from "./BaseTransaction";
export * from "./IncomeTransaction";
export * from "./ExpenseTransaction";

/*
 Firestore data converter for the Transaction hierarchy.
 Handles polymorphic instantiation during document fetching.
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
    const params = {
      id: snapshot.id,
      userId: data.userId,
      amount: data.amount,
      category: data.category,
      date: (data.date as Timestamp).toDate(),
      note: data.note,
    };

    // Subtype Polymorphism: Selecting the correct class based on 'type'
    if (data.type === "income") {
      return new IncomeTransaction(params);
    } else {
      return new ExpenseTransaction(params);
    }
  },
};
