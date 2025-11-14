import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  page?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (page: string) => void;
}

export function AdminBreadcrumbs({ items, onNavigate }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <button
            onClick={() => onNavigate?.('analytics-dashboard')}
            className="flex items-center gap-1 text-gray-600 hover:text-[#C44569] transition-colors cursor-pointer"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
            type="button"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            
            {item.page ? (
              <button
                onClick={() => onNavigate?.(item.page!)}
                className="text-gray-600 hover:text-[#C44569] transition-colors cursor-pointer"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                type="button"
              >
                {item.label}
              </button>
            ) : (
              <span 
                className="text-[#2B2B2B] font-semibold"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
