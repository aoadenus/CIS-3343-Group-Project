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
            'Vanilla': 'Timeless vanilla cake with rich, aromatic flavor that serves as the perfect canvas for any celebration.',
            'Almond': 'Sophisticated almond cake with a delicate nutty essence that adds elegance to every bite.',
            'Yellow': 'Classic buttery yellow cake, moist and tender with a traditional homestyle taste.',
            "Devil's Food Chocolate": 'Decadent dark chocolate cake with intense cocoa flavor and velvety texture.',
            'Chocolate': 'Rich, indulgent chocolate cake that delivers pure cocoa satisfaction in every layer.',
            'Strawberry': 'Light and fruity strawberry cake bursting with fresh berry flavor and natural sweetness.'
          };
          return {
            title: flavor.name,
            description: descriptions[flavor.name] || `Premium ${flavor.name.toLowerCase()} cake flavor, expertly crafted for exceptional taste.`,
            imagePlaceholder: 'linear-gradient(135deg, #F8EBD7 0%, #FAF5F0 100%)'
          };
        });
        break;
      
      case 'fillings':
        items = fillingFlavors.map(filling => {
          const descriptions: { [key: string]: string } = {
            'White Buttercream': 'Silky smooth classic buttercream with a light vanilla essence, perfect for any cake design.',
            'Chocolate Buttercream': 'Luxuriously rich chocolate buttercream that melts in your mouth with deep cocoa flavor.',
            'Almond Buttercream': 'Delicate almond-infused buttercream with a sophisticated nutty sweetness.',
            'Cream Cheese': 'Tangy and creamy cream cheese filling that adds the perfect balance of richness.',
            'Lemon Curd': 'Bright and zesty lemon curd filling with the perfect sweet-tart balance.',
            'Strawberry': 'Fresh strawberry filling made with real fruit for vibrant berry flavor.',
            'Raspberry': 'Tart and sweet raspberry filling that brings a burst of summer to every bite.',
            'Rum-Strawberry': 'Elevated strawberry filling with a subtle rum infusion for adult celebrations.',
            'Pecan Praline': 'Buttery praline filling studded with toasted pecans for Southern charm.',
            'Chocolate Mousse': 'Light and airy chocolate mousse filling with an elegant, melt-in-your-mouth texture.',
            'Lemon Mousse': 'Delicate lemon mousse that combines citrus brightness with cloud-like softness.',
            'Strawberry Mousse': 'Ethereal strawberry mousse filling with fresh fruit flavor and silky smoothness.',
            'Raspberry Mousse': 'Velvety raspberry mousse with intense berry flavor and luxurious texture.',
            'White Chocolate Mousse': 'Creamy white chocolate mousse filling that adds pure indulgence to any cake.',
            'Mango Mousse': 'Tropical mango mousse with exotic fruit flavor and heavenly lightness.'
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
          description: `Vibrant ${color.name.toLowerCase()} color for stunning icing designs and personalized decorative writing.`,
          colorHex: color.hex
        }));
        break;
      
      case 'icing-flavors':
        items = icingFlavors.map(icing => {
          const descriptions: { [key: string]: string } = {
            'White Buttercream': 'Classic smooth buttercream icing with vanilla notes, ideal for elegant decorating.',
            'Chocolate Buttercream': 'Rich chocolate buttercream icing that pairs beautifully with any cake flavor.',
            'Almond Buttercream': 'Refined almond buttercream icing with subtle nutty sweetness and silky texture.',
            'White Chocolate Buttercream': 'Luxurious white chocolate buttercream with creamy sweetness and smooth finish.',
            'Cream Cheese': 'Tangy cream cheese icing that adds sophisticated flavor and perfect spreadability.',
            'Chocolate Ganache': 'Glossy, decadent chocolate ganache for an ultra-premium finish and intense chocolate flavor.'
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
            'Buttercream Flowers': 'Hand-piped buttercream flowers crafted with artistry to add elegant beauty to your cake.',
            'Fondant Decorations': 'Custom fondant designs sculpted to perfection for stunning three-dimensional artistry.',
            'Silk Flowers (Iris)': 'Delicate silk iris flowers that bring sophisticated floral elegance to any celebration.',
            'Silk Flowers (Rose)': 'Timeless silk roses that add romantic charm and classic beauty to your cake.',
            'Silk Flowers (Daisy)': 'Cheerful silk daisies perfect for bright, joyful celebrations and garden-themed cakes.',
            'Silk Flowers (Lily)': 'Elegant silk lilies that bring graceful sophistication to your cake design.',
            'Silk Butterflies': 'Whimsical silk butterflies that add enchanting movement and magical charm.',
            'Edible Sugar-Based Photos': 'Custom edible photo prints that personalize your cake with cherished memories.',
            'Toys (Trains)': 'Miniature train decorations perfect for delighting young locomotive enthusiasts.',
            'Toys (Dinosaurs)': 'Playful dinosaur toys that bring prehistoric adventure to birthday celebrations.',
            'Toys (Race Cars)': 'Speedy race car decorations for little drivers and racing-themed parties.',
            'Plastic Decorations (Sports Equipment)': 'Sport-themed picks celebrating athletic achievements and team spirit.',
            'Plastic Decorations (Graduation Caps)': 'Graduation cap decorations honoring academic milestones and achievements.',
            'Plastic Decorations (Baby Items)': 'Sweet baby-themed decorations perfect for showers and welcoming celebrations.',
            'Paper Parasols': 'Colorful paper parasols that add tropical flair and festive atmosphere.',
            'Plastic Pics (Flamingos)': 'Fun flamingo picks bringing tropical vibes and playful pink accents.',
            'Plastic Pics (Mermaids)': 'Enchanting mermaid decorations for magical under-the-sea themed celebrations.',
            'Plastic Pics (Seashells)': 'Ocean-inspired seashell picks perfect for beach-themed parties and coastal celebrations.',
            'Flags': 'Decorative flags in various colors and styles to celebrate special occasions.',
            'Ribbons (Multiple Colors)': 'Elegant ribbon accents available in every color to perfectly match your theme.',
            'Plastic Trees': 'Miniature tree decorations ideal for nature-themed cakes and woodland celebrations.',
            'Plastic Animals': 'Adorable animal figures perfect for safari parties and zoo-themed celebrations.',
            'Plastic Camping Sets': 'Camping-themed decorations for outdoor adventure enthusiasts and nature lovers.',
            'Rock Candy': 'Sparkling rock candy crystals that add texture, color, and sweet crunch.',
            'Plastic Star Explosion Insert': 'Dramatic star burst decoration that creates stunning visual impact and celebration.'
          };
          return {
            title: deco.name,
            description: descriptions[deco.name] || `${deco.name} decorations to make your cake uniquely memorable.`,
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
