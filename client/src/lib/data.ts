import { useTranslation } from "react-i18next";
import type { EcoFact, ImpactComparison, TeamMember } from "@shared/schema";

export function useEcoFacts(): EcoFact[] {
  const { t, i18n } = useTranslation();
  const isAz = i18n.language === "az";
  
  return [
    {
      id: 1,
      icon: "Droplets",
      title: isAz ? "Xəzər Dənizinin Qorunması" : "Caspian Sea Protection",
      description: isAz 
        ? "Dünyanın ən böyük qapalı su hövzəsi olan Xəzər dənizi Azərbaycanla həmsərhəddir. Ekosistemi 850-dən çox heyvan və 500-dən çox bitki növünü dəstəkləyir."
        : "The Caspian Sea, the world's largest enclosed body of water, borders Azerbaijan. Its ecosystem supports over 850 species of animals and 500 species of plants.",
      statistic: isAz ? "850+ növ" : "850+ species"
    },
    {
      id: 2,
      icon: "Mountain",
      title: isAz ? "Qafqaz Biomüxtəlifliyi" : "Caucasus Biodiversity",
      description: isAz
        ? "Azərbaycanın Böyük Qafqaz dağları 35 qlobal biomüxtəliflik mərkəzindən birinin hissəsidir, burada Yer üzünün başqa heç bir yerində tapılmayan endemik növlər yaşayır."
        : "Azerbaijan's Greater Caucasus mountains are part of one of the 35 global biodiversity hotspots, home to many endemic species found nowhere else on Earth.",
      statistic: isAz ? "35 mərkəz" : "35 hotspots"
    },
    {
      id: 3,
      icon: "TreeDeciduous",
      title: isAz ? "Meşə Örtüyü" : "Forest Coverage",
      description: isAz
        ? "Meşələr Azərbaycan ərazisinin təxminən 11,8%-ni örtür. Ölkə 2030-cu ilə qədər meşəsalma proqramları vasitəsilə bu rəqəmi 15%-ə çatdırmağı hədəfləyir."
        : "Forests cover about 11.8% of Azerbaijan's territory. The country aims to increase this to 15% through reforestation programs by 2030.",
      statistic: "11.8%"
    },
    {
      id: 4,
      icon: "Bird",
      title: isAz ? "Köçəri Quşların Sığınacağı" : "Migratory Bird Haven",
      description: isAz
        ? "Azərbaycan əsas quş köçü marşrutları üzərində yerləşir. Kür-Araz ovalığı hər il nəsli kəsilməkdə olan növlər də daxil olmaqla milyonlarla köçəri quşa ev sahibliyi edir."
        : "Azerbaijan lies on major bird migration routes. The Kura-Araxes lowlands host millions of migratory birds annually, including endangered species.",
      statistic: isAz ? "Hər il milyonlarla" : "Millions annually"
    },
    {
      id: 5,
      icon: "Flame",
      title: isAz ? "Palçıq Vulkanları" : "Mud Volcanoes",
      description: isAz
        ? "Azərbaycanda hər hansı digər ölkədən daha çox - təxminən 400 palçıq vulkanı var. Bu unikal geoloji formalar özünəməxsus ekosistemlər yaradır."
        : "Azerbaijan has more mud volcanoes than any other country - about 400. These unique geological formations create distinctive ecosystems.",
      statistic: isAz ? "400+ vulkan" : "400+ volcanoes"
    },
    {
      id: 6,
      icon: "Wind",
      title: isAz ? "Bərpa Olunan Enerji Potensialı" : "Renewable Energy Potential",
      description: isAz
        ? "Azərbaycanın 27 GW-dan çox külək və günəş enerjisi potensialı var. Ölkə 2030-cu ilə qədər 30% bərpa olunan enerjiyə çatmağı hədəfləyir."
        : "Azerbaijan has significant renewable energy potential with over 27 GW of wind and solar capacity. The country aims for 30% renewable energy by 2030.",
      statistic: isAz ? "27 GW potensial" : "27 GW potential"
    },
    {
      id: 7,
      icon: "Leaf",
      title: isAz ? "Milli Parklar" : "National Parks",
      description: isAz
        ? "Azərbaycanın yarımsəhralardan alp çəmənliklərinə qədər müxtəlif ekosistemləri qoruyan 10 milli parkı var, ölkənin 3,5%-dən çoxunu əhatə edir."
        : "Azerbaijan has 10 national parks protecting diverse ecosystems from semi-deserts to alpine meadows, covering over 3.5% of the country.",
      statistic: isAz ? "10 park" : "10 parks"
    },
    {
      id: 8,
      icon: "Fish",
      title: isAz ? "Nərə Balığının Qorunması" : "Sturgeon Conservation",
      description: isAz
        ? "Dünya şöhrətli kürünün mənbəyi olan Xəzər nərə balığı nəsli kəsilmək təhlükəsi altındadır. Azərbaycan beynəlxalq qorunma səylərində iştirak edir."
        : "The Caspian sturgeon, source of world-famous caviar, is critically endangered. Azerbaijan participates in international conservation efforts.",
      statistic: isAz ? "Kritik təhlükədə" : "Critically endangered"
    },
    {
      id: 9,
      icon: "Recycle",
      title: isAz ? "Tullantıların İdarə Edilməsi Hədəfləri" : "Waste Management Goals",
      description: isAz
        ? "Azərbaycan 2030-cu ilə qədər bələdiyyə tullantılarının 40%-ni təkrar emal etməyi hədəfləyir. Ölkə boyu yeni tullantı emalı müəssisələri tikilir."
        : "Azerbaijan aims to recycle 40% of municipal waste by 2030, up from current levels. New waste processing facilities are being built nationwide.",
      statistic: isAz ? "2030-a 40%" : "40% by 2030"
    },
    {
      id: 10,
      icon: "Sun",
      title: isAz ? "İqlim Fəaliyyəti" : "Climate Action",
      description: isAz
        ? "Azərbaycan Paris Sazişi çərçivəsində 2050-ci ilə qədər 1990-cı illə müqayisədə istixana qazı emissiyalarını 40% azaltmağı öhdəsinə götürüb."
        : "Azerbaijan committed to reducing greenhouse gas emissions by 40% by 2050 compared to 1990 levels under the Paris Agreement.",
      statistic: isAz ? "40% azalma" : "40% reduction"
    }
  ];
}

