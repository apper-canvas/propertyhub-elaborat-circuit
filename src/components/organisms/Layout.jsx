import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "@/components/organisms/Header";
import { AuthContext } from "@/App";

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isInitialized } = useContext(AuthContext);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login');
    }
  }, [isInitialized, isAuthenticated, navigate]);

  const handleSearch = (query) => {
    // This will be implemented to filter properties
    console.log("Searching for:", query);
  };

  // Don't render until authentication is checked
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-screen w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}