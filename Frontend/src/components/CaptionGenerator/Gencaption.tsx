import React, { useState, useCallback, useRef } from 'react';
import { Copy, Sparkles, Globe, Upload, Check, Loader2, X, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';


// Ensure cookies are included in all requests
const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    }
  });
};

interface Translation {
  [key: string]: string;
}

const languages = [
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
   { code: 'bengali', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'odia', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' }

];

function Gencaption() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState('generatecaption');
  const [translations, setTranslations] = useState<Translation>({});

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Handle navigation logic here if needed
  };

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          setSelectedImage(result);
        }
        setGeneratedCaption('');
        setSelectedLanguage('english');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const generateCaption = useCallback(async () => {
    if (!selectedImage) return;
    
    setIsGenerating(true);
    try {
      // Convert base64 image to file
      const base64Data = selectedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Send request to backend
      const response = await fetch(`https://caption-generator-q86a.onrender.com/api/posts/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setGeneratedCaption(data.post.caption || 'No caption generated');
      setSelectedLanguage('english');
    } catch (error) {
      console.error('Error generating caption:', error);
      setGeneratedCaption('Failed to generate caption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedImage]);

  const translateCaption = useCallback(async (language: string) => {
    if (!generatedCaption || language === selectedLanguage) return;
    
    setIsTranslating(true);
    setSelectedLanguage(language);
    
    try {
      const response = await fetchWithCredentials(`https://caption-generator-q86a.onrender.com/api/translate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: generatedCaption,
          targetLanguage: language
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslations(prev => ({
        ...prev,
        [language]: data.translatedText
      }));
    } catch (error) {
      console.error('Translation error:', error);
      // Keep the original text if translation fails
      setTranslations(prev => ({
        ...prev,
        [language]: generatedCaption
      }));
    } finally {
      setIsTranslating(false);
    }
  }, [generatedCaption, selectedLanguage, `https://caption-generator-q86a.onrender.com/api`]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setGeneratedCaption('');
    setSelectedLanguage('english');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const getCurrentText = () => {
    // For english, show the original caption
    if (selectedLanguage === 'english') {
      return generatedCaption;
    }
    // For other languages, show the translation if available
    return translations[selectedLanguage] || generatedCaption;
  };


  const currentText = getCurrentText();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome back, <span className="font-semibold text-blue-600">{user?.username}</span>!
            </p>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Image Caption Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Upload any image and get AI-generated captions with instant translation to 5 languages
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upload Your Image</h2>
          </div>
          
          {!selectedImage ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-full max-h-96 object-contain rounded-2xl shadow-lg bg-gray-50"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    setSelectedImage(null);
                  }}
                />
                <button
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/50 dark:bg-gray-900/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                  Image uploaded successfully
                </div>
              </div>
              
              <button
                onClick={generateCaption}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Caption
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Generated Caption Section */}
        {generatedCaption && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Generated Caption</h2>
              </div>
              <button
                onClick={() => copyToClipboard(currentText)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                {copiedText === currentText ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Language Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => translateCaption(lang.code)}
                  disabled={isTranslating}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedLanguage === lang.code
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  } disabled:opacity-50`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
            
            {/* Caption Display */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 relative">
              {isTranslating ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">Translating...</span>
                </div>
              ) : (
                <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                  {currentText}
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
                  {languages.find(l => l.code === selectedLanguage)?.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Advanced AI analyzes your images to generate contextual captions</p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Multi-Language</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Instant translation to 5 different languages with native script support</p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Smart Captions</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Engaging, social media-ready captions that capture the essence of your images</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Powered by AI Vision • Supporting 5 languages • Built with ❤️
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Gencaption;