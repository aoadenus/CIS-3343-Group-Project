import { getPipingBagSvg, getFillingBowlSvg, getLayeredCakeSliceSvg } from '../utils/svgGenerators';

export interface IcingColor {
  name: string;
  hex: string;
  image: string; // data URL
}

export const ICING_COLOR_TABLE: Array<[string, string]> = [
  ['Red', '#F1EDEE'],
  ['Royal Blue', '#F2EEEF'],
  ['Green', '#F3EFF0'],
  ['Yellow', '#F2EEEF'],
  ['Orange', '#E9E5E5'],
  ['Baby Pink', '#F5F0F6'],
  ['Baby Blue', '#F6F1F7'],
  ['Pastel Green', '#F7F2F5'],
  ['Pastel Yellow', '#F4F2F1'],
  ['Lavender', '#F5EEE6'],
  ['Hot Pink', '#FAF5FB'],
  ['Sky Blue', '#FAF5FB'],
  ['Neon Green', '#FBF7F9'],
  ['Yellow', '#F4F4F1'],
  ['Orange', '#F7E8B5'],
  ['Purple', '#F48957'],
  ['Fall Red', '#DFC8CB'],
  ['Fall Green', '#FEFBFD'],
  ['Fall Yellow', '#FEFAFC'],
  ['Fall Orange', '#F0DAB7'],
  ['Brown', '#DC8266'],
  ['Ivory', '#F2EDF3'],
  ['Golden Yellow', '#F5F0F6'],
  ['Gold', '#F6F1F7'],
  ['Fuchsia', '#F4EFF5'],
  ['Maroon', '#F1ECF2'],
  ['Burgundy', '#F0EBF0'],
  ['Burnt Orange', '#F8D47F'],
  ['Turquoise', '#F1DBA2'],
  ['Navy Blue', '#EDE8EE'],
  ['Gray/Silver', '#EBE6EC'],
  ['Black', '#D58398'],
  ['White', '#812A2F']
];

export const ICING_COLORS: IcingColor[] = ICING_COLOR_TABLE.map(([name, hex]) => ({
  name,
  hex,
  image: getPipingBagSvg(hex, name)
}));

// Example products catalog
export interface ProductItem {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  description?: string;
  image?: string; // data URL
  icingOptions?: string[]; // hex codes
}

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'p-bday-1',
    name: 'Birthday Celebration',
    category: 'Cakes',
    priceCents: 4500,
    description: 'Classic birthday cake with custom decorations',
    image: getLayeredCakeSliceSvg('#F6D1D1', 'Birthday'),
    icingOptions: ICING_COLORS.map(c => c.hex)
  },
  {
    id: 'p-almond-1',
    name: 'Almond Delight',
    category: 'Cakes',
    priceCents: 5000,
    description: 'Rich almond flavor with buttercream',
    image: getLayeredCakeSliceSvg('#EFE6D6', 'Almond'),
    icingOptions: ICING_COLORS.map(c => c.hex)
  },
  {
    id: 'p-lem-1',
    name: 'Lemon & Cream Cheese',
    category: 'Cakes',
    priceCents: 4800,
    description: 'Tangy lemon with smooth cream cheese frosting',
    image: getLayeredCakeSliceSvg('#FFF3CC', 'Lemon'),
    icingOptions: ICING_COLORS.map(c => c.hex)
  }
];

// Flavor images (bowl of filling) mapping
export const FLAVOR_IMAGES: { [flavor: string]: string } = {
  Vanilla: getFillingBowlSvg('#F8EBD7', 'Vanilla Filling'),
  Chocolate: getFillingBowlSvg('#D9B99B', 'Chocolate Filling'),
  Strawberry: getFillingBowlSvg('#F7C6D1', 'Strawberry Filling'),
  Lemon: getFillingBowlSvg('#FFF3CC', 'Lemon Filling')
};

export default {
  ICING_COLORS,
  DEFAULT_PRODUCTS,
  FLAVOR_IMAGES
};
