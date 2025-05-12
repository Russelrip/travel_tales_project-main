"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="outline"
        className="gap-1"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" className="gap-1" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage}>
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
