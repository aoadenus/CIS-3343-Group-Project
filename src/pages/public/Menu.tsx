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
        items = cakeFlavors.map(flavor => {
          const descriptions: { [key: string]: string } = {
            'Vanilla': 'Timeless vanilla with rich, aromatic flavor perfect for any celebration.',
            'Almond': 'Sophisticated almond cake with delicate nutty essence and elegance.',
            'Yellow': 'Classic buttery yellow cake, moist and tender with homestyle taste.',
            "Devil's Food Chocolate": 'Decadent dark chocolate with intense cocoa flavor and velvety texture.',
            'Chocolate': 'Rich, indulgent chocolate delivering pure cocoa satisfaction.',
            'Strawberry': 'Light and fruity with fresh berry flavor and natural sweetness.'
          };
          return {
            title: flavor.name,
            description: descriptions[flavor.name] || `Premium ${flavor.name.toLowerCase()} cake flavor crafted for exceptional taste.`,
            imagePlaceholder: 'linear-gradient(135deg, #F8EBD7 0%, #FAF5F0 100%)'
          };
        });
        break;
      
      case 'fillings':
        items = fillingFlavors.map(filling => {
          const descriptions: { [key: string]: string } = {
            'White Buttercream': 'Silky smooth classic buttercream with light vanilla essence.',
            'Chocolate Buttercream': 'Luxuriously rich with deep cocoa flavor that melts in your mouth.',
            'Almond Buttercream': 'Delicate almond-infused with sophisticated nutty sweetness.',
            'Cream Cheese': 'Tangy and creamy with the perfect balance of richness.',
            'Lemon Curd': 'Bright and zesty with the perfect sweet-tart balance.',
            'Strawberry': 'Fresh filling made with real fruit for vibrant berry flavor.',
            'Raspberry': 'Tart and sweet bringing a burst of summer to every bite.',
            'Rum-Strawberry': 'Elevated strawberry with subtle rum infusion for adult celebrations.',
            'Pecan Praline': 'Buttery praline studded with toasted pecans for Southern charm.',
            'Chocolate Mousse': 'Light and airy with an elegant, melt-in-your-mouth texture.',
            'Lemon Mousse': 'Delicate mousse combining citrus brightness with cloud-like softness.',
            'Strawberry Mousse': 'Ethereal filling with fresh fruit flavor and silky smoothness.',
            'Raspberry Mousse': 'Velvety mousse with intense berry flavor and luxurious texture.',
            'White Chocolate Mousse': 'Creamy filling that adds pure indulgence to any cake.',
            'Mango Mousse': 'Tropical mousse with exotic fruit flavor and heavenly lightness.'
          };
          return {
            title: filling.name,
            description: descriptions[filling.name] || `Premium ${filling.name.toLowerCase()} filling crafted to perfection.`,
            imagePlaceholder: 'linear-gradient(135deg, #F5E5D5 0%, #FFF5ED 100%)'
          };
        });
        break;
      
      case 'icing-colors':
        items = icingColors.map(color => ({
          title: color.name,
          description: `Beautiful ${color.name.toLowerCase()} for stunning icing designs and custom writing.`,
          colorHex: color.hex
        }));
        break;
      
      case 'icing-flavors':
        items = icingFlavors.map(icing => {
          const descriptions: { [key: string]: string } = {
            'White Buttercream': 'Classic smooth buttercream with vanilla notes, ideal for decorating.',
            'Chocolate Buttercream': 'Rich chocolate icing that pairs beautifully with any flavor.',
            'Almond Buttercream': 'Refined almond icing with subtle nutty sweetness and silky texture.',
            'White Chocolate Buttercream': 'Luxurious icing with creamy sweetness and smooth finish.',
            'Cream Cheese': 'Tangy icing that adds sophisticated flavor and perfect spreadability.',
            'Chocolate Ganache': 'Glossy, decadent ganache for ultra-premium finish and intense flavor.'
          };
          return {
            title: icing.name,
            description: descriptions[icing.name] || `Premium ${icing.name.toLowerCase()} icing for beautiful finishes.`,
            imagePlaceholder: 'linear-gradient(135deg, #F3E5FF 0%, #FAF0FF 100%)'
          };
        });
        break;
      
      case 'decorations':
        items = decorations.map(deco => {
          const descriptions: { [key: string]: string } = {
            'Buttercream Flowers': 'Hand-piped flowers crafted with artistry for elegant beauty.',
            'Fondant Decorations': 'Custom designs sculpted to perfection for stunning artistry.',
            'Silk Flowers (Iris)': 'Delicate iris flowers bringing sophisticated floral elegance.',
            'Silk Flowers (Rose)': 'Timeless roses adding romantic charm and classic beauty.',
            'Silk Flowers (Daisy)': 'Cheerful daisies perfect for bright, joyful celebrations.',
            'Silk Flowers (Lily)': 'Elegant lilies bringing graceful sophistication to your design.',
            'Silk Butterflies': 'Whimsical butterflies adding enchanting movement and charm.',
            'Edible Sugar-Based Photos': 'Custom edible prints personalizing your cake with cherished memories.',
            'Toys (Trains)': 'Miniature trains perfect for delighting young locomotive enthusiasts.',
            'Toys (Dinosaurs)': 'Playful dinosaurs bringing prehistoric adventure to birthdays.',
            'Toys (Race Cars)': 'Speedy race cars for little drivers and racing-themed parties.',
            'Plastic Decorations (Sports Equipment)': 'Sport-themed picks celebrating athletic achievements and team spirit.',
            'Plastic Decorations (Graduation Caps)': 'Graduation caps honoring academic milestones and achievements.',
            'Plastic Decorations (Baby Items)': 'Sweet baby-themed pieces perfect for showers and celebrations.',
            'Paper Parasols': 'Colorful parasols adding tropical flair and festive atmosphere.',
            'Plastic Pics (Flamingos)': 'Fun flamingo picks bringing tropical vibes and playful pink accents.',
            'Plastic Pics (Mermaids)': 'Enchanting mermaids for magical under-the-sea themed parties.',
            'Plastic Pics (Seashells)': 'Ocean-inspired picks perfect for beach and coastal celebrations.',
            'Flags': 'Decorative flags in various colors and styles for special occasions.',
            'Ribbons (Multiple Colors)': 'Elegant ribbon accents in every color to match your theme.',
            'Plastic Trees': 'Miniature trees ideal for nature-themed and woodland celebrations.',
            'Plastic Animals': 'Adorable animal figures perfect for safari and zoo-themed parties.',
            'Plastic Camping Sets': 'Camping-themed pieces for outdoor adventure enthusiasts.',
            'Rock Candy': 'Sparkling crystals adding texture, color, and sweet crunch.',
            'Plastic Star Explosion Insert': 'Dramatic star burst creating stunning visual impact.'
          };
          return {
            title: deco.name,
            description: descriptions[deco.name] || `${deco.name} to make your cake uniquely memorable.`,
            imagePlaceholder: 'linear-gradient(135deg, #FFF9E5 0%, #FFFEF5 100%)'
          };
        });
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
      {/* Header Section */}
      <header
        style={{
          background: 'linear-gradient(135deg, #FAF5F0 0%, #F8EBD7 100%)',
          padding: '80px 24px 60px',
          textAlign: 'center',
          borderBottom: '2px solid #E8D5C4'
        }}
      >
        <h1>
          Our Menu
        </h1>
        <p>
          Explore our delicious selection of custom cakes, premium flavors, and elegant decorations. Each creation is handcrafted with love and tradition.
        </p>
      </header>

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
        header h1 {
          font-family: 'Playfair Display';
          font-size: 48px;
          font-weight: 700;
          color: #C44569;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        header p {
          font-family: 'Poppins';
          font-size: 18px;
          font-weight: 400;
          color: #5A3825;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          header {
            padding: 48px 24px 40px !important;
          }

          header h1 {
            font-size: 32px !important;
          }

          header p {
            font-size: 16px !important;
          }

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
          header h1 {
            font-size: 40px;
          }

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
