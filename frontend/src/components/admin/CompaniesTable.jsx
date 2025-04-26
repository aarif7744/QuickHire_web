import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import { useNavigate } from "react-router-dom";

function CompaniesTable() {
  const [companies, setCompanies] = useState([]);
  const [filterCompany, setFilterCompany] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          "https://quickhire-web-5.onrender.com/api/v1/companies/get",
          { withCredentials: true }
        );

        if (res?.data?.success) {
          setCompanies(res.data.companies);
        } else {
          console.error("Failed to fetch companies:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(filterCompany.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="w-full overflow-x-auto p-6 bg-gray-50 min-h-screen"
    >
      <motion.h2 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="text-2xl font-semibold text-gray-700 mb-4 text-center"
      >
        Company Directory
      </motion.h2>

      {/* Search Bar */}
      <motion.input
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        type="text"
        placeholder="Search by company name..."
        className="w-full p-3 mb-4 border rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={filterCompany}
        onChange={(e) => setFilterCompany(e.target.value)}
      />

      {/* Table */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <TableCaption className="text-lg font-semibold text-gray-600">
            Recently registered companies.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="p-3 border">Logo</TableHead>
              <TableHead className="p-3 border">Name</TableHead>
              <TableHead className="p-3 border">Date</TableHead>
              <TableHead className="p-3 border">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton Loader
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell className="p-3 border">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto"></div>
                  </TableCell>
                  <TableCell className="p-3 border">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </TableCell>
                  <TableCell className="p-3 border">
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </TableCell>
                  <TableCell className="p-3 border">
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center p-3 border text-gray-500">
                  No companies found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <motion.tr 
                  key={company._id} 
                  whileHover={{ scale: 1.02 }} 
                  transition={{ type: "spring", stiffness: 100 }} 
                  className="bg-white hover:bg-gray-100 transition"
                >
                  <TableCell className="p-3 border text-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden border shadow-md mx-auto">
                      <img
                        src={company.logo || "https://via.placeholder.com/50"}
                        alt={`${company.name} Logo`}
                        className="w-full h-full object-contain bg-white"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/50";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="p-3 border font-medium text-gray-700">{company.name}</TableCell>
                  <TableCell className="p-3 border text-gray-600">
                    {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="p-3 border text-center">
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Edit
                    </motion.button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}

export default CompaniesTable;
