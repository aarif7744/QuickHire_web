import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

function Browse() {
  useGetAllJobs();
  const dispatch = useDispatch();

  const { allJobs } = useSelector((store) => store.job);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]); // ✅ added dispatch to dependencies

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="font-bold text-xl my-10">
          Search Results ({allJobs?.length ?? 0})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {allJobs?.map((item) => (
            <Job key={item._id} job={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Browse;
