export interface TourPackages {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  whyChooseUs: string[];
  itinerary: string[];
  startDate: string;
  endDate: string;
  includes: string[];
  notIncluded: string[];
  prices: {
    per: string;
    ext: string;
  };
  optional: string[];
  images: {
    alt: string;
    src: string;
    width: number;
  }[];
}
