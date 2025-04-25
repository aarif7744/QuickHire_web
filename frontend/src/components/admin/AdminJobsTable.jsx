import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AdminJobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch jobs & companies from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/job/get", {
          withCredentials: true,
        });

        if (data?.success) {
          setJobs(data.jobs);

          // ✅ Extract Unique Companies
          const uniqueCompanies = [
            ...new Map(data.jobs.map((job) => [job.company?._id, job.company])).values(),
          ].filter((company) => company?.name);

          setCompanies(uniqueCompanies);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Optimized filtering using useMemo
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        !searchText ||
        job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchText.toLowerCase());

      const matchCompany = !selectedCompany || job?.company?._id === selectedCompany.value;

      return matchSearch && matchCompany;
    });
  }, [searchText, selectedCompany, jobs]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-gray-50 min-h-screen">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-semibold text-gray-700 mb-4 text-center"
      >
        Admin Job Listings
      </motion.h2>

      {/* 🔹 Search Input & Select Company Dropdown */}
      <div className="flex gap-4 mb-4">
        <motion.input
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          type="text"
          placeholder="Search jobs by title or company..."
          className="w-2/3 p-3 border rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Select a Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Company</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 🔹 Table Section */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <TableCaption className="text-lg font-semibold text-gray-600">A list of recently posted jobs.</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="p-3 border">Company Name</TableHead>
              <TableHead className="p-3 border">Role</TableHead>
              <TableHead className="p-3 border">Date</TableHead>
              <TableHead className="p-3 border text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // ✅ Improved Skeleton Loader
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell className="p-3 border"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
                  <TableCell className="p-3 border"><div className="h-4 w-24 bg-gray-300 rounded"></div></TableCell>
                  <TableCell className="p-3 border"><div className="h-4 w-16 bg-gray-300 rounded"></div></TableCell>
                  <TableCell className="p-3 border"><div className="h-8 w-16 bg-gray-300 rounded"></div></TableCell>
                </TableRow>
              ))
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center p-3 border text-gray-500">No jobs found.</TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <motion.tr
                  key={job._id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="bg-white hover:bg-gray-100 transition"
                >
                  <TableCell className="p-3 border font-medium text-gray-700">
                    {job?.company?.name?.trim() ? job.company.name : <span className="text-red-500">No Company</span>}
                  </TableCell>
                  <TableCell className="p-3 border text-gray-600">{job?.title}</TableCell>
                  <TableCell className="p-3 border text-gray-600">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="p-3 border text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-32 bg-white border shadow-lg rounded-md p-2">
                        <div
                          onClick={() => navigate(`/admin/companies/${job._id}`)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        >
                          <Edit2 className="w-4 text-blue-600" />
                          <span className="text-blue-600">Edit</span>
                        </div>
                        <div
                          onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-md mt-1"
                        >
                          <Eye className="w-4 text-green-600" />
                          <span className="text-green-600">Applicants</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
};
export default AdminJobsTable;
