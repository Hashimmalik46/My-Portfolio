import { useState } from "react";

function About() {
  const [activeTab, setActiveTab] = useState("about");

  const activeClass =
    "text-sm md:text-xl text-pAccent underline font-poppins cursor-pointer transition-all duration-200";

  const inactiveClass =
    "text-sm md:text-xl text-white font-poppins cursor-pointer transition-all duration-200";

  return (
    <div className="px-6 md:px-20">

      <h1 className="font-longsile text-3xl md:text-5xl text-white">
        About Me
      </h1>

      <ul className="flex gap-6 md:gap-10 my-6 md:my-10">
        <li
          className={activeTab === "about" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("about")}
        >
          About
        </li>

        <li
          className={activeTab === "skills" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </li>

        <li
          className={activeTab === "exp" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("exp")}
        >
          Experience
        </li>
      </ul>

      <div>
        {activeTab === "about" && (
          <p className="text-base md:text-xl text-white font-poppins max-w-[600px]">
            I'm Hashim Malik, a passionate Frontend Developer who enjoys
            building clean and interactive web applications.
          </p>
        )}

        {activeTab === "skills" && (
          <div className="flex gap-6 md:gap-10 items-center flex-wrap">
            <img src="html.png" className="w-10 md:w-14" />
            <img src="css.png" className="w-10 md:w-14" />
            <img src="js.png" className="w-10 md:w-14" />
            <img src="react.png" className="w-10 md:w-14" />
            <img src="tailwind.png" className="w-10 md:w-14" />
          </div>
        )}

        {activeTab === "exp" && (
          <p className="text-base md:text-xl text-white font-poppins">
            Currently building projects and improving my frontend skills.
          </p>
        )}
      </div>
    </div>
  );
}

export default About;