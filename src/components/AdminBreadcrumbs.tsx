import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-1 text-gray-600 hover:text-[#C44569] transition-colors"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            
            {item.path ? (
              <Link 
                to={item.path}
                className="text-gray-600 hover:text-[#C44569] transition-colors"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {item.label}
              </Link>
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
