import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function SearchBar({ onSearch, placeholder = "Search by location, address, or property type..." }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-2xl">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4 h-12 text-base rounded-r-none border-r-0 focus:ring-primary/30"
        />
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        size="lg"
        className="rounded-l-none px-6 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg"
      >
        <ApperIcon name="Search" className="h-5 w-5" />
      </Button>
    </form>
  );
}