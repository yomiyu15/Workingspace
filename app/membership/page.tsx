"use client"

import React, { useState, useEffect } from "react"
import { User, Mail, Phone } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { API_BASE_URL } from "@/lib/config"

interface Plan {
  id: number
  name: string
  price: number
  billing_unit: string
}

export default function MembershipPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    plan_id: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/memberships/plans`)
      .then((res) => res.json())
      .then((data) => setPlans(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_BASE_URL}/memberships/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ full_name: "", email: "", phone: "", plan_id: "", message: "" })

        setTimeout(() => setSubmitted(false), 3000)
      } else {
        console.error("Submission failed")
      }
    } catch (err) {
      console.error("Submission failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-10">
          <h4 className="text-primary font-bold tracking-widest text-sm uppercase mb-2">Sign up today!</h4>
          <h1 className="text-3xl font-bold text-foreground mb-4">Start Your Membership</h1>
          <p className="text-muted-foreground text-base">
            Fill out the form below and our team will reach out to assist you with the best plan for your needs.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">Membership Submitted!</h3>
              <p className="text-muted-foreground">We'll contact you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-12 p-4 bg-background rounded-lg border border-input focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 p-4 bg-background rounded-lg border border-input focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 p-4 bg-background rounded-lg border border-input focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <select
                name="plan_id"
                required
                value={formData.plan_id}
                onChange={handleChange}
                className="w-full p-4 bg-background rounded-lg border border-input focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                    {plan.billing_unit ? ` (${plan.billing_unit})` : ""}
                  </option>
                ))}
                <option value="other">Other (we’ll help you choose)</option>
              </select>

              <textarea
                name="message"
                rows={4}
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 bg-background rounded-lg border border-input focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Submitting..." : "Submit Membership"}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
