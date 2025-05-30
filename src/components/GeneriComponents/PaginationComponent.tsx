"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationComponentProps {
  pageCount: number
  pageIndex: number
  onPageChange: (page: number) => void
}

export default function PaginationComponent({ pageCount, pageIndex, onPageChange }: PaginationComponentProps) {
  // Ne rien afficher si une seule page ou moins
  if (pageCount <= 1) {
    return null
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (pageCount <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 0; i < pageCount; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page
      pages.push(0)

      // Calculate start and end of page range around current page
      let startPage = Math.max(1, pageIndex - 1)
      let endPage = Math.min(pageCount - 2, pageIndex + 1)

      // Adjust if we're near the beginning
      if (pageIndex <= 1) {
        endPage = 3
      }

      // Adjust if we're near the end
      if (pageIndex >= pageCount - 2) {
        startPage = pageCount - 4
      }

      // Add ellipsis before middle pages if needed
      if (startPage > 1) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis after middle pages if needed
      if (endPage < pageCount - 2) {
        pages.push(-2) // -2 represents ellipsis
      }

      // Always include last page
      pages.push(pageCount - 1)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (pageIndex > 0) {
                onPageChange(pageIndex - 1)
              }
            }}
            className={pageIndex === 0 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((page, i) => {
          if (page < 0) {
            // Render ellipsis
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
                isActive={page === pageIndex}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (pageIndex < pageCount - 1) {
                onPageChange(pageIndex + 1)
              }
            }}
            className={pageIndex === pageCount - 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
