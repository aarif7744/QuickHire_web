import { Item } from "@radix-ui/react-radio-group";
import React from "react";
import LatestJobcards from "./LatestJobcards";
import { useSelector } from "react-redux";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];
function LatestJobs() {
  const { allJobs } = useSelector((store) => store.job);
  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-2xl font-bold">
        {" "}
        <span className="text-violet-600">Latest & Top </span>Job Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-3 ">
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
