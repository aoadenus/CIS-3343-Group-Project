import { ReactNode } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Download, FileDown } from 'lucide-react';

interface ReportLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  exportingCSV?: boolean;
  exportingPDF?: boolean;
  filters?: ReactNode;
}

export function ReportLayout({
  title,
  description = '',
  children,
  onExportCSV,
  onExportPDF,
  exportingCSV = false,
  exportingPDF = false,
  filters
}: ReportLayoutProps) {
  return (
    <div className="min-h-screen p-6" style={{ background: '#F8EBD7' }}>
      {/* Report Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '32px',
              fontWeight: 700,
              color: '#2B2B2B',
              marginBottom: '8px'
            }}>
              {title}
            </h1>
            <p style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '14px',
              color: '#5A3825'
            }}>
              {description}
            </p>
          </div>

          {/* Export Buttons */}
          {(onExportCSV || onExportPDF) && (
            <div className="flex gap-3">
              {onExportCSV && (
                <Button
                  onClick={onExportCSV}
                  disabled={exportingCSV}
                  style={{
                    background: 'white',
                    color: '#C44569',
                    border: '2px solid #C44569',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {exportingCSV ? 'Exporting...' : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </>
                  )}
                </Button>
              )}
              {onExportPDF && (
                <Button
                  onClick={onExportPDF}
                  disabled={exportingPDF}
                  style={{
                    background: '#C44569',
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {exportingPDF ? 'Exporting...' : (
                    <>
                      <FileDown className="w-4 h-4 mr-2" />
                      Export PDF
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Filters Section */}
        {filters && (
          <Card className="p-4 mb-4" style={{ background: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {filters}
          </Card>
        )}
      </div>

      {/* Report Content */}
      {children}
    </div>
  );
}
