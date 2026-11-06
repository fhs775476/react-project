'use client'

import { useState } from 'react'

const pageSize = 5

export default function PaginatedList({ items, className, emptyState, renderItem, label }) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1)
    .filter((number) => number === 1 || number === pageCount || Math.abs(number - currentPage) <= 1)

  return (
    <>
      <div className={className}>
        {pageItems.map(renderItem)}
        {items.length === 0 && emptyState}
      </div>
      {items.length > 0 && <nav className="pagination" aria-label={`${label}分页`}>
        <span>第 {start + 1}–{Math.min(start + pageSize, items.length)} 条，共 {items.length} 条</span>
        <div className="pagination-controls">
          <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>上一页</button>
          {pageNumbers.map((number, index) => (
            <span className="pagination-slot" key={number}>
              {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="pagination-ellipsis" aria-hidden="true">…</span>}
              <button type="button" className={number === currentPage ? 'active' : ''} aria-current={number === currentPage ? 'page' : undefined} aria-label={`第 ${number} 页`} onClick={() => setPage(number)}>{number}</button>
            </span>
          ))}
          <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount}>下一页</button>
        </div>
      </nav>}
    </>
  )
}
