import { useState } from 'react';
import { 
  standardCakes, 
  cakeFlavors, 
  fillingFlavors, 
  icingFlavors, 
  icingColors, 
  decorations 
} from '../../data/cakeOptions';

type FilterCategory = 'standard-cakes' | 'cake-flavors' | 'fillings' | 'icing-colors' | 'icing-flavors' | 'decorations';

const filterTabs = [
  { id: 'standard-cakes' as FilterCategory, label: 'Standard Cakes' },
  { id: 'cake-flavors' as FilterCategory, label: 'Cake Flavors' },
  { id: 'fillings' as FilterCategory, label: 'Fillings' },
  { id: 'icing-colors' as FilterCategory, label: 'Icing Colors' },
  { id: 'icing-flavors' as FilterCategory, label: 'Icing Flavors' },
  { id: 'decorations' as FilterCategory, label: 'Decorations' }
];

interface GalleryCardProps {
  title: string;
  description: string;
  imagePlaceholder?: string;
  colorHex?: string;
}

function GalleryCard({ title, description, imagePlaceholder, colorHex }: GalleryCardProps) {
  return (
    <div
      className="gallery-card"
      style={{
        background: '#FAF5F0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(90, 56, 37, 0.08)',
        overflow: 'hidden',
        transition: 'all 200ms ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(90, 56, 37, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image Section */}
      <div
        style={{
          height: '240px',
          width: '100%',
          background: colorHex || imagePlaceholder || 'linear-gradient(135deg, #F8EBD7 0%, #FAF5F0 100%)',
          borderRadius: '12px 12px 0 0'
        }}
      />

      {/* Content Section */}
      <div style={{ padding: '16px', background: '#FAF5F0' }}>
        <h3
          style={{
            fontFamily: 'Poppins',
            fontSize: '18px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'Open Sans',
            fontSize: '14px',
            fontWeight: 400,
            color: '#5A3825',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState<FilterCategory>('standard-cakes');

  const renderContent = () => {
    let items: { title: string; description: string; imagePlaceholder?: string; colorHex?: string }[] = [];

    switch (activeTab) {
      case 'standard-cakes':
        items = standardCakes.map(cake => ({
          title: cake.name,
          description: cake.description || `Delicious ${cake.name} cake`,
          imagePlaceholder: 'linear-gradient(135deg, #FFE5E5 0%, #FFF5F5 100%)'
        }));
        break;
      
      case 'cake-flavors':
        items = cakeFlavors.map(flavor => ({
          title: flavor.name,
          description: `Classic ${flavor.name.toLowerCase()} cake flavor, perfectly balanced and delicious.`,
          imagePlaceholder: 'linear-gradient(135deg, #F8EBD7 0%, #FAF5F0 100%)'
        }));
        break;
      
      case 'fillings':
        items = fillingFlavors.map(filling => ({
          title: filling.name,
          description: `Rich and creamy ${filling.name.toLowerCase()} filling for your custom cake layers.`,
          imagePlaceholder: 'linear-gradient(135deg, #F5E5D5 0%, #FFF5ED 100%)'
        }));
        break;
      
      case 'icing-colors':
        items = icingColors.map(color => ({
          title: color.name,
          description: `Beautiful ${color.name.toLowerCase()} shade for your cake icing and decorative writing.`,
          colorHex: color.hex
        }));
        break;
      
      case 'icing-flavors':
        items = icingFlavors.map(icing => ({
          title: icing.name,
          description: `Smooth and delicious ${icing.name.toLowerCase()} icing for the perfect cake finish.`,
          imagePlaceholder: 'linear-gradient(135deg, #F3E5FF 0%, #FAF0FF 100%)'
        }));
        break;
      
      case 'decorations':
        items = decorations.map(deco => ({
          title: deco.name,
          description: `Add ${deco.name.toLowerCase()} to make your cake extra special and memorable.`,
          imagePlaceholder: 'linear-gradient(135deg, #FFF9E5 0%, #FFFEF5 100%)'
        }));
        break;
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          padding: '40px 24px'
        }}
      >
        {items.map((item, index) => (
          <GalleryCard
            key={index}
            title={item.title}
            description={item.description}
            imagePlaceholder={item.imagePlaceholder}
            colorHex={item.colorHex}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Tab Navigation */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'white',
          borderBottom: '1px solid #E8D5C4',
          padding: '16px 0'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: 'Poppins',
                fontSize: '15px',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#C44569' : 'transparent',
                color: activeTab === tab.id ? '#FAF5F0' : '#5A3825',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(196, 69, 105, 0.1)';
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {renderContent()}
      </div>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #C44569 0%, #8B1E3E 100%)',
          padding: '60px 24px',
          textAlign: 'center',
          color: '#FAF5F0'
        }}
      >
        <h2
          style={{
            fontFamily: 'Playfair Display',
            fontSize: '32px',
            fontWeight: 700,
            color: '#FAF5F0',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}
        >
          Ready to Order Your Perfect Cake?
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans',
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(250, 245, 240, 0.9)',
            marginBottom: '32px',
            margin: '0 0 32px 0'
          }}
        >
          Call us today to discuss your custom cake design
        </p>
        <a
          href="tel:713-555-2253"
          style={{
            display: 'inline-block',
            background: '#FAF5F0',
            color: '#C44569',
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontWeight: 600,
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.background = '#F8EBD7';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.background = '#FAF5F0';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Call (713) 555-CAKE
        </a>
      </section>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .gallery-card {
            max-width: 100%;
          }
          .gallery-card > div:first-child {
            height: 180px !important;
          }
          .gallery-card h3 {
            font-size: 16px !important;
          }
          .gallery-card p {
            font-size: 13px !important;
          }
          .gallery-card > div:last-child {
            padding: 12px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1023px) {
          .gallery-card > div:first-child {
            height: 220px !important;
          }
        }

        @media (min-width: 1024px) {
          .gallery-card {
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
}

export { Menu };
