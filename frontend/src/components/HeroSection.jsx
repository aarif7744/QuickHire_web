import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (!query.trim()) return; // ✅ Prevent empty searches
    dispatch(setSearchedQuery(query.trim()));
    navigate('/browse');
  };

  return (
    <div className="text-center mt-2">
      <span className="px-4 py-1 font-bold text-red-600 rounded-full bg-slate-200">
        No.1 Job Alert Website
      </span>
      <h1 className="text-4xl font-bold mt-4">
        Search, Apply & <br />
        Get your <span className="text-violet-700">Dream Jobs</span>
      </h1>
      <p className="mt-2 text-gray-600">
      "Discover and apply for top jobs, manage your profile, and track applications—all in one place!"
      </p>

      <div className="flex w-full sm:w-[60%] md:w-[50%] lg:w-[40%] h-10 mt-6 shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
        <input
          type="text"
          aria-label="Search job input"
          placeholder="Find your dream jobs"
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none border-none w-full bg-transparent text-sm"
        />
        <Button
          onClick={searchJobHandler}
          className="rounded-r-full h-fit px-3 py-2 bg-violet-600 hover:bg-violet-800"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;

