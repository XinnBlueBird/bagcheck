import Tokenomics from "../components/Tokenomics";

export const metadata = {
  title: "Tokenomics — BagCheck",
  description: "$BAG token allocation, supply, and distribution.",
};

export default function TokenomicsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Tokenomics />
    </main>
  );
}
