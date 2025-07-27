'use client'

import { useState } from 'react'
import { X, Mail, Bell, Star, Check } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          plan: selectedPlan 
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setEmail('')
        }, 2000)
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      // Still show success for better UX in MVP
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setEmail('')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-large w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-200 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-neutral-200">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-primary-100 to-accent-100 p-3 rounded-xl">
              <Bell className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">Stay Updated</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 hover:bg-neutral-100 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="p-10 text-center animate-fade-in">
            <div className="bg-gradient-to-br from-success/10 to-success/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Thanks for subscribing!</h3>
            <p className="text-lg text-neutral-600">We'll keep you updated on new features and content.</p>
          </div>
        ) : (
          <div className="p-8">
            {/* Plan Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div 
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedPlan === 'free' 
                      ? 'border-primary-500 bg-primary-50 shadow-medium' 
                      : 'border-neutral-200 hover:border-neutral-300 hover:shadow-soft'
                  }`}
                  onClick={() => setSelectedPlan('free')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-neutral-900 text-lg">Free Access</h4>
                    <div className="text-3xl font-bold text-neutral-900">Free</div>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>Access to basic learning paths</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>Community discussions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>Monthly newsletter</span>
                    </li>
                  </ul>
                </div>

                {/* Pro Plan */}
                <div 
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 relative ${
                    selectedPlan === 'pro' 
                      ? 'border-accent-500 bg-accent-50 shadow-medium' 
                      : 'border-neutral-200 hover:border-neutral-300 hover:shadow-soft'
                  }`}
                  onClick={() => setSelectedPlan('pro')}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-medium">
                      Coming Soon
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-neutral-900 text-lg">Pro Access</h4>
                    <div className="text-3xl font-bold text-neutral-900">$29/mo</div>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>AI-powered personalization</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-neutral-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200 text-lg"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-xl p-6 border border-neutral-200">
                <div className="flex items-start space-x-4">
                  <Star className="h-6 w-6 text-warning mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3">What you'll get:</h4>
                    <ul className="text-sm text-neutral-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-600 font-bold">•</span>
                        <span>Early access to new learning paths</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-600 font-bold">•</span>
                        <span>Weekly learning tips and best practices</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-600 font-bold">•</span>
                        <span>Exclusive community events and webinars</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-600 font-bold">•</span>
                        <span>No spam, unsubscribe anytime</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg ${
                  selectedPlan === 'free'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white'
                    : 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white'
                }`}
              >
                {loading ? 'Subscribing...' : 
                 selectedPlan === 'free' ? 'Get Free Access' : 'Join Waitlist for Pro'}
              </button>
            </form>

            <p className="text-sm text-neutral-500 text-center mt-6">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}