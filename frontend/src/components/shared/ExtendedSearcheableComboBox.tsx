import { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";

interface ExtendedSearchableComboBoxProps<T> {
  endpoint: string;
  textSelector : (item: T) => string;
  valueSelector : (item: T) => string | number;
  searchOnEmptyQuery?: boolean;
  folder_name?: string;
  placeholder?: string;
  image_field?: keyof T;
  additionalFieldsSelectors?: ((item : T) => string)[];
  onSelect: (item: T) => void;
}

const ExtendedSearchableComboBox = <T extends object>({endpoint, textSelector, valueSelector, searchOnEmptyQuery = false,
  placeholder = "Search...", image_field = 'image_path' as keyof T, folder_name = '',
  additionalFieldsSelectors = [],
  onSelect }: ExtendedSearchableComboBoxProps<T>) => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0 && !searchOnEmptyQuery) {
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
    setQuery(textSelector(item) as string);
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
              <li key={valueSelector(item) as string} className="list-group-item list-group-item-action"
                onClick={() => handleSelect(item)}>
                <div className="d-flex align-items-center">
                    {image_field && folder_name && item[image_field] && (
                        <img
                            src={`${global_vars.UPLOADS_URL}/${folder_name}/${item[image_field]}`}
                            alt={textSelector(item) as string}
                            className="img-thumbnail"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />  
                    )}
                    <p className="m-3">{textSelector(item) as string}</p>
                    {additionalFieldsSelectors.map((fieldSelector : (item : T) => string, index : number) => (
                        <p key={index} className="m-3">
                            {fieldSelector(item)}
                        </p>
                    ))}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ExtendedSearchableComboBox;
