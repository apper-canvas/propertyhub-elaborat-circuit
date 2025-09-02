import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

export default function Layout() {
  const handleSearch = (query) => {
    // This will be implemented to filter properties
    console.log("Searching for:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}