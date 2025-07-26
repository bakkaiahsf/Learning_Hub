'use client'

import { Search, BookOpen, RefreshCw, Brain, MessageCircle, Zap } from 'lucide-react'
import { memo, useMemo } from 'react'

function AIFeaturesSection() {
  const features = useMemo(() => [
    {
      icon: Search,
      title: 'Smart Search & Summarization',
      description: 'Ask questions in natural language and get intelligent summaries from thousands of Salesforce resources.',
      features: [
        'Natural language queries',
        'Instant content summaries',
        'Multi-source aggregation',
        'Context-aware results'
      ],
      tryText: 'Try: "How do I create a validation rule?"',
      buttonText: 'Learn More',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: BookOpen,
      title: 'Personalized Learning Paths',
      description: 'AI-curated learning journeys that adapt to your role, experience level, and career goals.',
      features: [
        'Role-based recommendations',
        'Adaptive difficulty levels',
        'Progress optimization',
        'Skill gap analysis'
      ],
      tryText: 'Get your custom admin certification path',
      buttonText: 'Learn More',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      icon: RefreshCw,
      title: 'Real-time Content Updates',
      description: 'Stay current with the latest Salesforce features and best practices through AI-powered content curation.',
      features: [
        'Latest release notes',
        'Feature impact analysis',
        'Best practice updates',
        'Community insights'
      ],
      tryText: 'See what\'s new in Winter \'25',
      buttonText: 'Learn More',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    }
  ], [])

  const aiCapabilities = useMemo(() => [
    {
      icon: Brain,
      title: 'Intelligent Content Processing',
      description: 'Advanced AI models process and understand Salesforce documentation, tutorials, and community content.'
    },
    {
      icon: MessageCircle,
      title: 'Conversational Learning Assistant',
      description: 'Chat with our AI assistant for instant help, clarifications, and learning guidance.'
    },
    {
      icon: Zap,
      title: 'Instant Knowledge Extraction',
      description: 'Get key insights and actionable takeaways from lengthy documentation in seconds.'
    }
  ], [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Learning Experience</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Harness the power of artificial intelligence to accelerate your Salesforce learning journey. 
            Get personalized guidance, instant answers, and smart content recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">{feature.description}</p>
              
              <ul className="space-y-2 mb-6">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">Try it:</p>
                <p className="text-sm font-medium text-gray-900">{feature.tryText}</p>
              </div>
              
              <button className={`w-full text-white py-3 rounded-lg font-medium transition-colors ${feature.buttonColor}`}>
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* AI Capabilities */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h3>
            <p className="text-lg text-gray-600">
              Our platform leverages cutting-edge artificial intelligence to transform how you learn Salesforce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <capability.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{capability.title}</h4>
                <p className="text-gray-600">{capability.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Ready to Experience AI-Powered Learning?</h4>
            <p className="text-gray-600 mb-8">
              Join thousands of Salesforce professionals who are accelerating their careers with intelligent learning
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Try AI Search
              </button>
              <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(AIFeaturesSection)

