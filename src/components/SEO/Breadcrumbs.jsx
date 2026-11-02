import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * @param {Array} items - Array of { name: string, path: string }
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 sm:px-6 max-w-7xl mx-auto w-full text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap"
    >
      <ol className="flex items-center gap-1.5 sm:gap-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors font-medium"
            title="Averqon Home"
          >
            <Home size={14} className="flex-shrink-0" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path || item.name} className="inline-flex items-center gap-1.5 sm:gap-2">
              <ChevronRight size={13} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
              {isLast ? (
                <span
                  className="font-semibold text-primary truncate max-w-[200px] sm:max-w-xs"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-slate-500 hover:text-primary transition-colors font-medium truncate max-w-[150px] sm:max-w-none"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

