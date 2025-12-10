"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Trash, Edit, Sparkles } from "lucide-react"
import axios from "axios"

type Plan = {
  id: number
  name: string
  price: number
  features: string[]
}

type Subscription = {
  id: number
  user_full_name: string
  user_email: string
  plan_name: string
  agreement_length: number
  start_date: string
  monthly_cost: number
}

const emptyPlan: Omit<Plan, "id"> & { features: string[] } = {
  name: "",
  price: 0,
  features: [],
}

export default function AdminPanel() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [activePlan, setActivePlan] = useState<Omit<Plan, "id"> & { features: string[] }>(emptyPlan)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [featureInput, setFeatureInput] = useState("")

  const API_BASE_URL = "http://localhost:5000/api"

  // Fetch Plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/plans`)
      setPlans(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch Subscriptions
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subscriptions`)
      setSubscriptions(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPlans()
    fetchSubscriptions()
  }, [])

  // --- Plan Handlers ---
  const addOrUpdatePlan = async () => {
    if (!activePlan.name || activePlan.price <= 0) return alert("Enter name & price")
    try {
      if (editingPlan) {
        await axios.put(`${API_BASE_URL}/plans/${editingPlan.id}`, activePlan)
      } else {
        await axios.post(`${API_BASE_URL}/plans`, activePlan)
      }
      setActivePlan(emptyPlan)
      setEditingPlan(null)
      setFeatureInput("")
      fetchPlans()
    } catch (err) {
      console.error(err)
      alert("Failed to save plan")
    }
  }

  const deletePlan = async (id: number) => {
    if (!confirm("Delete this plan?")) return
    try {
      await axios.delete(`${API_BASE_URL}/plans/${id}`)
      fetchPlans()
    } catch (err) {
      console.error(err)
    }
  }

  const startEditPlan = (plan: Plan) => {
    setEditingPlan(plan)
    setActivePlan({ name: plan.name, price: plan.price, features: plan.features })
  }

  const addFeature = () => {
    if (!featureInput.trim()) return
    setActivePlan({ ...activePlan, features: [...activePlan.features, featureInput] })
    setFeatureInput("")
  }

  const removeFeature = (feat: string) => {
    setActivePlan({ ...activePlan, features: activePlan.features.filter((f) => f !== feat) })
  }

  // --- Subscription Handlers ---
  const deleteSubscription = async (id: number) => {
    if (!confirm("Delete this subscription?")) return
    try {
      await axios.delete(`${API_BASE_URL}/subscriptions/${id}`)
      fetchSubscriptions()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Plans & Features</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        {/* --- Plans Section --- */}
        <TabsContent value="plans">
          {/* Add / Edit Plan */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">{editingPlan ? `Edit: ${editingPlan.name}` : "Add New Plan"}</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Plan Name</label>
                <Input value={activePlan.name} onChange={(e) => setActivePlan({ ...activePlan, name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Price (ETB)</label>
                <Input type="number" value={activePlan.price} onChange={(e) => setActivePlan({ ...activePlan, price: Number(e.target.value) })} />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Add Feature</label>
                <div className="flex gap-2">
                  <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Feature name" />
                  <Button onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activePlan.features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs">
                      {f}
                      <button className="text-red-500" onClick={() => removeFeature(f)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button onClick={addOrUpdatePlan}>{editingPlan ? "Update Plan" : "Add Plan"}</Button>
              {editingPlan && <Button variant="secondary" onClick={() => { setEditingPlan(null); setActivePlan(emptyPlan); setFeatureInput(""); }}>Cancel</Button>}
            </CardFooter>
          </Card>

          {/* List of Plans */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition">
                <CardContent className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="flex gap-2 items-center">
                      {plan.features.includes("featured") && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span className="font-semibold">{plan.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Price: ETB {plan.price}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plan.features.map((f) => (
                        <span key={f} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="secondary" onClick={() => startEditPlan(plan)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="destructive" onClick={() => deletePlan(plan.id)}><Trash className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- Subscriptions Section --- */}
        <TabsContent value="subscriptions">
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="font-semibold">{sub.user_full_name} ({sub.user_email})</p>
                    <p className="text-sm text-gray-600">Plan: {sub.plan_name} | Start: {sub.start_date} | Agreement: {sub.agreement_length} months | Monthly: ETB {sub.monthly_cost}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="destructive" onClick={() => deleteSubscription(sub.id)}><Trash className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
