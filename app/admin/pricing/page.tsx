"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface PricingPlan {
  id: number
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular: boolean
}

const INITIAL_PLAN = {
  name: "",
  price: "",
  period: "per day",
  description: "",
  featuresText: "",
  popular: false,
}

const PERIOD_OPTIONS = ["per day", "per week", "per month"]

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [form, setForm] = useState(INITIAL_PLAN)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const authHeaders = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const normalizeFeatures = (features: unknown): string[] => {
    if (Array.isArray(features)) {
      return features.map((f) => (typeof f === "string" ? f : JSON.stringify(f))).filter(Boolean)
    }
    if (typeof features === "string") {
      return features
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    }
    return []
  }

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/pricing`)
      if (!res.ok) throw new Error("Failed to load pricing plans")
      const data = await res.json()
      setPlans(
        Array.isArray(data)
          ? data.map((plan) => ({
              id: plan.id,
              name: plan.name,
              price: Number(plan.price),
              period: plan.period,
              description: plan.description,
              features: normalizeFeatures(plan.features),
              popular: Boolean(plan.popular),
            }))
          : [],
      )
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Unable to load pricing plans")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const resetForm = () => {
    setForm(INITIAL_PLAN)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) {
      toast({
        title: "Missing information",
        description: "Plan name and price are required.",
        variant: "destructive",
      })
      return
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      period: form.period,
      description: form.description,
      features: normalizeFeatures(form.featuresText),
      popular: form.popular,
    }

    setSubmitting(true)
    try {
      const url = editingId ? `${API_BASE_URL}/pricing/${editingId}` : `${API_BASE_URL}/pricing`
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to save pricing plan")
      }

      toast({ title: editingId ? "Plan updated" : "Plan added" })
      resetForm()
      fetchPlans()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not save plan.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (plan: PricingPlan) => {
    setEditingId(plan.id)
    setForm({
      name: plan.name,
      price: String(plan.price),
      period: plan.period,
      description: plan.description,
      featuresText: plan.features.join("\n"),
      popular: plan.popular,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this pricing plan?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/pricing/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to delete plan")
      }
      toast({ title: "Plan deleted" })
      fetchPlans()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not delete plan.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pricing Management</h1>
          <p className="text-gray-600">Manage pricing plans and packages</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition shadow-lg shadow-gray-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{editingId ? "Add New" : "Add Plan"}</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Monthly Pass"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB)</label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing period</label>
            <select
              value={form.period}
              onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Perfect for short-term needs"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Included features</label>
            <span className="text-xs text-gray-400">One per line</span>
          </div>
          <Textarea
            value={form.featuresText}
            onChange={(e) => setForm((prev) => ({ ...prev, featuresText: e.target.value }))}
            placeholder={"High-speed WiFi\nDedicated desk\nUnlimited meeting rooms"}
            className="min-h-[140px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.popular}
            onCheckedChange={(val) => setForm((prev) => ({ ...prev, popular: val }))}
            id="popular-toggle"
          />
          <label htmlFor="popular-toggle" className="text-sm text-gray-700">
            Mark as most popular plan
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {editingId ? "Update Plan" : "Add Plan"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading pricing plans…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl border-2 ${
                plan.popular ? "border-gray-500 shadow-lg" : "border-gray-200"
              } overflow-hidden hover:shadow-xl transition`}
            >
              {plan.popular && (
                <div className="bg-gray-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <DollarSign className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">ETB {plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
