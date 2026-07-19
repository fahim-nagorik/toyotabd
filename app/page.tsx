import HeroCarousel from "@/components/home/HeroCarousel";
import TrustBand from "@/components/home/TrustBand";
import VehicleGrid from "@/components/home/VehicleGrid";
import Rav4Showcase from "@/components/home/Rav4Showcase";
import Technology from "@/components/home/Technology";
import Safety from "@/components/home/Safety";
import Offers from "@/components/home/Offers";
import DealerLocator from "@/components/home/DealerLocator";
import TestDrive from "@/components/home/TestDrive";

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <TrustBand />
      <VehicleGrid />
      <Rav4Showcase />
      <Technology />
      <Safety />
      <Offers />
      <DealerLocator />
      <TestDrive />
    </main>
  );
}
