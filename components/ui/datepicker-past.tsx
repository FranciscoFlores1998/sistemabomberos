"use client"

import * as React from "react"
import { format, subYears, setYear, getYear } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerPastProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DatePickerPast({ date, setDate }: DatePickerPastProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date>(date || new Date())

  const today = new Date()
  const toYear = today.getFullYear()
  const fromYear = toYear - 100  // Permitir selección hasta 100 años en el pasado

  const years = React.useMemo(() => 
    Array.from({ length: toYear - fromYear + 1 }, (_, i) => toYear - i),
    [toYear, fromYear]
  )

  const handleYearChange = React.useCallback((selectedYear: string) => {
    const year = parseInt(selectedYear, 10)
    setMonth(prevMonth => setYear(prevMonth, year))
  }, [])

  const handleDateSelect = React.useCallback((newDate: Date | undefined) => {
    if (newDate && newDate <= today) {
      setDate(newDate)
      setMonth(newDate)
      setOpen(false)
    }
  }, [setDate, today])

  const handleMonthChange = React.useCallback((newMonth: Date) => {
    setMonth(newMonth)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex justify-center p-2">
          <Select onValueChange={handleYearChange} value={getYear(month).toString()}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={month}
          onMonthChange={handleMonthChange}
          initialFocus
          fromDate={new Date(fromYear, 0, 1)}
          toDate={today}
          disabled={(date) => date > today}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}

