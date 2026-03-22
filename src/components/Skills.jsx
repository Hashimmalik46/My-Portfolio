const skills = [
  {
    img: "html.png",
    desc: "HTML",
  },
  {
    img: "css.png",
    desc: "CSS",
  },
  {
    img: "js.png",
    desc: "JavaScript",
  },
  {
    img: "react.png",
    desc: "React",
  },
  {
    img: "tailwind.png",
    desc: "Tailwind",
  },
];

function Skills() {
  return skills.map((skill) => {
    return (
      <div className="flex flex-col items-center w-35 px-2 py-3 gap-5 rounded hover:scale-105 shadow shadow-gray-800 transition-all duration-200">
        <img src={skill.img} className="w-20" />
        <h1 className="text-white font-poppins text-xl shadow-2xl">
          {skill.desc}
        </h1>
      </div>
    );
  });
}
export default Skills;
