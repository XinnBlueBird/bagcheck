import Roadmap from "../components/Roadmap";

export const metadata = {
  title: "Roadmap — BagCheck",
  description: "BagCheck phased delivery: tool first, token second, platform last.",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Roadmap />
    </main>
  );
}
