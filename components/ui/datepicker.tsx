"use client"

import * as React from "react"
import { format } from "date-fns"
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

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      setDate(selectedDate)
      setOpen(false)
    },
    [setDate]
  )

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
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}