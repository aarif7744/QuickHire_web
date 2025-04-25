import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import{motion} from 'framer-motion'

function Jobs() {
  const { allJobs = [], searchedQuery = "" } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery.trim()) {
      const filteredJobs= allJobs.filter((job) => {
        const title = job?.title?.toLowerCase() || "";
        const description = job?.description?.toLowerCase() || "";
        const location = job?.location?.toLowerCase() || "";
        const query = searchedQuery.toLowerCase();

        return (
          title.includes(query) ||
          description.includes(query) ||
          location.includes(query)
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className="w-[90%] max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          {/* Sidebar Filter */}
          <div className="w-1/5">
            <FilterCard />
          </div>

          {/* Job Listings */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {filterJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <Link key={job?._id} to={`/description/${job?._id}`} className="block">
                    <Job job={job} />
                  </Link>
                ))} 
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-600">
                No jobs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
