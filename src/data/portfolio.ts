const base = "/portfolio_pictures";

export const categories = [
  { id: "All", label: "All" },
  { id: "Wedding", label: "Wedding" },
  { id: "Engagement", label: "Engagement" },
  { id: "Family-Children", label: "Family & Children" },
  { id: "Portrait", label: "Portrait" },
  { id: "Pets", label: "Pets" },
  { id: "Automotive", label: "Automotive" },
  { id: "Events", label: "Events" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export interface PortfolioImage {
  id: string;
  category: Exclude<CategoryId, "All">;
  src: string;
  alt: string;
}

function img(category: Exclude<CategoryId, "All">, filename: string, alt: string): PortfolioImage {
  const id = filename.replace(/\s/g, "-").replace(/\./g, "-");
  return {
    id: `${category}-${id}`,
    category,
    src: `${base}/${category}/${encodeURIComponent(filename)}`,
    alt,
  };
}

export const portfolioImages: PortfolioImage[] = [
  // Wedding
  ...["W2.jpeg", "W5.jpeg", "W6.jpeg", "W7.jpeg", "W10.jpeg", "W14.jpeg", "W15.jpeg", "W17.jpeg", "W18.jpeg", "W19.jpeg", "W22.jpeg", "W23.jpeg"].map(
    (f) => img("Wedding", f, "Wedding photography")
  ),
  // Engagement
  ...["Couple1.jpeg", "Couple3.jpeg", "Couple6.jpeg", "Couple7.jpeg", "Couple8.jpeg", "Couple9.PNG", "Couple10.jpeg", "Couple12.PNG", "Couple13.PNG", "Couple13.jpeg"].map(
    (f) => img("Engagement", f, "Engagement photography")
  ),
  // Family-Children
  ...["F3.PNG", "F5.jpeg", "K1 (1).jpg", "K2.jpg", "K4.PNG", "K5.PNG", "K6.PNG", "K7.jpeg", "K8.PNG", "K9.PNG", "K12.PNG", "K13.jpeg", "K16.jpeg"].map(
    (f) => img("Family-Children", f, "Family & children photography")
  ),
  // Portrait (excluding P6.rw2 - raw format)
  ...["H3.jpeg", "H6.png", "H9.jpeg", "P1.jpg", "P3.jpg", "P10.jpg", "P11.PNG", "P12.JPG", "P16.jpeg", "P17.jpeg", "P18.jpeg", "P19.jpeg", "P20.jpeg", "P22.PNG", "P23.PNG", "P24.PNG", "P25.jpeg", "P28.JPG", "P30.JPG", "P33 (1).jpeg", "P33.jpeg", "P34.jpeg", "P37.jpeg", "P38.jpeg", "P39.jpeg", "P40.jpeg"].map(
    (f) => img("Portrait", f, "Portrait photography")
  ),
  // Pets
  ...["Pet1.PNG", "Pet2.PNG", "Pet3.jpeg", "Pet4.PNG", "Thor.PNG", "Thor2.jpeg", "Thor3.jpg", "Thor4.jpg", "Thor5.jpeg"].map(
    (f) => img("Pets", f, "Pet photography")
  ),
  // Automotive
  ...["Car1.JPG", "Car2.jpeg", "Car4.jpeg", "Car5.jpeg"].map(
    (f) => img("Automotive", f, "Automotive photography")
  ),
  // Events
  ...["E2.PNG", "E3.JPG", "E4.jpg", "E5.jpeg", "G2.jpeg"].map(
    (f) => img("Events", f, "Event photography")
  ),
];
