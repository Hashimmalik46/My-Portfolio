import { useState } from "react";

function About() {
  const [activeTab, setActiveTab] = useState("about");
  const activeClass =
    "text-xl text-pAccent underline font-poppins cursor-pointer transiton-all duration-200";
  const inactiveClass =
    "text-xl text-white font-poppins cursor-pointer transiton-all duration-200";
  return (
    <div>
      <h1 className="font-longsile text-5xl text-white">About Me</h1>
      <ul className="w-100 flex gap-10 my-10">
        <li
          id="about"
          className={activeTab === "about" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("about")}
        >
          About
        </li>
        <li
          id="skills"
          className={activeTab === "skills" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </li>
        <li
          id="exp"
          className={activeTab === "exp" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("exp")}
        >
          Experience
        </li>
      </ul>
      <div>
        {activeTab === "about" && (
          <p className="text-white text-xl font-poppins">
            I'm Hashim Malik, a passionate Frontend Developer who enjoys
            building clean and interactive web applications.
          </p>
        )}

        {activeTab === "skills" && (
          <div className="flex gap-8 items-center">
            <img src="html.png" className="w-12" />
            <img src="css.png" className="w-12" />
            <img src="js.png" className="w-12" />
            <img src="react.png" className="w-12" />
            <img src="tailwind.png" className="w-12" />
          </div>
        )}

        {activeTab === "exp" && (
          <p className="text-white text-xl font-poppins">
            Currently building projects and improving my frontend skills.
          </p>
        )}
      </div>
    </div>
  );
}
export default About;
