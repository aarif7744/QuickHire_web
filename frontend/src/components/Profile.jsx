import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from '@radix-ui/react-label'
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJob";

// const skills = ["Html", "Css", "Javascript", "Reactjs"];

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false );
  const {user }=useSelector(store=>store.auth);

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl my-2 p-1">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-20 w-18">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>
               {user?.profile?.bio}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-2 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 my-2">
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>
        <div className="">
          <h1 className="font-bold">Skills</h1>
          <div className="flex gap-4 my-2">
            {user?.profile?.skills.length !== 0 ? (
             user?.profile?.skills.map((item, index) => (
                <Badge className="bg-gray-200" key={index}>
                  {item}
                </Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>    
        <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                       isResume && user?.profile?.resume ?  <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>Download Resume </a> : <span>{user?.profile?.resumeOriginalName}</span>
                    }
                </div>
      </div>
      <div className="max-w-xl mx-auto bg-white rounded-xl">
        <h1 className="font-bold text-lg">Applied Jobs </h1>
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
