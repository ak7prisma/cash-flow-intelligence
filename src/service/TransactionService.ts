import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  type DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../service/firebase";
import { Transaction, transactionConverter } from "../models/Transaction";

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

class TransactionService {
  private static instance: TransactionService;
  private readonly collectionName = "transactions";

  private constructor() {}

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * Returns a typed collection reference with the Firestore converter applied.
   */
  private getCollectionRef() {
    return collection(db, this.collectionName).withConverter(transactionConverter);
  }

  /**
   * Resolves a QuerySnapshot into an array of Transaction instances.
   */
  private resolveSnapshot(snapshot: QuerySnapshot<Transaction, DocumentData>): Transaction[] {
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Adds a new transaction document to Firestore.
   * Returns the auto-generated document ID.
   */
  async addTransaction(transaction: Transaction): Promise<string> {
    const docRef = await addDoc(this.getCollectionRef(), transaction);
    return docRef.id;
  }

  /**
   * Fetches the most recent transactions for a given user.
   * Used primarily on the Dashboard for the "Recent Movements" section.
   */
  async getRecentTransactions(userId: string, limitCount: number = 5): Promise<Transaction[]> {
    const q = query(
      this.getCollectionRef(),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return this.resolveSnapshot(snapshot);
  }

  /**
   * Fetches all transactions for a given user, ordered by date descending.
   * Used on the History page.
   */
  async getAllTransactions(userId: string): Promise<Transaction[]> {
    const q = query(
      this.getCollectionRef(),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return this.resolveSnapshot(snapshot);
  }

  /**
   * Calculates dashboard statistics (total income, total expense, balance)
   * by aggregating all of the user's transactions.
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const transactions = await this.getAllTransactions(userId);

    const stats = transactions.reduce(
      (acc, tx) => {
        if (tx.type === "income") {
          acc.totalIncome += tx.amount;
        } else {
          acc.totalExpense += tx.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    return {
      ...stats,
      balance: stats.totalIncome - stats.totalExpense,
    };
  }

  /**
   * Updates an existing transaction document by ID.
   */
  async updateTransaction(id: string, data: Partial<Omit<Transaction, "id">>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data as DocumentData);
  }

  /**
   * Deletes a transaction document by ID.
   */
  async deleteTransaction(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}

export const transactionService = TransactionService.getInstance();
