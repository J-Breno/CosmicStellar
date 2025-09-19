import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SpaceBackground from "@/components/SpaceBackground";
import BlackHole from '@/components/BlackHole/BlackHole'
import SpaceFacts from "@/components/Facts/SpaceFacts";
import Contact from "@/components/Contacts/Contact";

export default function Home() {
  return (
    <>
      <SpaceBackground />
      <div className="relative z-10 bg-transparent main-content">
        <Header />
        <Hero />
        <BlackHole />
        <SpaceFacts />
        <Contact />
      </div>
    </>
  );
}