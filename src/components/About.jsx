import { useState } from "react";

import Skills from "./Skills";
import Orbit from "./OrbitSkills";

const tabs = ["About", "Skills", "Experience"];
function About() {
  const [activeTab, setActiveTab] = useState("About");
  return (
    <div className="flex p-5">
      <div className="w-1/2">
        <img src="/character.png" />
      </div>

      <div className="w-1/2 flex flex-col gap-5">
        <h1 className="text-3xl text-white font-longsile self-center">
          About Me
        </h1>

        <div className="border border-primary w-full rounded-xl p-2 flex items-center justify-around font-poppins">
          {tabs.map((tab) => {
            return (
              <span
                className={`${activeTab === tab ? "bg-white  text-xl px-3 py-1 rounded-xl cursor-pointer transition-all duration-200" : "text-white text-xl px-3 py-1 rounded cursor-pointer"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            );
          })}
        </div>
        {activeTab === "About" && (
          <div>
            <p className="text-white text-xl font-poppins text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam harum quibusdam reiciendis id corporis dolorem odit
              laborum explicabo earum nihil dolores minima voluptatum
              consectetur, rerum repudiandae. Cumque amet molestiae quaerat?
            </p>
          </div>
        )}

        {activeTab === "Skills" && (
          <div className="flex flex-wrap gap-5">
            <Orbit />
          </div>
        )}
        {activeTab === "Experience" && ""}
      </div>
    </div>
  );
}

export default About;
