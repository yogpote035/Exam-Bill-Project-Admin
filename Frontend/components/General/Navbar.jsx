import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../AllStateStore/AuthenticationSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.authentication.user);
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setProfileOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
      if (isOpen && !event.target.closest('.mobile-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen, isOpen]);

  return (
    <nav className="bg-white shadow-lg fixed top-0 w-full border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="font-semibold text-slate-900 text-lg hidden sm:block">
                Staff Remuneration
              </span>
              <span className="font-semibold text-slate-900 text-sm sm:hidden">
                SR System
              </span>
            </Link>

            {/* Navigation Links - Desktop & Tablet */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 ml-4 lg:ml-8">
              <Link
                to="/teachers"
                className="text-slate-700 hover:text-slate-900 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
              >
                Teachers
              </Link>
              <Link
                to="/bills"
                className="text-slate-700 hover:text-slate-900 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
              >
                Bills
              </Link>
              <Link
                to="/profile"
                className="text-slate-700 hover:text-slate-900 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Search bar - Hidden on mobile, smaller on tablet */}
            {/* <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder={isTablet ? "Search..." : "Search teachers or bills..."}
                  className="w-32 lg:w-48 xl:w-64 pl-8 lg:pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-2 lg:pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 lg:h-5 lg:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div> */}

            {/* Notifications - Hidden on mobile */}
            {/* <div className="hidden sm:block relative">
              <button className="p-1 sm:p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
            </div> */}

            {/* User profile */}
            {isAuthenticated ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {user?.name?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.role || 'Administrator'}
                    </p>
                  </div>
                  <svg 
                    className={`h-4 w-4 text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <Link
                      to="/edit-profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Change Password
                    </Link>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors mobile-menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white mobile-menu">
            <div className="px-4 py-3 space-y-1">
              {/* Search in mobile menu */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search teachers or bills..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <Link
                to="/teachers"
                className="block px-3 py-2 text-slate-700 hover:text-slate-900 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Teachers
              </Link>
              <Link
                to="/bills"
                className="block px-3 py-2 text-slate-700 hover:text-slate-900 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Bills
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-slate-700 hover:text-slate-900 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              
              <div className="border-t border-slate-200 pt-2 mt-2">
                <Link
                  to="/edit-profile"
                  className="block px-3 py-2 text-slate-600 hover:text-slate-900 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Edit Profile
                </Link>
                <Link
                  to="/change-password"
                  className="block px-3 py-2 text-slate-600 hover:text-slate-900 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Change Password
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="border-t border-slate-200 pt-2 mt-2 flex space-x-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center px-4 py-2 bg-slate-900 text-white rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;