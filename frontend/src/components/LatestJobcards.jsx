import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

function LatestJobcards({ job }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-4 sm:p-5 md:p-6 rounded-md shadow-md bg-white border cursor-pointer hover:shadow-lg transition-all duration-200"
    >
      {/* Company Name */}
      <h1 className="text-base md:text-lg font-semibold">{job?.company?.name}</h1>
      <p className="text-sm text-gray-500">India</p>

      {/* Job Title & Description */}
      <div className="mt-2">
        <h2 className="text-lg md:text-xl font-bold">{job?.title}</h2>
        <p className="text-sm md:text-base text-gray-600 line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-red-700 font-bold" variant="ghost">
          {job?.jobtype}
        </Badge>
        <Badge className="text-lime-500 font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
}

export default LatestJobcards;
