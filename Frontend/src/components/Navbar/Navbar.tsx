import React from "react";
import { Camera, Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <Camera className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              AI Caption
            </span>
          </div>

          {/* Auth Buttons + Theme Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate("generatecaption")}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Generate Caption
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Welcome, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("login")}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate("register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </button>
              </>
            )}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onNavigate("home");
                  setIsMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors ${
                  currentPage === "home"
                    ? "text-blue-600"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                Home
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onNavigate("generatecaption");
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors ${
                    currentPage === "generatecaption"
                      ? "text-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                  }`}
                >
                  Generate Caption
                </button>
              )}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Welcome, {user?.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-fit"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onNavigate("login");
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("register");
                        setIsMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-fit"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
