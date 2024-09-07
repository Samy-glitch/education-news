import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const YearSelect = () => {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990; // Set the lowest year to 1990
    const yearsArray = [];

    for (let i = startYear; i <= currentYear; i++) {
      yearsArray.push(i);
    }

    setYears(yearsArray);
  }, []);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);

    // Auto-add new year if not in list
    const currentYear = new Date().getFullYear();
    if (year === currentYear && !years.includes(currentYear + 1)) {
      setYears([...years, currentYear + 1]);
    }
  };

  return (
    <Select
      onValueChange={(value) => handleYearChange(Number(value))}
      defaultValue={String(selectedYear)}
    >
      <SelectTrigger>
        <SelectValue>{selectedYear}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelect;
