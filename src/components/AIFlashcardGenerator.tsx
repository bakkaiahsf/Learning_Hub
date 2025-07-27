'use client'

import { useState } from 'react'
import { Zap, Loader2, RotateCcw, ChevronLeft, ChevronRight, Trophy, Target, BookOpen, ExternalLink, CheckCircle } from 'lucide-react'

interface FlashcardData {
  question: string
  answer: string
  explanation?: string
  tags: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  certification_relevance?: string[]
}

interface FlashcardSet {
  topic: string
  flashcards: FlashcardData[]
  certification_focus?: string
  content_source: string
  content_url?: string
  study_recommendations: string[]
}

export default function AIFlashcardGenerator() {
  const [contentUrl, setContentUrl] = useState('')
  const [textContent, setTextContent] = useState('')
  const [topic, setTopic] = useState('')
  const [numCards, setNumCards] = useState(10)
  const [certification, setCertification] = useState('')
  const [difficultyPreference, setDifficultyPreference] = useState<'mixed' | 'easy' | 'medium' | 'hard'>('mixed')
  const [loading, setLoading] = useState(false)
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url')
  
  // Flashcard viewing state
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFlashcardSet(null)
    setError(null)
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setMasteredCards(new Set())

    if (!topic) {
      setError('Topic is required for flashcard generation')
      setLoading(false)
      return
    }

    if (!contentUrl && !textContent) {
      setError('Please provide either a URL or text content for flashcard generation')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content_url: contentUrl || undefined,
          text_content: textContent || undefined,
          topic: topic,
          num_flashcards: numCards,
          certification: certification || undefined,
          difficulty_preference: difficultyPreference,
          save_content: true
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcardSet(data.flashcard_set)
      setStudyMode(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNextCard = () => {
    setShowAnswer(false)
    setCurrentCardIndex((prevIndex) => 
      flashcardSet ? (prevIndex + 1) % flashcardSet.flashcards.length : 0
    )
  }

  const handlePrevCard = () => {
    setShowAnswer(false)
    setCurrentCardIndex((prevIndex) => 
      flashcardSet ? (prevIndex - 1 + flashcardSet.flashcards.length) % flashcardSet.flashcards.length : 0
    )
  }

  const handleCardMastered = (index: number) => {
    const newMastered = new Set(masteredCards)
    if (newMastered.has(index)) {
      newMastered.delete(index)
    } else {
      newMastered.add(index)
    }
    setMasteredCards(newMastered)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/10 text-success border-success/20'
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20'
      case 'Hard': return 'bg-error/10 text-error border-error/20'
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }
  }

  const getStudyProgress = () => {
    if (!flashcardSet) return 0
    return Math.round((masteredCards.size / flashcardSet.flashcards.length) * 100)
  }

  const currentCard = flashcardSet?.flashcards[currentCardIndex]

  const certificationOptions = [
    'Administrator',
    'Platform Developer I',
    'Platform Developer II',
    'Sales Cloud Consultant',
    'Service Cloud Consultant',
    'Marketing Cloud Administrator',
    'Technical Architect',
    'Business Analyst',
    'Marketing Cloud Email Specialist'
  ]

  if (studyMode && flashcardSet) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-accent-100 to-accent-200 p-3 rounded-xl mr-4">
              <Zap className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">{flashcardSet.topic} Flashcards</h3>
              <p className="text-neutral-600">
                Card {currentCardIndex + 1} of {flashcardSet.flashcards.length} • {getStudyProgress()}% Mastered
              </p>
            </div>
          </div>
          <button
            onClick={() => setStudyMode(false)}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-800 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Back to Generator
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-600">Study Progress</span>
            <span className="text-sm font-semibold text-accent-600">{getStudyProgress()}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-accent-500 to-accent-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getStudyProgress()}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        {currentCard && (
          <div className="mb-8">
            <div 
              className="bg-gradient-to-br from-white to-neutral-50 border-2 border-neutral-200 rounded-2xl p-8 cursor-pointer min-h-[300px] flex flex-col justify-between shadow-medium hover:shadow-large transition-all duration-300 transform hover:scale-102"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${getDifficultyColor(currentCard.difficulty)}`}>
                    {currentCard.difficulty}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardMastered(currentCardIndex)
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      masteredCards.has(currentCardIndex)
                        ? 'bg-success text-white'
                        : 'bg-neutral-200 text-neutral-600 hover:bg-success hover:text-white'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-xl font-semibold text-neutral-800 mb-4 leading-relaxed">
                    {showAnswer ? currentCard.answer : currentCard.question}
                  </p>
                  
                  {showAnswer && currentCard.explanation && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-200">
                      <p className="text-primary-800 text-sm leading-relaxed">
                        <strong>Explanation:</strong> {currentCard.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {currentCard.tags.map((tag, idx) => (
                    <span key={idx} className="bg-accent-100 text-accent-700 text-xs px-3 py-1.5 rounded-full font-medium border border-accent-200">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {currentCard.certification_relevance && currentCard.certification_relevance.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentCard.certification_relevance.map((cert, idx) => (
                      <span key={idx} className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full border border-neutral-200">
                        <Trophy className="h-3 w-3 inline mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-center text-neutral-500 text-sm mt-2">
              Click card to {showAnswer ? 'hide' : 'reveal'} answer
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handlePrevCard}
            className="flex items-center px-6 py-3 bg-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-300 transition-colors font-medium"
            disabled={!flashcardSet || flashcardSet.flashcards.length <= 1}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            <button
              onClick={() => {
                setCurrentCardIndex(0)
                setShowAnswer(false)
                setMasteredCards(new Set())
              }}
              className="p-3 bg-accent-100 text-accent-700 rounded-xl hover:bg-accent-200 transition-colors"
              title="Restart Study Session"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={handleNextCard}
            className="flex items-center px-6 py-3 bg-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-300 transition-colors font-medium"
            disabled={!flashcardSet || flashcardSet.flashcards.length <= 1}
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>

        {/* Study Recommendations */}
        <div className="bg-accent-50 rounded-xl p-6 border border-accent-200">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-accent-600 mr-2" />
            <h5 className="text-lg font-bold text-neutral-900">Study Recommendations</h5>
          </div>
          <ul className="space-y-2">
            {flashcardSet.study_recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start text-neutral-700">
                <span className="text-accent-600 font-bold mr-2 mt-1">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-accent-100 to-accent-200 p-3 rounded-xl mr-4">
          <Zap className="h-6 w-6 text-accent-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-neutral-900">AI Flashcard Generator</h3>
          <p className="text-neutral-600">Create intelligent flashcards for certification prep</p>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-neutral-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputMode === 'url' 
                ? 'bg-white text-accent-700 shadow-soft' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            From URL
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputMode === 'text' 
                ? 'bg-white text-accent-700 shadow-soft' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Direct Text
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMode === 'url' ? (
          <div>
            <label htmlFor="content-url" className="block text-sm font-semibold text-neutral-700 mb-2">
              Content URL *
            </label>
            <input
              id="content-url"
              type="url"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              placeholder="https://trailhead.salesforce.com/content/learn/modules/..."
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              required={inputMode === 'url'}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="text-content" className="block text-sm font-semibold text-neutral-700 mb-2">
              Text Content *
            </label>
            <textarea
              id="text-content"
              rows={6}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200 resize-none"
              placeholder="Paste your study material, certification guide, or learning content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required={inputMode === 'text'}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-neutral-700 mb-2">
              Topic *
            </label>
            <input
              id="topic"
              type="text"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              placeholder="e.g., Salesforce Security Model, Apex Fundamentals"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="num-cards" className="block text-sm font-semibold text-neutral-700 mb-2">
              Number of Cards
            </label>
            <input
              id="num-cards"
              type="number"
              min="1"
              max="50"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={numCards}
              onChange={(e) => setNumCards(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="certification" className="block text-sm font-semibold text-neutral-700 mb-2">
              Certification Focus
            </label>
            <select
              id="certification"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            >
              <option value="">No specific certification</option>
              {certificationOptions.map(cert => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-semibold text-neutral-700 mb-2">
              Difficulty Preference
            </label>
            <select
              id="difficulty"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={difficultyPreference}
              onChange={(e) => setDifficultyPreference(e.target.value as 'mixed' | 'easy' | 'medium' | 'hard')}
            >
              <option value="mixed">Mixed Difficulty</option>
              <option value="easy">Easy Questions</option>
              <option value="medium">Medium Questions</option>
              <option value="hard">Hard Questions</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white py-4 rounded-xl font-semibold hover:from-accent-700 hover:to-accent-800 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />} 
          {loading ? 'Generating Flashcards...' : 'Generate AI Flashcards'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl">
          <p className="text-error font-medium">Error: {error}</p>
        </div>
      )}
    </div>
  )
}