export function useImpactComparisons(): ImpactComparison[] {
  const { i18n } = useTranslation();
  const isAz = i18n.language === "az";

  return [
    {
      id: 1,
      icon: "Car",
      source: isAz ? "Avtomobil" : "Car",
      sourceAmount: isAz ? "1 il sürüş" : "1 year of driving",
      equals: "=",
      target: isAz ? "Ağaclar" : "Trees",
      targetAmount: isAz ? "İldə 24 ağac" : "24 trees per year",
      description: isAz 
        ? "Orta bir avtomobil ildə təxminən 4.6 metrik ton CO2 buraxır. Bu qədər karbon qazını udmaq üçün təxminən 24 yetkin ağac lazımdır."
        : "An average car emits about 4.6 metric tons of CO2 per year. It takes approximately 24 mature trees to absorb this amount of carbon dioxide annually."
    },
    {
      id: 2,
      icon: "Plane",
      source: isAz ? "Uçuş" : "Flight",
      sourceAmount: isAz ? "Bakı-London gediş-gəliş" : "Baku to London roundtrip",
      equals: "=",
      target: isAz ? "Ağaclar" : "Trees",
      targetAmount: isAz ? "1 il üçün 8 ağac" : "8 trees for 1 year",
      description: isAz
        ? "Bakıdan Londona gediş-gəliş uçuş sərnişin başına təxminən 1.6 ton CO2 istehsal edir. Bu tək səfəri kompensasiya etmək üçün 8 ağacın bütün il işləməsi lazımdır."
        : "A roundtrip flight from Baku to London produces about 1.6 tons of CO2 per passenger. You'd need 8 trees working for a whole year to offset this single trip."
    },
    {
      id: 3,
      icon: "Smartphone",
      source: isAz ? "Telefon şarjı" : "Phone charging",
      sourceAmount: isAz ? "1 il" : "1 year",
      equals: "=",
      target: isAz ? "Ağac saatları" : "Tree hours",
      targetAmount: isAz ? "2 həftə ağac işi" : "2 weeks of tree work",
      description: isAz
        ? "Smartfonunuzu bir il şarj etmək təxminən 8 kq CO2 istehsal edir. Tək bir ağac bunu böyümə mövsümündə cəmi 2 həftəyə uda bilər."
        : "Charging your smartphone for a year produces about 8kg of CO2. A single tree can absorb this in just 2 weeks during the growing season."
    },
    {
      id: 4,
      icon: "Beef",
      source: isAz ? "Mal əti istehsalı" : "Beef production",
      sourceAmount: isAz ? "1 kq mal əti" : "1 kg of beef",
      equals: "=",
      target: isAz ? "Ağac günləri" : "Tree days",
      targetAmount: isAz ? "60 ağac-gün" : "60 tree-days",
      description: isAz
        ? "1 kq mal əti istehsal etmək təxminən 27 kq CO2 ekvivalenti yaradır. Bir ağacın bu qədər istixana qazını udması üçün təxminən 60 gün lazımdır."
        : "Producing 1 kg of beef generates about 27 kg of CO2 equivalent. A tree would need about 60 days to absorb this amount of greenhouse gases."
    },
    {
      id: 5,
      icon: "Factory",
      source: isAz ? "Sənaye emissiyaları" : "Industrial emissions",
      sourceAmount: isAz ? "Azərbaycan illik" : "Azerbaijan yearly",
      equals: "=",
      target: isAz ? "Meşə sahəsi" : "Forest area",
      targetAmount: isAz ? "2 milyon hektar lazım" : "2 million hectares needed",
      description: isAz
        ? "Azərbaycanın təxminən 47 milyon ton illik CO2 emissiyalarını udmaq üçün təxminən 2 milyon hektar meşə lazımdır - bu, ölkənin hazırkı meşə örtüyündən çoxdur."
        : "Azerbaijan's annual CO2 emissions of about 47 million tons would require approximately 2 million hectares of forest to absorb - that's more than the country's current forest coverage."
    },
    {
      id: 6,
      icon: "Lightbulb",
      source: isAz ? "LED vs Adi lampa" : "LED vs Incandescent",
      sourceAmount: isAz ? "1 lampa dəyişdirmək" : "Switching 1 bulb",
      equals: "=",
      target: isAz ? "Qənaət edilən CO2" : "CO2 saved",
      targetAmount: isAz ? "İllik 40 kq" : "40 kg yearly",
      description: isAz
        ? "Bir adi lampanı LED ilə əvəz etmək ildə təxminən 40 kq CO2 qənaət edir. Bu, yalnız sizin üçün il boyu işləyən kiçik bir ağac əkmək kimidir."
        : "Replacing one incandescent bulb with an LED saves about 40 kg of CO2 per year. That's like planting a small tree that works year-round just for you."
    }
  ];
}

