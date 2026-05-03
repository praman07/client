// ─── Changelog Page ───────────────────────────────────────────────────────────
// Sits on top of canvas (no bg override). All styles via Tailwind semantic classes.
// Entries are read from changelog.json at build time via Vite import.

import { useState, useMemo } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format, isWithinInterval, startOfDay, endOfDay, isSameDay } from 'date-fns';
import changelogData from '../../../../changelog.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/primitives/select';
import { Separator } from '@/shared/ui/primitives/separator';
import { Calendar as CalendarPrimitive } from '@/shared/ui/primitives/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/primitives/pagination';

// ─── Types ────────────────────────────────────────────────────────────────────

type EntryType = 'all' | 'new' | 'improvement' | 'fix';

const ENTRIES_PER_PAGE = 5;

interface ChangelogEntry {
  id: string;
  date: string;
  version: string;
  title: string;
  summary: string;
  items: { type: 'new' | 'improvement' | 'fix'; text: string }[];
}

const ALL_ENTRIES: readonly ChangelogEntry[] = changelogData.entries as readonly ChangelogEntry[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

function getAvailableMonths(entries: readonly ChangelogEntry[]): string[] {
  const months = new Set<string>();
  entries.forEach((e) => {
    const d = parseDate(e.date);
    months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  });
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ─── Constants ─────────────────────────────────────────────────────────────────

type ItemType = 'new' | 'improvement' | 'fix';

const TYPE_BADGE: Record<ItemType, string> = {
  new: 'bg-success-subtle text-success-primary',
  improvement: 'bg-accent-subtle text-accent-primary',
  fix: 'bg-warning-subtle text-warning-primary',
};

const TYPE_LABEL: Record<ItemType, string> = {
  new: 'New',
  improvement: 'Improved',
  fix: 'Fix',
};

// Available years from data
const AVAILABLE_YEARS = ['2026', '2025', '2024'];

// ─── Components ────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: ItemType }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-11 font-semibold uppercase tracking-wide ${TYPE_BADGE[type]}`}
    >
      {TYPE_LABEL[type]}
    </span>
  );
}

