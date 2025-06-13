"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react"; // Add lucide-react for icons

type Transaction = {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
};

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

export default function TransactionList({
  refresh,
  onUpdate,
  onEdit,
}: {
  refresh: boolean;
  onUpdate: () => void;
  onEdit: (transaction: Transaction) => void;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("/api/transactions");
  //       const data = await res.json();
  //       setTransactions(data);
  //     } catch (error) {
  //       toast.error("Failed to fetch transactions.");
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [refresh]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        console.log("Fetched transactions:", data);

        // Adjust here if API returns object with transactions property
        if (Array.isArray(data)) {
          setTransactions(data);
        } else if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
          toast.error("Unexpected data format from API");
        }
      } catch (error) {
        toast.error("Failed to fetch transactions.");
        console.error(error);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Delete failed");
        return;
      }

      toast.success("Transaction deleted.");
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <div className="mt-10 w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 tracking-tight">
        Recent Transactions
      </h2>
      {transactions.length === 0 ? (
        <div className="text-gray-500 text-center py-16 bg-white rounded-lg shadow-inner">
          No transactions found.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col gap-3 relative"
            >
              {/* Category badge */}
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow">
                {t.category}
              </span>

              {/* Amount */}
              <div
                className={`text-2xl font-bold ${
                  t.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(t.amount)}
              </div>

              {/* Description */}
              <div className="text-gray-700 text-base">{t.description}</div>

              {/* Date */}
              <div className="text-xs text-gray-400">
                {new Date(t.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-gray-300 text-teal-600 hover:bg-blue-50 transition"
                  onClick={() => onEdit(t)}
                >
                  <Pencil size={16} /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-gray-300 bg-[#ffffff00] hover:bg-red-50 text-red-700 transition"
                  // className="flex items-center gap-1 bg-[#c23030f0] hover:bg-[#98c1d9] text-white transition"
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
