import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

function LatestJobcards({ job }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="cursor-pointer p-4 rounded-md shadow-md bg-white border hover:shadow-lg transition duration-300"
    >
      <h1 className="font-semibold text-lg text-gray-800 mb-1">
        {job?.company?.name}
      </h1>
      <p className="text-sm text-gray-500 mb-2">India</p>

      <div>
        <h2 className="font-bold text-md text-black mb-1">{job?.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-semibold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-red-700 font-semibold" variant="ghost">
          {job?.jobtype}
        </Badge>
        <Badge className="text-lime-700 font-semibold" variant="ghost">
          ₹ {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
}

export default LatestJobcards;