export function useTeamMembers(): TeamMember[] {
  const { i18n } = useTranslation();
  const isAz = i18n.language === "az";

  return [
    {
      id: 1,
      name: isAz ? "Hüseyn Alırzayev" : "Huseyn Alirzayev",
      role: isAz ? "Layihə Rəhbəri" : "Project Lead",
      school: isAz ? "Bakı Avropa Liseyi" : "Baku European Lyceum",
      bio: isAz 
        ? "Ətraf mühit elminə həvəsli və Azərbaycanı yaşıllaşdırmaq üçün təşəbbüslərə rəhbərlik edir. Ətraf mühit mühəndisi olmağı arzulayır."
        : "Passionate about environmental science and leading initiatives to make Azerbaijan greener. Dreams of becoming an environmental engineer.",
      avatarUrl: "huseyn"
    },
    {
      id: 2,
      name: isAz ? "İnci Əhmədzadə" : "Inci Ahmedzade",
      role: isAz ? "Texnologiya Rəhbəri" : "Technology Lead",
      school: isAz ? "Bakı Oksford Məktəbi" : "Baku Oxford School",
      bio: isAz
        ? "Kodlamaya olan sevgisini ətraf mühit aktivizmi ilə birləşdirir. Texnologiyanın ən böyük ətraf mühit problemlərini həll edə biləcəyinə inanır."
        : "Combining love for coding with environmental activism. Believes technology can solve our biggest environmental challenges.",
      avatarUrl: "inci"
    },
    {
      id: 3,
      name: isAz ? "Sultanəli Cabbarlı" : "Soltanali Jabbarli",
      role: isAz ? "İcma Əlaqələri" : "Community Outreach",
      school: isAz ? "Gimnaziya 6" : "Gymnasium 6",
      bio: isAz
        ? "Yerli icmalarda ətraf mühit maarifləndirməsini yaymağa həsr olunub. Ağac əkmə tədbirləri və təhsil seminarları təşkil edir."
        : "Dedicated to spreading environmental awareness in local communities. Organizes tree planting events and educational workshops.",
      avatarUrl: "sultaneli"
    },
    {
      id: 4,
      name: isAz ? "Həmid Səmədzadə" : "Hamid Samadzade",
      role: isAz ? "Tədqiqat & Məzmun" : "Research & Content",
      school: isAz ? "Bakı Fizika-Riyaziyyat Liseyi" : "Baku Physics-Math Lyceum",
      bio: isAz
        ? "İqlim dəyişikliyinin arxasındakı elmlə maraqlanan. Başqalarının ətraf mühit məsələlərini anlamasına kömək etmək üçün təhsil məzmunu yaradır."
        : "Fascinated by the science behind climate change. Creates educational content to help others understand environmental issues.",
      avatarUrl: "hamid"
    }
  ];
}

export const partnerVendors = [
  "GreenBaku Nursery",
  "Azerbaijan Flora Center",
  "EcoPlant Baku",
  "Nature's Gift Garden",
  "Caspian Botanicals"
];
