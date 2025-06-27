import { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";

interface SearchableComboBoxProps<T> {
  endpoint: string;
  textField: keyof T;
  valueField: keyof T;
  folder_name?: string;
  placeholder?: string;
  image_field?: keyof T;
  onSelect: (item: T) => void;
}

const SearchableComboBox = <T extends object>({endpoint, textField, valueField,
  placeholder = "Search...", image_field = 'image_path' as keyof T, folder_name = '',
  onSelect }: SearchableComboBoxProps<T>) => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(() => {
      searchQuery(query);
      
      //tuve que cambiar esta mierda para que funcione con selectedVal
      setShowDropdown(true);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const searchQuery = async (term: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${endpoint}?term=${(term)}`);
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error("Failed to fetch search results", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: T) => {
    setQuery(item[textField] as string);
    setShowDropdown(false);
    onSelect(item);
  };

  return (
    <div className="position-relative m-2">
      <input
        className="form-control"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {showDropdown && (
        <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
          {isLoading ? (
            <li className="list-group-item text-center">Loading...</li>
          ) : results.length === 0 ? (
            <li className="list-group-item text-center text-muted">No results</li>
          ) : (
            results.map((item) => (
              <li key={item[valueField] as string} className="list-group-item list-group-item-action"
                onClick={() => handleSelect(item)}>
                <div className="d-flex align-items-center">
                    {image_field && folder_name && item[image_field] && (
                        <img
                            src={`${global_vars.UPLOADS_URL}/${folder_name}/${item[image_field]}`}
                            alt={item[textField] as string}
                            className="img-thumbnail"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />  
                    )}
                    <p className="m-3">{item[textField] as string}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchableComboBox;
