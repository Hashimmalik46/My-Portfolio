import Project from "./Project";
import ProjectDesc from "./ProjectDesc";
import { useState } from "react";

const projects = [
  {
    title: "Role Based Clinic Management System",
    img: "/Zooncare.png",
    desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos voluptatem veniam dolorem tempore voluptatibus ipsum quibusdam, molestiae laboriosam officiis necessitatibus nemo, numquam et iusto culpa harum molestias! Reiciendis, sequi quasQuis beatae unde qui rerum quisquam, atque at perspiciatis in, optio eos dolorem officiis repudiandae blanditiis doloribus molestiae, illum nihil ipsum aperiam velit quas praesentium repellat voluptas veniam voluptates? RecusandaeVoluptatum illum autem, possimus quibusdam tempora temporibus a ad maiores porro nam dolores cumque veniam laudantium deserunt ducimus numquam, similique hic laboriosam non earum aut tenetur! Nihil vitae ut veniam.Suscipit earum aut et sunt.",
    short_desc:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis in debitis velit praesentium aspernatur tempora laudantium odio, nullanon pariatur quibusdam quos voluptatem, voluptatibus modi.",

    tags: ["React", "Tailwind", "Framer Motion"],
    link: "https://hashimmalik.in",
  },
  {
    title: "Campus Connect",
    img: "/CC.png",
    desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos voluptatem veniam dolorem tempore voluptatibus ipsum quibusdam, molestiae laboriosam officiis necessitatibus nemo, numquam et iusto culpa harum molestias! Reiciendis, sequi quasQuis beatae unde qui rerum quisquam, atque at perspiciatis in, optio eos dolorem officiis repudiandae blanditiis doloribus molestiae, illum nihil ipsum aperiam velit quas praesentium repellat voluptas veniam voluptates? RecusandaeVoluptatum illum autem, possimus quibusdam tempora temporibus a ad maiores porro nam dolores cumque veniam laudantium deserunt ducimus numquam, similique hic laboriosam non earum aut tenetur! Nihil vitae ut veniam.Suscipit earum aut et sunt.",
    short_desc:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis in debitis velit praesentium aspernatur tempora laudantium odio, nullanon pariatur quibusdam quos voluptatem, voluptatibus modi.",

    tags: ["JavaScript"],
    link: "https://hashimmalik.in",
  },
];

function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="flex flex-col gap-5">
      {projects.map((project, index) => (
        <Project
          key={index}
          project={project}
          isActive={activeProject === index}
          setActive={() =>
            setActiveProject(activeProject === index ? null : index)
          }
        />
      ))}
    </div>
  );
}

export default Projects;
