import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

function Companies() {
  useGetAllCompanies();
  const [input ,setInput]=useState("");
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Filter and Button Section */}
      <div className="max-w-7xl mx-auto py-6 px-11 w-full">
        <div className="flex justify-end md:flex-row items-center  gap-4 mb-6">
         
          <Button  onClick={()=>navigate("/admin/companies/create")} className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md">New Company</Button>
        </div>
      </div>

      {/* Full-Screen Table Section */}
      <div className="w-screen overflow-x-auto px-4 md:px-10">
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
}

export default Companies;
