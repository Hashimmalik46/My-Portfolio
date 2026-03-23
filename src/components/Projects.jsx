import Project from "./Project";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const projects = [
  {
    title: "Role Based Clinic Management System",
    img: "/Zooncare.png",
    desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos voluptatem veniam dolorem tempore voluptatibus ipsum quibusdam, molestiae laboriosam officiis necessitatibus nemo, numquam et iusto culpa harum molestias! Reiciendis, sequi quasQuis beatae unde qui rerum quisquam, atque at perspiciatis in, optio eos dolorem officiis repudiandae blanditiis doloribus molestiae, illum nihil ipsum aperiam velit quas praesentium repellat voluptas veniam voluptates? RecusandaeVoluptatum illum autem, possimus quibusdam tempora temporibus a ad maiores porro nam dolores cumque veniam laudantium deserunt ducimus numquam, similique hic laboriosam non earum aut tenetur! Nihil vitae ut veniam.Suscipit earum aut et sunt.",
    short_desc:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis in debitis velit praesentium aspernatur tempora laudantium odio, nullanon pariatur quibusdam quos voluptatem, voluptatibus modi.",

    tags: [
      {
        id: 1,
        img: "react.png",
        tag: "React",
      },
      {
        id: 2,
        img: "tailwind.png",
        tag: "Tailwind",
      },
    ],
    link: "https://hashimmalik.in",
  },
  {
    title: "Campus Connect",
    img: "/CC.png",
    desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos voluptatem veniam dolorem tempore voluptatibus ipsum quibusdam, molestiae laboriosam officiis necessitatibus nemo, numquam et iusto culpa harum molestias! Reiciendis, sequi quasQuis beatae unde qui rerum quisquam, atque at perspiciatis in, optio eos dolorem officiis repudiandae blanditiis doloribus molestiae, illum nihil ipsum aperiam velit quas praesentium repellat voluptas veniam voluptates? RecusandaeVoluptatum illum autem, possimus quibusdam tempora temporibus a ad maiores porro nam dolores cumque veniam laudantium deserunt ducimus numquam, similique hic laboriosam non earum aut tenetur! Nihil vitae ut veniam.Suscipit earum aut et sunt.",
    short_desc:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis in debitis velit praesentium aspernatur tempora laudantium odio, nullanon pariatur quibusdam quos voluptatem, voluptatibus modi.",

    tags: [
      {
        id: 1,
        img: "html.png",
        tag: "HTML",
      },
      {
        id: 2,
        img: "css.png",
        tag: "CSS",
      },
      {
        id: 3,
        img: "js.png",
        tag: "JavaScript",
      },
    ],
    link: "https://hashimmalik.in",
  },
];

function Projects() {
  const [isPreview, setPreviewOpen] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 10 }, { stiffness: 50 });
  const springY = useSpring(y, { damping: 10 }, { stiffness: 50 });

  const handleMouseMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-5"
      onMouseMove={handleMouseMove}
    >
      <h1 className="text-4xl font-longsile self-center">Projects</h1>
      {projects.map((project, index) => (
        <Project
          key={index}
          project={project}
          isPreview={isPreview}
          setPreviewOpen={setPreviewOpen}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      ))}
      {isPreview && !isOpen && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 object-cover w-80 shadow-lg rounded-xl overflow-hidden"
          style={{ x: springX, y: springY }}
        >
          <img src={isPreview} className="w-full h-full object-cover" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default Projects;
