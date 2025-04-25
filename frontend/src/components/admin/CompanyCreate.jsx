import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_END_POINT } from "@/utils/constant";

function CompanyCreate() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState(""); 

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true, // ✅ Ensure cookies are sent
                }
            );

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);

                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`); 
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to register company.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                <h1 className="font-bold text-2xl">Your Company Name</h1>
                <p className="text-gray-500 mb-4">
                    What would you like to name your company? You can change this later.
                </p>

                <div className="my-4">
                    <Label className="block text-sm font-medium text-gray-700">
                        Your Company Name
                    </Label>
                    <Input
                        type="text"
                        className="my-2 w-full p-2 border rounded-md"
                        placeholder="JobHunt, Microsof etc.."
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className="flex items-center gap-4 ">
                        <Button variant="outline" onClick={() => navigate("/admin/companies")}>
                            Cancel
                        </Button>
                        <Button onClick={registerNewCompany} className="bg-blue-500">
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyCreate;
