"use client"

import * as React from "react"
import { format, isAfter } from "date-fns"
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
  const today = new Date()

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <label htmlFor="from-date" className="text-sm font-medium">
          Desde:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="from-date"
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "PPP") : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                if (date && (!toDate || isAfter(toDate, date))) {
                  onFromChange(date)
                }
              }}
              disabled={(date) => isAfter(date, toDate || today)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <label htmlFor="to-date" className="text-sm font-medium">
          Hasta:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="to-date"
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "PPP") : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                if (date && (!fromDate || isAfter(date, fromDate))) {
                  onToChange(date)
                }
              }}
              disabled={(date) => isAfter(date, today) || (fromDate && isAfter(fromDate, date))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

