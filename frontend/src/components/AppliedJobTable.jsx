import React, { useEffect } from "react";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

function AppliedJobTable() {
  const dispatch = useDispatch();
  const allAppliedJobs = useSelector((state) => state.job.allAppliedJobs);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated); // 👈 wait for persist

  useEffect(() => {
    if (!isRehydrated) return; // 👈 prevent fetch before redux state is ready

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        console.log("Fetched Data: ", res.data);

        if (res.data?.success && Array.isArray(res.data.applications)) {
          dispatch(setAllAppliedJobs(res.data.applications));
        }
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch, isRehydrated]); // 👈 re-run only after state is ready

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border border-gray-200 rounded-md">
        <TableCaption className="font-bold mb-2">
          A list of your applied jobs
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(allAppliedJobs) && allAppliedJobs.length > 0 ? (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>
                  {new Date(appliedJob.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{appliedJob?.job?.title ?? "N/A"}</TableCell>
                <TableCell>{appliedJob?.job?.company?.name ?? "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      appliedJob.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                          ? "bg-gray-400"
                          : "bg-green-400"
                    }
                  >
                    {appliedJob.status?.toUpperCase() ?? "UNKNOWN"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AppliedJobTable;
