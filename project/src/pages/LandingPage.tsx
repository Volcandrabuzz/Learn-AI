import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Target, Users, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/generate');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Students Through
              <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Interactive AI-Driven Learning
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your learning experience with personalized AI tutoring, dynamic quizzes, 
              and interactive flashcards designed to help you master any topic.
            </p>
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span>Let's Jump to Learning</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Learning Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of education with AI-powered features designed to enhance your learning journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: 'Personalized Learning',
                description: 'AI adapts to your learning style and pace for optimal results.',
              },
              {
                icon: Brain,
                title: 'Interactive Quizzes',
                description: 'Test your knowledge with dynamic, challenging quizzes.',
              },
              {
                icon: Zap,
                title: 'Smart Flashcards',
                description: 'Reinforce learning with AI-generated memory cards.',
              },
              {
                icon: Users,
                title: 'Progress Tracking',
                description: 'Monitor your improvement with detailed analytics.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;