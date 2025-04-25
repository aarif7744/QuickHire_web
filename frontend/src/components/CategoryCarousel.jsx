import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
];

function CategoryCarousel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    dispatch(setSearchedQuery(category));
    navigate("/browse");
  };

  return (
    <div className="px-4">
      <Carousel className="w-full max-w-5xl mx-auto mt-10">
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselItem
              key={category}
              className="flex justify-center md:basis-1/2 lg:basis-1/3"
            >
              <Button
                onClick={() => handleCategoryClick(category)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                {category}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
