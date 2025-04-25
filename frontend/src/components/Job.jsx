import { Bookmark } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
  import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

function Job({job}) {
  const navigate=useNavigate()
  // const jobId="jiofjiodfjjofjojddoo"
  return (
    <div className="p-2 rounded-md shadow-lg bg-zinc-100 border border-gray-200 mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">2 days ago</p>
        <Button variant="outline" className="rounded-full p-2" size="icon">
          <Bookmark />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={job?.company?.logo }
            alt="Company Logo"
            className="object-cover"
          />
        </Avatar>
        <div>
          <h1 className="text-lg font-semibold">{job?.company?.name}</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>

      {/* Job Title and Description */}
      <div>
        <h1 className="text-md font-bold">{job?.title}</h1>
        <p className="text-sm text-gray-600">
         {job?.description}
        </p>
      </div>

      {/* Job Details - Badges */}
      <div className="flex items-center gap-2 p-2">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-red-500 font-bold" variant="ghost">
         {job?.jobtype} 
        </Badge>
        <Badge className="text-green-700 font-bold" variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-4  p-2">
        <Button onClick={()=>navigate('/description/${job?._id}')} variant="outline" className="bg-white rounded-full text-red-500">
          Details
        </Button>
        <Button variant="outline" className="text-blue-500 rounded-full bg-white ">
          Save For Later
        </Button>
      </div>
    </div>
  );
}

export default Job;
