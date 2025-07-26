'use client'

import Header from '@/components/Header'
import { Award, Calendar, Clock, CheckCircle, Target } from 'lucide-react'

export default function CertificationsPage() {
  const certifications = [
    {
      id: '1',
      title: 'Salesforce Certified Administrator',
      level: 'Associate',
      duration: '90 minutes',
      questions: 60,
      passingScore: '65%',
      cost: '$200',
      description: 'Validate your skills as a Salesforce Administrator with this foundational certification.',
      skills: ['User Management', 'Data Management', 'Security', 'Standard & Custom Objects'],
      nextExamDate: '2024-02-15',
      difficulty: 'Beginner'
    },
    {
      id: '2',
      title: 'Salesforce Certified Platform Developer I',
      level: 'Associate',
      duration: '105 minutes',
      questions: 60,
      passingScore: '68%',
      cost: '$200',
      description: 'Demonstrate your foundational programmatic skills on the Lightning Platform.',
      skills: ['Apex Programming', 'Process Automation', 'User Interface', 'Testing & Debugging'],
      nextExamDate: '2024-02-20',
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      title: 'Salesforce Certified Sales Cloud Consultant',
      level: 'Professional',
      duration: '105 minutes',
      questions: 60,
      passingScore: '68%',
      cost: '$200',
      description: 'Prove your expertise in implementing Sales Cloud solutions.',
      skills: ['Sales Process', 'Lead Management', 'Opportunity Management', 'Sales Productivity'],
      nextExamDate: '2024-02-25',
      difficulty: 'Intermediate'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Salesforce Certifications</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advance your career with Salesforce certifications. Get exam preparation resources, 
            practice tests, and guidance to help you succeed.
          </p>
        </div>

        {/* Certification Path Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Your Certification Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Choose Your Path</h3>
              <p className="text-blue-100">Select certifications aligned with your career goals</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Prepare & Practice</h3>
              <p className="text-blue-100">Use our study guides and practice exams</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Get Certified</h3>
              <p className="text-blue-100">Pass your exam and earn your credential</p>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="space-y-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{cert.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(cert.difficulty)}`}>
                          {cert.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{cert.description}</p>
                      
                      {/* Exam Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <div className="text-sm text-gray-600">Duration</div>
                          <div className="font-medium">{cert.duration}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Questions</div>
                          <div className="font-medium">{cert.questions}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Passing Score</div>
                          <div className="font-medium">{cert.passingScore}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Cost</div>
                          <div className="font-medium">{cert.cost}</div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Key Skills Tested:</h4>
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Panel */}
                <div className="lg:ml-8 mt-6 lg:mt-0">
                  <div className="bg-gray-50 rounded-xl p-6 text-center min-w-[250px]">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Next Exam Date</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-6">{cert.nextExamDate}</div>
                    
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Schedule Exam
                      </button>
                      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                        Start Prep Course
                      </button>
                      <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                        Practice Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Study Resources */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Study Guides</h3>
              <p className="text-gray-600">Comprehensive guides covering all exam objectives</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Practice Exams</h3>
              <p className="text-gray-600">Simulate real exam conditions with our practice tests</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Exam Tips</h3>
              <p className="text-gray-600">Expert strategies and tips for exam success</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}