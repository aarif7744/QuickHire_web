import { Badge } from "./ui/badge";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

function JobDescription() {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const user = useSelector((store) => store.auth);

  useEffect(() => {
    console.log("Job ID received from useParams:", jobId);
  }, [jobId]);

  const isInitiallyApplied =
    Array.isArray(singleJob?.applicants) &&
    singleJob.applicants.includes(user?._id);
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const applyJobHandler = async () => {
    
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`, // Correct API URL
        {},
        { withCredentials: true }
      );

      console.log("Apply API Response:", res.data);

      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob,applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Apply Job Error:", error);
      toast.error(error.response?.data?.message || "Failed to apply!");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      if (!jobId || jobId.length !== 24) {
        console.error("Invalid Job ID:", jobId);
        return;
      }

      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        console.log("Job Fetch API Response:", res.data);

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.application.some(application=>application.applicant==user?._id));//ensure the state sync with fetched with data
        } else {
          console.error("Error in API response:", res.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch job details:",
          error.response?.data || error.message
        );
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  return (
    <div className="max-w-5xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl">
          <h1>{singleJob?.title || "Loading..."}</h1>
          <div className="flex items-center gap-3 mt-4">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob?.position ? `${singleJob.position} Positions` : "N/A"}
            </Badge>
            <Badge className="text-green-700 font-bold" variant="ghost">
              {singleJob?.jobType || singleJob?.jobtype || "N/A"}
            </Badge>
            <Badge className="text-pink-700 font-bold" variant="ghost">
              {singleJob?.salary ? `${singleJob.salary} LPA` : "N/A"}
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isInitiallyApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-2">
        Job Description
      </h1>
      <div className="my-3">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.title || "N/A"}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.location || "N/A"}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.description || "N/A"}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.experience ? `${singleJob.experience} ` : "yrs"}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.salary ? `${singleJob.salary} LPA` : "N/A"}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.applications?.length || 0}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-700">
            {singleJob?.createdAt
              ? new Date(singleJob.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </h1>
      </div>
    </div>
  );
}

export default JobDescription;
