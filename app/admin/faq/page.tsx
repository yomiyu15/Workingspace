"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, Plus, Edit, Trash2, ChevronDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface FAQItem {
  id: number
  question: string
  answer: string
  order_index?: number
  visible?: boolean
}

const INITIAL_FAQ = {
  question: "",
  answer: "",
  order_index: 0,
  visible: true,
}

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [form, setForm] = useState(INITIAL_FAQ)
  const [openId, setOpenId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const authHeaders = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const fetchFaqs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/faq?all=true`)
      if (!res.ok) throw new Error("Failed to load FAQs")
      const data = await res.json()
      setFaqs(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Unable to load FAQs")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  const resetForm = () => {
    setForm(INITIAL_FAQ)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.question || !form.answer) {
      toast({
        title: "Missing information",
        description: "Question and answer are required.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const url = editingId ? `${API_BASE_URL}/faq/${editingId}` : `${API_BASE_URL}/faq`
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to save FAQ")
      }

      toast({ title: editingId ? "FAQ updated" : "FAQ added" })
      resetForm()
      fetchFaqs()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not save FAQ.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (faq: FAQItem) => {
    setEditingId(faq.id)
    setForm({
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index || 0,
      visible: faq.visible !== false,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/faq/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to delete FAQ")
      }
      toast({ title: "FAQ deleted" })
      fetchFaqs()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not delete FAQ.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition shadow-lg shadow-gray-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{editingId ? "Add New" : "Add FAQ"}</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <Input
            value={form.question}
            onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
            placeholder="What is the minimum booking duration?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
          <Textarea
            value={form.answer}
            onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
            className="min-h-[120px]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order index</label>
            <Input
              type="number"
              value={form.order_index}
              onChange={(e) => setForm((prev) => ({ ...prev, order_index: Number(e.target.value) }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="faq-visible"
              checked={form.visible}
              onCheckedChange={(val) => setForm((prev) => ({ ...prev, visible: val }))}
            />
            <label htmlFor="faq-visible" className="text-sm text-gray-700">
              Visible on website
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {editingId ? "Update FAQ" : "Add FAQ"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading FAQs…</div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="flex-1 text-left flex items-center gap-3"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900">
                    {faq.question}
                    {faq.visible === false && (
                      <span className="ml-2 text-xs text-yellow-600">(Hidden)</span>
                    )}
                  </h3>
                  <motion.div animate={{ rotate: openId === faq.id ? 180 : 0 }} className="ml-auto">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                <div className="flex gap-1 ml-4">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition" onClick={() => handleEdit(faq)}>
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition" onClick={() => handleDelete(faq.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: openId === faq.id ? "auto" : 0,
                  opacity: openId === faq.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-4 py-4 text-gray-700 bg-white">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
