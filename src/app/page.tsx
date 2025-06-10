"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardStats from "@/components/DashboardStats";

export default function HomePage() {
  const [refresh, setRefresh] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  return (
    <main className="p-6 bg-teal-50">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Personal Finance Tracker
      </h1>
      <TransactionForm
        onAdd={() => setRefresh(!refresh)}
        editData={editTransaction}
        onEditComplete={() => {
          setEditTransaction(null);
          setRefresh(!refresh);
        }}
      />
      <TransactionList
        refresh={refresh}
        onUpdate={() => setRefresh(!refresh)}
        onEdit={setEditTransaction}
      />
      <ExpenseChart refresh={refresh} />
      <DashboardStats refresh={refresh} />

      {/* <CategoryPieChart refresh={refresh} /> */}
    </main>
  );
}
