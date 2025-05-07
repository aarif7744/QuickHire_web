import React from "react";
import LatestJobcards from "./LatestJobcards";
import { useSelector } from "react-redux";

function LatestJobs() {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-4">
        <span className="text-violet-600">Latest & Top </span>Job Openings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {allJobs.length <= 0 ? (
          <span>No Job Available</span>
        ) : (
          allJobs.map((job, index) => (
            <LatestJobcards key={job._id || index} job={job} />
          ))
        )}
      </div>
    </div>
  );
}

export default LatestJobs;
