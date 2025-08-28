import FinanceOverview from "@/components/dashboard/FinanceOverview";
import SalesOverview from "@/components/dashboard/SalesOverview";
import UserCards from "@/components/dashboard/UserCards";

const Home = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <UserCards />

        <SalesOverview />

        <FinanceOverview />
      </div>
    </div>
  );
};

export default Home;
