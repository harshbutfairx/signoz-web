import React from "react";

const Hero = ({ children }) => {
  return (
    <h1 className="my-2 text-3xl font-semibold tracking-tight dark:text-white sm:my-5 md:leading-[3.5rem] lg:text-[44px] text-gradient">
      {children}
    </h1>
  );
};

export default Hero;
