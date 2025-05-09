export interface TravelPackages {
  id:string;
  packageTitle:string;
  includes:string[];
  notIncluded:string[];
  optional:{title:string,price:string,currency:string}[],
  itinerary:{day:string,title:string,description:string}[]
  notes:string[];
  images:
    {alt:string; src:string; width:number; }[]
}
