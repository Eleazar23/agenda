import { useMemo } from "react";

export function useFilteredRowData<T>(
  data: T[],
  searchTerm: string | undefined,
  fields: Array<keyof T>,
): T[] {
  const fieldsKey = fields.join(",");

  return useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      fields.some((field) => {
        const value = row[field];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(lowerSearchTerm)
        );
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchTerm, fieldsKey]);
}
