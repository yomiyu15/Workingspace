"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { Trash2, Plus } from "lucide-react";

export default function AdminMemberships() {
  const [activeTab, setActiveTab] = useState<"plans" | "submissions">("plans");

  // --- Plans state ---
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState({ name: "", price: "", billing_unit: "month" });

  const loadPlans = () =>
    fetch(`${API_BASE_URL}/memberships/plans`)
      .then((r) => r.json())
      .then(setPlans);

  const addPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/memberships/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlan),
    });
    setNewPlan({ name: "", price: "", billing_unit: "month" });
    loadPlans();
  };

  const deletePlan = async (id: number) => {
    await fetch(`${API_BASE_URL}/memberships/plans/${id}`, { method: "DELETE" });
    loadPlans();
  };

  // --- Submissions state ---
  const [submissions, setSubmissions] = useState<any[]>([]);

  const loadSubmissions = () =>
    fetch(`${API_BASE_URL}/memberships/submissions`)
      .then((r) => r.json())
      .then(setSubmissions);

  // --- Load data on mount ---
  useEffect(() => {
    loadPlans();
    loadSubmissions();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Membership Admin Panel</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "plans" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
          onClick={() => setActiveTab("plans")}
        >
          Plans
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "submissions" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
          onClick={() => setActiveTab("submissions")}
        >
          Submissions
        </button>
      </div>

      {/* --- Plans Tab --- */}
      {activeTab === "plans" && (
        <>
          <form onSubmit={addPlan} className="flex gap-2 mb-8 bg-slate-50 p-4 rounded-lg">
            <input
              className="border p-2 rounded flex-1"
              placeholder="Plan Name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded w-32"
              type="number"
              placeholder="Price"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
              required
            />
            <select
              className="border p-2 rounded"
              value={newPlan.billing_unit}
              onChange={(e) => setNewPlan({ ...newPlan, billing_unit: e.target.value })}
            >
              <option value="month">Month</option>
              <option value="hour">Hour</option>
            </select>
            <button className="bg-blue-600 text-white px-4 rounded flex items-center gap-1">
              <Plus size={16} /> Add
            </button>
          </form>

          <div className="border rounded-lg">
            {plans.map((p) => (
              <div key={p.id} className="flex justify-between p-4 border-b last:border-0 items-center">
                <div>
                  <span className="font-bold">{p.name}</span>
                  <span className="ml-4 text-slate-500">
                    {Number(p.price).toLocaleString()} ETB / {p.billing_unit}
                  </span>
                </div>
                <button onClick={() => deletePlan(p.id)} className="text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- Submissions Tab --- */}
      {activeTab === "submissions" && (
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{s.full_name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.phone_number}</td>
                  <td className="p-3">{s.plan_name || "Other"}</td>
                  <td className="p-3">{s.message}</td>
                  <td className="p-3">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
