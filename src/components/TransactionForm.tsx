"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // For loading spinner

const categories = [
  { name: "Food", icon: "🍔" },
  { name: "Rent", icon: "🏠" },
  { name: "Travel", icon: "✈️" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Others", icon: "🗂️" },
];

export default function TransactionForm({
  onAdd,
  editData,
  onEditComplete,
}: {
  onAdd?: () => void;
  editData?: any;
  onEditComplete?: () => void;
}) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        amount: editData.amount,
        description: editData.description,
        date: editData.date.split("T")[0],
        category: editData.category,
      });
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.amount || !form.description || !form.date || !form.category) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const url = editData
        ? `/api/transactions/${editData.id}`
        : "/api/transactions";
      const method = editData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        toast.error(
          editData ? "Failed to update." : "Failed to add transaction."
        );
        setLoading(false);
        return;
      }

      setForm({ amount: "", description: "", date: "", category: "" });
      toast.success(editData ? "Transaction updated!" : "Transaction added!");
      editData ? onEditComplete?.() : onAdd?.();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border border-gray-200 rounded-2xl shadow-lg w-full max-w-lg mx-auto bg-white"
      aria-label={editData ? "Edit Transaction" : "Add Transaction"}
    >
      <h2 className="text-xl text-center font-semibold text-teal-700 mb-2">
        {editData ? "Edit Transaction" : "Add New Transaction"}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            className="border border-gray-300 focus:border-teal-500 focus:ring-0 text-base rounded-lg mt-1.5"
            style={{ boxShadow: "none" }}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What was this for?"
            className="border border-gray-300 focus:border-teal-500 focus:ring-0 text-base rounded-lg mt-1.5"
            style={{ boxShadow: "none" }}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            className="border border-gray-300 focus:border-teal-500 focus:ring-0 text-base rounded-lg mt-1.5"
            style={{ boxShadow: "none" }}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 border-gray-300 focus:border-teal-500 focus:ring-0 text-base rounded-lg mt-1.5 bg-white"
            required
            aria-required="true"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-900 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200"
        disabled={loading}
        aria-busy={loading}
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        {editData ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
}
