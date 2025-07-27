'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'

interface ProductOption {
  id: string
  name: string
  category: string
}

interface SalesforceProductSelectorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

const SALESFORCE_PRODUCTS: ProductOption[] = [
  // Core Products
  { id: 'salesforce-crm', name: 'Salesforce CRM', category: 'Core Products' },
  { id: 'sales-cloud', name: 'Sales Cloud', category: 'Core Products' },
  { id: 'service-cloud', name: 'Service Cloud', category: 'Core Products' },
  { id: 'marketing-cloud', name: 'Marketing Cloud', category: 'Core Products' },
  { id: 'commerce-cloud', name: 'Commerce Cloud', category: 'Core Products' },
  { id: 'experience-cloud', name: 'Experience Cloud', category: 'Core Products' },
  { id: 'health-cloud', name: 'Health Cloud', category: 'Core Products' },
  { id: 'financial-services-cloud', name: 'Financial Services Cloud', category: 'Core Products' },
  { id: 'einstein-analytics', name: 'Einstein Analytics', category: 'Core Products' },
  { id: 'mulesoft', name: 'MuleSoft', category: 'Core Products' },
  { id: 'tableau', name: 'Tableau', category: 'Core Products' },
  { id: 'slack', name: 'Slack', category: 'Core Products' },

  // Popular Certifications
  { id: 'salesforce-administrator', name: 'Salesforce Administrator', category: 'Popular Certifications' },
  { id: 'platform-developer-i', name: 'Platform Developer I', category: 'Popular Certifications' },
  { id: 'platform-developer-ii', name: 'Platform Developer II', category: 'Popular Certifications' },
  { id: 'advanced-administrator', name: 'Advanced Administrator', category: 'Popular Certifications' },
  { id: 'sales-cloud-consultant', name: 'Sales Cloud Consultant', category: 'Popular Certifications' },
  { id: 'service-cloud-consultant', name: 'Service Cloud Consultant', category: 'Popular Certifications' },
  { id: 'marketing-cloud-administrator', name: 'Marketing Cloud Administrator', category: 'Popular Certifications' },
  { id: 'platform-app-builder', name: 'Platform App Builder', category: 'Popular Certifications' },
  { id: 'data-architect', name: 'Data Architect', category: 'Popular Certifications' },
  { id: 'integration-architect', name: 'Integration Architect', category: 'Popular Certifications' },
  { id: 'ai-associate', name: 'AI Associate', category: 'Popular Certifications' },
  { id: 'ai-consultant', name: 'AI Consultant', category: 'Popular Certifications' },
  { id: 'agentforce-specialist', name: 'Agentforce Specialist', category: 'Popular Certifications' },

  // Specialized Products
  { id: 'salesforce-genie', name: 'Salesforce Genie', category: 'Specialized Products' },
  { id: 'field-service', name: 'Field Service', category: 'Specialized Products' },
  { id: 'revenue-cloud', name: 'Revenue Cloud', category: 'Specialized Products' },
  { id: 'sustainability-cloud', name: 'Sustainability Cloud', category: 'Specialized Products' },
  { id: 'nonprofit-cloud', name: 'Nonprofit Cloud', category: 'Specialized Products' },
  { id: 'education-cloud', name: 'Education Cloud', category: 'Specialized Products' },
  { id: 'public-sector-solutions', name: 'Public Sector Solutions', category: 'Specialized Products' },
  { id: 'manufacturing-cloud', name: 'Manufacturing Cloud', category: 'Specialized Products' },
  { id: 'energy-utilities-cloud', name: 'Energy & Utilities Cloud', category: 'Specialized Products' },
  { id: 'automotive-cloud', name: 'Automotive Cloud', category: 'Specialized Products' },
  { id: 'vlocity', name: 'Vlocity', category: 'Specialized Products' },
  { id: 'agentforce', name: 'Agentforce', category: 'Specialized Products' },
  { id: 'pardot', name: 'Pardot', category: 'Specialized Products' },
  { id: 'cpq-specialist', name: 'CPQ Specialist', category: 'Specialized Products' },
  { id: 'omnistudio-developer', name: 'OmniStudio Developer', category: 'Specialized Products' },
]

export default function SalesforceProductSelector({
  value = '',
  onChange,
  placeholder = 'Type to search 150+ products...',
  label = '🔍 Select Salesforce Product/Certification',
  className = ''
}: SalesforceProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const option = SALESFORCE_PRODUCTS.find(p => p.id === value)
      setSelectedOption(option || null)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredProducts = SALESFORCE_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const category = product.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(product)
    return groups
  }, {} as Record<string, ProductOption[]>)

  const handleSelect = (option: ProductOption) => {
    setSelectedOption(option)
    onChange(option.id)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  const displayValue = selectedOption ? selectedOption.name : searchTerm

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-white hover:border-neutral-300 transition-all duration-200 text-sm"
        />
        
        <div className="absolute left-3 top-3.5 text-neutral-400">
          <Search className="h-5 w-5" />
        </div>
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-large max-h-80 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {Object.keys(groupedProducts).length === 0 ? (
              <div className="p-4 text-center text-neutral-500">
                <p>No products found matching "{searchTerm}"</p>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category}>
                  <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100">
                    <h3 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                      {category}
                    </h3>
                  </div>
                  
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      className="w-full px-4 py-3 text-left hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 border-b border-neutral-100 last:border-b-0 flex items-center justify-between group"
                    >
                      <span className="text-sm text-neutral-700 group-hover:text-primary-700">
                        {product.name}
                      </span>
                      {selectedOption?.id === product.id && (
                        <Check className="h-4 w-4 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}