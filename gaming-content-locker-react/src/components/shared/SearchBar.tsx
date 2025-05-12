import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceTime?: number;
};

export function SearchBar({
  onSearch,
  placeholder = "Search games...",
  value: externalValue,
  onChange: externalOnChange,
  debounceTime = 300
}: SearchBarProps) {
  const [query, setQuery] = useState(externalValue || "");
  const isControlled = externalValue !== undefined && externalOnChange !== undefined;

  // Sync with external value when in controlled mode
  useEffect(() => {
    if (isControlled && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue, isControlled, query]);

  // Setup debounced search
  useEffect(() => {
    if (!isControlled && query.trim() !== "") {
      const handler = setTimeout(() => {
        onSearch(query);
      }, debounceTime);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [query, onSearch, isControlled, debounceTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    // In controlled mode, we let the parent component handle the value
    if (isControlled) {
      externalOnChange(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    if (isControlled) {
      externalOnChange("");
    }
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-full mx-auto">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pr-20 border-[#00f7ff]/30 focus:border-[#00f7ff] focus:ring-[#00f7ff] bg-card/50 backdrop-blur-sm h-12 text-base"
      />

      {query && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleClear}
          className="absolute right-12 h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <Button
        type="submit"
        size="icon"
        className="absolute right-1 bg-[#00f7ff] hover:bg-[#00c4cc] text-primary-foreground"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
