import React from "react";
import { createRoot } from "react-dom/client";
import { TabsProvider } from "@core/features/expenses/components/tabs-provider";
import "./capture.css";

const expenses = [
  {
    id: "demo-1",
    date: "Nov 1st, 2026",
    rawDate: "2026-11-01T00:00:00.000Z",
    amount: 1200,
    expenses_cat_id: "operations",
    expenses_subcat_name: "Software",
    bank_account_name: "Demo account",
    created_at: "Nov 1st, 2026",
    updated_at: "Nov 1st, 2026",
  },
  {
    id: "demo-2",
    date: "Nov 2nd, 2026",
    rawDate: "2026-11-02T00:00:00.000Z",
    amount: 800,
    expenses_cat_id: "operations",
    expenses_subcat_name: "Office supplies",
    bank_account_name: "Demo account",
    created_at: "Nov 2nd, 2026",
    updated_at: "Nov 2nd, 2026",
  },
  {
    id: "demo-3",
    date: "Nov 3rd, 2026",
    rawDate: "2026-11-03T00:00:00.000Z",
    amount: 600,
    expenses_cat_id: "operations",
    expenses_subcat_name: "Equipment",
    bank_account_name: "Demo account",
    created_at: "Nov 3rd, 2026",
    updated_at: "Nov 3rd, 2026",
  },
];
const yearly = Array.from({ length: 11 }, (_, i) =>
  expenses.map((item, j) => ({
    ...item,
    id: `month-${i}-${j}`,
    date: `${i + 1}/1/2026`,
    rawDate: `2026-${String(i + 1).padStart(2, "0")}-01T00:00:00.000Z`,
    amount: item.amount * (0.65 + (i % 4) * 0.15),
  })),
).flat();
const categories = [
  { id: "operations", name: "Operations" },
  { id: "bills", name: "Bills" },
  { id: "insurance", name: "Insurance" },
  { id: "salary", name: "Salary" },
];

createRoot(document.getElementById("root")).render(
  <div style={{ padding: 32, minHeight: "100vh", background: "#fff" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 22,
        marginBottom: 24,
        borderBottom: "1px solid #e5e7eb",
        fontSize: 13,
        color: "#64748b",
      }}
    >
      <span>Core Engineering / Finance / Expenses</span>
      <span>DEMO DATA · LOCAL APPLICATION CAPTURE</span>
    </div>
    <TabsProvider
      triggers={categories}
      data={expenses}
      yearlyData={{ operations: yearly }}
      commissionData={[]}
      yearlyCommissionData={[]}
      initialDateRange="November 2026"
    />
  </div>,
);
