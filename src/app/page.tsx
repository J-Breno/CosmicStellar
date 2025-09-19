import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SpaceBackground from "@/components/SpaceBackground";

export default function Home() {
  return (
    <>
      <SpaceBackground />
      <div className="relative z-10 bg-transparent main-content">
        <Header />
        <Hero />
      </div>
    </>
  );
}