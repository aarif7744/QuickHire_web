import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ['Accepted', 'Rejected'];

// ✅ Pass API endpoint directly instead of using process.env
// const APPLICATION_API_END_POINT = 'https://your-api.com'; // <-- Replace with your actual API URL

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);
  console.log(applicants)

  const statusHandler = async (status, id) => {
    console.log('Status update called');
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="p-4">
      <Table>
        <TableCaption>A list of recently applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.length > 0 ? (
            applicants.applications.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item?.applicant?.fullname || 'N/A'}</TableCell>
                <TableCell>{item?.applicant?.email || 'N/A'}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                <TableCell>
                  {item?.applicant?.profile?.resumeUrl ? (
                    <a
                      href={item.applicant.profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    'No Resume'
                  )}
                </TableCell>
                <TableCell>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-gray-200 transition">
                        <MoreHorizontal />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2 bg-white shadow-lg rounded-md border">
                      {shortlistingStatus.map((status, index) => (
                        <button
                          onClick={() => statusHandler(status, item?._id)}
                          key={index}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100 transition"
                        >
                          {status}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No applicants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
