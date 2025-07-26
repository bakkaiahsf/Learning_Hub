import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import dynamic from 'next/dynamic'

const LearningPathsSection = dynamic(() => import('@/components/LearningPathsSection'), {
  loading: () => <div className="py-16 bg-white"><div className="max-w-7xl mx-auto px-4 text-center"><p>Loading learning paths...</p></div></div>
})

const AIFeaturesSection = dynamic(() => import('@/components/AIFeaturesSection'), {
  loading: () => <div className="py-16 bg-gray-50"><div className="max-w-7xl mx-auto px-4 text-center"><p>Loading AI features...</p></div></div>
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <LearningPathsSection />
      <AIFeaturesSection />
    </main>
  )
}

