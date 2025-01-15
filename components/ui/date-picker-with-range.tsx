"use client"

import * as React from "react"
import { format, isAfter } from "date-fns"
import { es } from 'date-fns/locale'
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "dd/MM/yyyy", { locale: es })
  }

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
              {fromDate ? formatDate(fromDate) : <span>Seleccionar fecha</span>}
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
              locale={es}
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
              {toDate ? formatDate(toDate) : <span>Seleccionar fecha</span>}
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
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

