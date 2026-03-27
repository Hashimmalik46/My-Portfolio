import Project from "./Project";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const projects = [
  {
    title: "Role Based Clinic Management System",
    img: "/Zooncare.png",
    desc: "ZoonCare is a full-stack clinical management system designed with a role-based architecture to streamline healthcare workflows. Built using the MERN stack (MongoDB, Express.js, React, Node.js), the platform supports multiple user roles such as administrators, doctors, and staff, each with controlled access to specific functionalities. It enables efficient management of patient records, appointments, and clinical data through a structured and secure interface. The project demonstrates strong backend design, authentication systems, and scalable frontend architecture, making it suitable for real-world clinical environments",
    short_desc:
      "Role-based clinical management platform built using the MERN stack.",

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
    link: "https://zooncare.in",
  },
  {
    title: "Campus Connect",
    img: "/CC.png",
    desc: "It is a social media platform tailored specifically for university environments, allowing students to connect, share updates, and engage within a closed academic community. It provides core features like posting, feeds, and interactions, while maintaining a clean and intuitive user experience.The platform emphasizes community-driven communication within campuses and showcases the implementation of real-time interactions, user authentication, and efficient data handling. It highlights the ability to build scalable and engaging social platforms with a focused audience.",
    short_desc:
      "A university-focused social media platform for connecting students and sharing updates.",

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
    link: "https://kwitter-nine.vercel.app/",
  },
  {
    title: "Arabic with Dr Sajad",
    img: "/SS.png",
    desc: "A full-featured bookstore and content platform built on WordPress, designed with a strong focus on ease of publishing and user experience. The platform allows administrators to add books, upload video courses, and manage content as effortlessly as posting on social media.The frontend emphasizes a clean, intuitive interface for browsing books, consuming content, and accessing premium material through membership-based access. Integrated payment systems enable smooth subscription workflows, while the content structure ensures scalability for both written and video-based learning.This project highlights the ability to transform a traditional CMS into a streamlined, product-like experience by prioritizing usability, content flow, and frontend interaction design.",
    short_desc:
      "Content-driven bookstore platform with seamless publishing, memberships, and integrated video learning.",

    tags: [
      {
        id: 1,
        img: "wordpress.png",
        tag: "WordPress",
      },
      
    ],
    link: "https://arabicwithdrsajad.com/",
  },
];

function Projects() {
  const [isPreview, setPreviewOpen] = useState("");
  const [activeProject, setActiveProject] = useState(null);

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
      className="flex flex-col gap-5 p-3 md:p-1"
      onMouseMove={handleMouseMove}
    >
      <h1 className="text-4xl font-longsile self-center">Projects</h1>
      {projects.map((project, index) => (
        <Project
          key={index}
          project={project}
          index={index}
          isPreview={isPreview}
          setPreviewOpen={setPreviewOpen}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
        />
      ))}
      {isPreview && activeProject === null && (
        <motion.div
          className="hidden md:flex fixed top-0 left-0 pointer-events-none z-50 object-cover w-80 shadow-lg rounded-xl overflow-hidden"
          style={{ x: springX, y: springY }}
        >
          <img src={isPreview} className="w-full h-full object-cover" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default Projects;
