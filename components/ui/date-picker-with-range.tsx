"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  fromDate: Date | undefined
  toDate: Date | undefined
  onFromChange: (date: Date | undefined) => void
  onToChange: (date: Date | undefined) => void
}

export function DatePickerWithRange({
  className,
  fromDate,
  toDate,
  onFromChange,
  onToChange,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !fromDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fromDate ? format(fromDate, "PPP") : <span>Fecha inicial</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={fromDate}
            onSelect={onFromChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !toDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {toDate ? format(toDate, "PPP") : <span>Fecha final</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate}
            onSelect={onToChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

