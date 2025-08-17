import React, { useState } from 'react';
import { Camera, Zap, Users, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import LoginPage from '../login/LoginPage';
import RegisterPage from "../register/RegisterPage"


function LandingPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigate = (page: string) => {
    if (page === 'generatecaption') {
      if (isAuthenticated) {
        navigate('/generatecaption');
      } else {
        setCurrentPage('login');
      }
    } else {
      setCurrentPage(page);
    }
  };

  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 sm:py-32 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 dark:border-gray-700">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Technology</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Generate Perfect
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Captions </span>
              for Any Image
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your images into engaging stories with our advanced AI caption generator. 
              Create compelling descriptions in seconds that capture every detail and emotion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => isAuthenticated ? handleNavigate('generatecaption') : handleNavigate('register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>{isAuthenticated ? 'Generate Caption' : 'Get Started Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {!isAuthenticated && (
                <button 
                  onClick={() => handleNavigate('login')}
                  className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Our AI Caption Generator?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powered by advanced machine learning algorithms to deliver accurate, engaging captions for every image.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Generate high-quality captions in seconds. Our AI processes images instantly for immediate results.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">High Accuracy</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our advanced AI model understands context, emotions, and visual elements for precise descriptions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Simple drag-and-drop interface. No technical knowledge required. Perfect for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Images?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of creators, marketers, and content professionals who trust our AI caption generator.
          </p>
          <button 
            onClick={() => isAuthenticated ? handleNavigate('generatecaption') : handleNavigate('register')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2"
          >
            <span>{isAuthenticated ? 'Generate Caption' : 'Get Started Now'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">AI Captions</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most advanced AI caption generator for creating engaging, accurate descriptions for any image.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; Developed by Santanu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