function ChangelogEntryRow({ entry, isLast }: { entry: ChangelogEntry; isLast: boolean }) {
  return (
    <div className={`flex gap-8 pb-14 ${!isLast ? 'mb-14 border-b border-subtle' : ''}`}>
      {/* Left — version + date (desktop) */}
      <div className="hidden w-28 shrink-0 flex-col items-end gap-1 pt-0.5 sm:flex">
        <span className="font-code text-13 font-semibold text-accent-primary">
          {entry.version}
        </span>
        <span className="text-12 text-tertiary">{formatDate(entry.date)}</span>
      </div>

      {/* Timeline line */}
      <div className="relative hidden w-px shrink-0 flex-col items-center sm:flex">
        <div className="absolute top-1 h-2 w-2 rounded-full bg-accent-primary" />
        <div className="mt-3 w-px flex-1 border-l border-subtle" />
      </div>

      {/* Right — content */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Mobile version */}
        <div className="flex items-center gap-2 sm:hidden">
          <span className="font-code text-13 font-semibold text-accent-primary">
            {entry.version}
          </span>
          <span className="text-12 text-tertiary">· {formatDate(entry.date)}</span>
        </div>

        <div>
          <h2 className="mb-2 font-heading text-20 font-semibold leading-snug text-primary">
            {entry.title}
          </h2>
          <p className="text-14 leading-relaxed text-secondary">{entry.summary}</p>
        </div>

        <ul className="flex flex-col gap-2.5">
          {entry.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <TypeBadge type={item.type as ItemType} />
              <span className="pt-0.5 text-14 leading-relaxed text-secondary">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Date Range Display ───────────────────────────────────────────────────────

function DateRangeDisplay({
  from,
  to,
  onClear,
}: {
  from: Date | undefined;
  to: Date | undefined;
  onClear: () => void;
}) {
  if (!from) return <span className="text-tertiary">Custom range</span>;

  if (to && !isSameDay(from, to)) {
    return (
      <span className="flex items-center gap-2">
        <span className="text-13 text-primary">
          {format(from, 'MMM d')} – {format(to, 'MMM d, yyyy')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="text-tertiary hover:text-primary transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="text-13 text-primary">{format(from, 'MMM d, yyyy')}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        className="text-tertiary hover:text-primary transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ChangelogPage() {
  const [typeFilter, setTypeFilter] = useState<EntryType>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Month filter — "YYYY-MM" or "all"
  const [monthFilter, setMonthFilter] = useState<string>('all');

  // Date range — for calendar-based custom range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let result = ALL_ENTRIES;

    // Month filter
    if (monthFilter !== 'all') {
      result = result.filter((e) => e.date.startsWith(monthFilter));
    }

    // Date range filter
    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = dateRange.to ? endOfDay(dateRange.to) : from;
      result = result.filter((e) => {
        const entryDate = parseDate(e.date);
        return isWithinInterval(entryDate, { start: from, end: to });
      });
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((e) => e.items.some((item) => item.type === typeFilter));
    }

    return result;
  }, [monthFilter, dateRange, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ENTRIES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEntries = filteredEntries.slice(
    (safePage - 1) * ENTRIES_PER_PAGE,
    safePage * ENTRIES_PER_PAGE,
  );

  function handleFilterChange() {
    setCurrentPage(1);
  }

  // Clear all date filters
  function clearDateFilters() {
    setMonthFilter('all');
    setDateRange(undefined);
    handleFilterChange();
  }

  const hasDateFilter = monthFilter !== 'all' || dateRange?.from;

  // Page number generation
  function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
    if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
    return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
  }

  const pageNumbers = getPageNumbers(safePage, totalPages);
  const availableMonths = getAvailableMonths(ALL_ENTRIES);

  return (
    <div className="bg-surface-1 mx-auto w-full max-w-[720px] px-6 py-20">
      {/* Page header */}
      <div className="mb-14">
        <p className="mb-3 font-code text-13 font-medium uppercase tracking-wide text-tertiary">
          Collabifyy
        </p>
        <h1 className="mb-4 font-heading text-32 font-semibold leading-tight text-primary">
          Changelog
        </h1>
        <p className="text-16 leading-relaxed text-secondary">
          A running log of what's been shipped. Built in public — feedback welcome.
        </p>
      </div>

      {/* Filters row */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Date / Calendar filter */}
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-tertiary" />

          {/* Month select */}
          <Select
            value={monthFilter}
            onValueChange={(val) => {
              if (val) {
                setMonthFilter(val);
                setDateRange(undefined);
                handleFilterChange();
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {monthLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom range via calendar popover */}
          <Popover>
            <PopoverTrigger>
              <button
                className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-13 transition-colors ${
                  dateRange?.from
                    ? 'border-accent-strong bg-accent-subtle text-primary'
                    : 'border-subtle-1 bg-layer-1 text-secondary hover:border-subtle-2'
                }`}
              >
                {dateRange?.from ? (
                  <DateRangeDisplay
                    from={dateRange.from}
                    to={dateRange.to}
                    onClear={() => {
                      setDateRange(undefined);
                      handleFilterChange();
                    }}
                  />
                ) : (
                  <span className="text-tertiary">Custom range</span>
                )}
                <ChevronDown className="size-3.5 text-tertiary" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarPrimitive
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  handleFilterChange();
                }}
                numberOfMonths={2}
                className="bg-surface-2"
              />
            </PopoverContent>
          </Popover>

          {/* Clear date filters */}
          {hasDateFilter && (
            <button
              onClick={clearDateFilters}
              className="flex h-8 items-center gap-1.5 px-2 text-13 text-tertiary hover:text-primary transition-colors"
            >
              <X className="size-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <span className="text-13 text-tertiary">Show:</span>
          <Select
            value={typeFilter}
            onValueChange={(val) => {
              setTypeFilter(val as EntryType);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="new">New features</SelectItem>
              <SelectItem value="improvement">Improvements</SelectItem>
              <SelectItem value="fix">Bug fixes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-13 text-tertiary">
          {filteredEntries.length === 0
            ? 'No entries found'
            : `Showing ${(safePage - 1) * ENTRIES_PER_PAGE + 1}–${Math.min(safePage * ENTRIES_PER_PAGE, filteredEntries.length)} of ${filteredEntries.length} entries`}
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Entries */}
      {paginatedEntries.length > 0 ? (
        <div className="flex flex-col">
          {paginatedEntries.map((entry, i) => (
            <ChangelogEntryRow key={entry.id} entry={entry} isLast={i === paginatedEntries.length - 1} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-14 text-secondary">No entries match your filters.</p>
          <button
            onClick={() => {
              clearDateFilters();
              setTypeFilter('all');
              handleFilterChange();
            }}
            className="mt-3 text-13 text-accent-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage > 1) setCurrentPage(safePage - 1);
                  }}
                  className={safePage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {pageNumbers.map((page, idx) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage < totalPages) setCurrentPage(safePage + 1);
                  }}
                  className={safePage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}