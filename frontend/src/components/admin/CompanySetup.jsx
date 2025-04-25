import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
// import useGetCompanyById from '@/hooks/useGetCompanyById'
const CompanySetup = () => {
  // const params =useParams()
  // useGetCompanyById(params.id)
  const navigate = useNavigate();
  const { id } = useParams();
  const { singleCompany } = useSelector((store) => store.company);
  
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle text input changes
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle file upload and set preview
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({
        ...input,
        file,
        logo: URL.createObjectURL(file),
      });
    }
  };

  // ✅ Fetch existing company data
  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        logo: singleCompany.logo || "",
        file: null,
      });
    }
  }, [singleCompany]);

  // ✅ Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    // Check if at least one field is updated
    const isEmpty =
      !input.name &&
      !input.description &&
      !input.website &&
      !input.location &&
      !input.file;

    if (isEmpty) {
      return toast.error("At least one field is required to update.");
    }

    const formData = new FormData();
    if (input.name) formData.append("name", input.name);
    if (input.description) formData.append("description", input.description);
    if (input.website) formData.append("website", input.website);
    if (input.location) formData.append("location", input.location);
    if (input.file) formData.append("logo", input.file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto my-10 bg-white p-6 shadow-md rounded-lg">
        <form onSubmit={submitHandler} className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-5 pb-4 border-b">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-2xl">Company Setup</h1>
          </div>

          {/* Company Name */}
          <div>
            <Label className="block text-gray-700 font-semibold mb-2">
              Company Name
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter company name"
              value={input.name}
              onChange={changeEventHandler}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="block text-gray-700 font-semibold mb-2">
              Description
            </Label>
            <textarea
              name="description"
              placeholder="Enter company description"
              value={input.description}
              onChange={changeEventHandler}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring focus:ring-blue-300 h-28 resize-none"
            />
          </div>

          {/* Website */}
          <div>
            <Label className="block text-gray-700 font-semibold mb-2">
              Website
            </Label>
            <Input
              type="url"
              name="website"
              placeholder="https://company.com"
              value={input.website}
              onChange={changeEventHandler}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Location */}
          <div>
            <Label className="block text-gray-700 font-semibold mb-2">
              Location
            </Label>
            <Input
              type="text"
              name="location"
              placeholder="Enter company location"
              value={input.location}
              onChange={changeEventHandler}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Company Logo Preview */}
          {input.logo && (
            <div className="flex justify-center mb-4">
              <img
                src={input.logo}
                alt="Company Logo"
                className="w-24 h-24 object-cover rounded-full border"
              />
            </div>
          )}

          {/* Upload File */}
          <div>
            <Label className="block text-gray-700 font-semibold mb-2">
              Upload Logo
            </Label>
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="border border-gray-300 p-2 rounded-md w-full bg-white focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-32 hover:bg-blue-600 my-4 bg-blue-500 text-white"
              >
                Update
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
