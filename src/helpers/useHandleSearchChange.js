import { useState, useCallback } from "react";

const useHandleSearchChange = (allData, setResults, setDefaultState) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = useCallback(
    (e) => {
      const search = e.target.value;
      setSearchInput(search);
      const result = search.length
        ? allData.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : [];
      setResults(result);
      setDefaultState(search.length === 0);
    },
    [allData, setResults, setDefaultState]
  );

  return { searchInput, handleSearchChange };
};

export default useHandleSearchChange;
