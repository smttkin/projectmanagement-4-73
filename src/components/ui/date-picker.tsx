
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  mode?: "single" | "range" | "multiple";
  initialFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  selected,
  onSelect,
  mode = "single",
  initialFocus,
  disabled,
  className,
}: DatePickerProps) {
  return (
    <Calendar
      mode={mode}
      selected={selected}
      onSelect={onSelect as any}
      initialFocus={initialFocus}
      disabled={disabled}
      className={cn("rounded-md border", className)}
    />
  );
}
