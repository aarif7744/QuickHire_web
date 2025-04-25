import React from "react";
import { Badge } from "./ui/badge";
import Job from "./Job";
import { useNavigate } from "react-router-dom";

function LatestJobcards({job}) {
  const navigate =useNavigate();
  return (
    <div  onClick={() => navigate(`/description/${job._id}`)} className="text-sm p-4 rounded-md shadow-xl bg-white border-gray-100 curser-pointer">
      <h1 className="font-medium text-lg">{job?.company?.name}</h1>
      <p className="text-sm text-gray-500">India</p>
      <div>
        <h1 className="font-bold text-lg ">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
         {job?.position} Positions
        </Badge>
        <Badge className={"text-red-700 font-bold"} variant="ghost">
         {job?.jobtype} 
        </Badge>
        <Badge className={"text-lime-500 font-bold"} variant="ghost">
         {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
}

export default LatestJobcards;
