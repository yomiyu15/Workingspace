import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Gallery } from "@/components/gallery";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { Locations } from "@/components/locations";

import { FAQ } from "@/components/faq";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";


export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Gallery />
      <Features />
      <Pricing />
      <Locations />
      <FAQ />
      <Testimonials />
 
      <Footer />
    </main>
  );
}
