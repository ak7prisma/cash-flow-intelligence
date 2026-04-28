import { useState, useMemo } from 'react';

export function useFaqSearch<T extends { question: string }>(initialData: T[]) {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return initialData;

    return initialData.filter(item =>
      item.question.toLowerCase().includes(searchTerm)
    );
  }, [search, initialData]);

  const toggleOpen = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return {
    search,
    setSearch,
    filteredData,
    openId,
    toggleOpen,
  };
}