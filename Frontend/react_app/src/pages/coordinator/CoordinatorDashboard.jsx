import { useEffect, useState } from "react";
import { getCoordinatorDashboardStats } from "../../api/competition.api";
import PageHeader from "../../components/PageHeader";

const CoordinatorDashboard = () => {

 const [stats, setStats] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchStats = async () => {

  try {

   const res = await getCoordinatorDashboardStats();
   setStats(res.data);
   setLoading(false);

  } catch (error) {

   console.error(error);
   setLoading(false);

  }

 };

 useEffect(() => {
  fetchStats();
 }, []);

 if (loading) return <p>Loading dashboard...</p>;

 return (

  <div>

<PageHeader
 title="Coordinator Dashboard"
 subtitle="Overview of competitions and registrations"
/>


   {/* STATS GRID */}

   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    {/* TOTAL COMPETITIONS */}

    <div className="bg-white p-4 rounded shadow">

     <p className="text-gray-500">
      Total Competitions
     </p>

     <h2 className="text-2xl font-bold">
      {stats.totalCompetitions}
     </h2>

    </div>

    {/* PUBLISHED */}

    <div className="bg-white p-4 rounded shadow">

     <p className="text-gray-500">
      Published Competitions
     </p>

     <h2 className="text-2xl font-bold">
      {stats.publishedCompetitions}
     </h2>

    </div>

    {/* TOTAL REGISTRATIONS */}

    <div className="bg-white p-4 rounded shadow">

     <p className="text-gray-500">
      Total Registrations
     </p>

     <h2 className="text-2xl font-bold">
      {stats.totalRegistrations}
     </h2>

    </div>

    {/* ACTIVE */}

    <div className="bg-white p-4 rounded shadow">

     <p className="text-gray-500">
      Active Registrations
     </p>

     <h2 className="text-2xl font-bold">
      {stats.activeRegistrations}
     </h2>

    </div>

   </div>

  </div>

 );
};

export default CoordinatorDashboard;
