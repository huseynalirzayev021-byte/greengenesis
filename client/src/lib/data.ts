import type { EcoFact, ImpactComparison, TeamMember } from "@shared/schema";

export const ecoFacts: EcoFact[] = [
  {
    id: 1,
    icon: "Droplets",
    title: "Caspian Sea Protection",
    description: "The Caspian Sea, the world's largest enclosed body of water, borders Azerbaijan. Its ecosystem supports over 850 species of animals and 500 species of plants.",
    statistic: "850+ species"
  },
  {
    id: 2,
    icon: "Mountain",
    title: "Caucasus Biodiversity",
    description: "Azerbaijan's Greater Caucasus mountains are part of one of the 35 global biodiversity hotspots, home to many endemic species found nowhere else on Earth.",
    statistic: "35 hotspots"
  },
  {
    id: 3,
    icon: "TreeDeciduous",
    title: "Forest Coverage",
    description: "Forests cover about 11.8% of Azerbaijan's territory. The country aims to increase this to 15% through reforestation programs by 2030.",
    statistic: "11.8%"
  },
  {
    id: 4,
    icon: "Bird",
    title: "Migratory Bird Haven",
    description: "Azerbaijan lies on major bird migration routes. The Kura-Araxes lowlands host millions of migratory birds annually, including endangered species.",
    statistic: "Millions annually"
  },
  {
    id: 5,
    icon: "Flame",
    title: "Mud Volcanoes",
    description: "Azerbaijan has more mud volcanoes than any other country - about 400. These unique geological formations create distinctive ecosystems.",
    statistic: "400+ volcanoes"
  },
  {
    id: 6,
    icon: "Wind",
    title: "Renewable Energy Potential",
    description: "Azerbaijan has significant renewable energy potential with over 27 GW of wind and solar capacity. The country aims for 30% renewable energy by 2030.",
    statistic: "27 GW potential"
  },
  {
    id: 7,
    icon: "Leaf",
    title: "National Parks",
    description: "Azerbaijan has 10 national parks protecting diverse ecosystems from semi-deserts to alpine meadows, covering over 3.5% of the country.",
    statistic: "10 parks"
  },
  {
    id: 8,
    icon: "Fish",
    title: "Sturgeon Conservation",
    description: "The Caspian sturgeon, source of world-famous caviar, is critically endangered. Azerbaijan participates in international conservation efforts.",
    statistic: "Critically endangered"
  },
  {
    id: 9,
    icon: "Recycle",
    title: "Waste Management Goals",
    description: "Azerbaijan aims to recycle 40% of municipal waste by 2030, up from current levels. New waste processing facilities are being built nationwide.",
    statistic: "40% by 2030"
  },
  {
    id: 10,
    icon: "Sun",
    title: "Climate Action",
    description: "Azerbaijan committed to reducing greenhouse gas emissions by 40% by 2050 compared to 1990 levels under the Paris Agreement.",
    statistic: "40% reduction"
  }
];

export const impactComparisons: ImpactComparison[] = [
  {
    id: 1,
    icon: "Car",
    source: "Car",
    sourceAmount: "1 year of driving",
    equals: "=",
    target: "Trees",
    targetAmount: "24 trees per year",
    description: "An average car emits about 4.6 metric tons of CO2 per year. It takes approximately 24 mature trees to absorb this amount of carbon dioxide annually."
  },
  {
    id: 2,
    icon: "Plane",
    source: "Flight",
    sourceAmount: "Baku to London roundtrip",
    equals: "=",
    target: "Trees",
    targetAmount: "8 trees for 1 year",
    description: "A roundtrip flight from Baku to London produces about 1.6 tons of CO2 per passenger. You'd need 8 trees working for a whole year to offset this single trip."
  },
  {
    id: 3,
    icon: "Smartphone",
    source: "Phone charging",
    sourceAmount: "1 year",
    equals: "=",
    target: "Tree hours",
    targetAmount: "2 weeks of tree work",
    description: "Charging your smartphone for a year produces about 8kg of CO2. A single tree can absorb this in just 2 weeks during the growing season."
  },
  {
    id: 4,
    icon: "Beef",
    source: "Beef production",
    sourceAmount: "1 kg of beef",
    equals: "=",
    target: "Tree days",
    targetAmount: "60 tree-days",
    description: "Producing 1 kg of beef generates about 27 kg of CO2 equivalent. A tree would need about 60 days to absorb this amount of greenhouse gases."
  },
  {
    id: 5,
    icon: "Factory",
    source: "Industrial emissions",
    sourceAmount: "Azerbaijan yearly",
    equals: "=",
    target: "Forest area",
    targetAmount: "2 million hectares needed",
    description: "Azerbaijan's annual CO2 emissions of about 47 million tons would require approximately 2 million hectares of forest to absorb - that's more than the country's current forest coverage."
  },
  {
    id: 6,
    icon: "Lightbulb",
    source: "LED vs Incandescent",
    sourceAmount: "Switching 1 bulb",
    equals: "=",
    target: "CO2 saved",
    targetAmount: "40 kg yearly",
    description: "Replacing one incandescent bulb with an LED saves about 40 kg of CO2 per year. That's like planting a small tree that works year-round just for you."
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Aysel Mammadova",
    role: "Project Lead",
    school: "Baku European Lyceum",
    bio: "Passionate about environmental science and leading initiatives to make Azerbaijan greener. Dreams of becoming an environmental engineer."
  },
  {
    id: 2,
    name: "Rashad Aliyev",
    role: "Technology Lead",
    school: "Baku Oxford School",
    bio: "Combining love for coding with environmental activism. Believes technology can solve our biggest environmental challenges."
  },
  {
    id: 3,
    name: "Leyla Huseynova",
    role: "Community Outreach",
    school: "Gymnasium 6",
    bio: "Dedicated to spreading environmental awareness in local communities. Organizes tree planting events and educational workshops."
  },
  {
    id: 4,
    name: "Tural Gasimov",
    role: "Research & Content",
    school: "Baku Physics-Math Lyceum",
    bio: "Fascinated by the science behind climate change. Creates educational content to help others understand environmental issues."
  }
];

export const partnerVendors = [
  "GreenBaku Nursery",
  "Azerbaijan Flora Center",
  "EcoPlant Baku",
  "Nature's Gift Garden",
  "Caspian Botanicals"
];
