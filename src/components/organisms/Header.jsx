import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { AuthContext } from "@/App";

export default function Header({ onSearch }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    loadSavedCount();
  }, []);

  const loadSavedCount = async () => {
    try {
      const saved = await savedPropertyService.getAll();
      setSavedCount(saved.length);
    } catch (error) {
      console.error("Failed to load saved properties count:", error);
      setSavedCount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { path: "/", label: "Buy", icon: "Home" },
    { path: "/map", label: "Map View", icon: "Map" },
    { path: "/saved", label: "Saved", icon: "Heart", badge: savedCount }
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Home" className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PropertyHub
            </span>
          </Link>

          {/* Desktop Search - Show on home page */}
          {location.pathname === "/" && (
            <div className="hidden md:flex flex-1 justify-center px-8">
              <SearchBar onSearch={onSearch} />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-2" />
                {item.label}
                {item.badge > 0 && (
                  <Badge variant="primary" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            
            {/* User Menu */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
              <span className="text-sm text-gray-600">
                Hello, {user?.firstName || 'User'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Search - Show on home page */}
        {location.pathname === "/" && (
          <div className="md:hidden pb-4">
            <SearchBar onSearch={onSearch} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-surface"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                    {item.label}
                  </div>
                  {item.badge > 0 && (
                    <Badge variant="primary">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-4 py-2 text-sm text-gray-600">
                  Hello, {user?.firstName || 'User'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-gray-600 hover:text-gray-800"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}