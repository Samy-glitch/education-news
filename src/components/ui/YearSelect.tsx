import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

const YearSelect = ({
  selectedYear,
  setSelectedYear,
  className,
}: {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  className?: ClassNameValue;
}) => {
  const [years, setYears] = useState<number[]>([]);
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const yearsArray = [];

    for (let i = startYear; i <= currentYear; i++) {
      yearsArray.push(i);
    }

    setYears(yearsArray);
  }, []);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);

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
      <SelectTrigger className={cn(className)}>
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
