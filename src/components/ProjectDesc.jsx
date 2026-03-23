import { LuExternalLink } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";

function ProjectDesc({ project, handleModalClose, isOpen }) {
  const { title, img, desc, short_desc, tags, link } = project;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full bg-white/10 backdrop-blur-lg absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col gap-5 w-full max-w-2xl backdrop-blur-lg text-black rounded-2xl border border-black/10 shadow-lg p-5 mb-15"
          >
            <button
              className="bg-white/20 text-black w-10 h-10 absolute right-3 top-3 text-2xl rounded-full hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-lg shadow-lg"
              onClick={handleModalClose}
            >
              &times;
            </button>
            <img src={img} className="w-full h-64" />
            <div className="p-3 flex flex-col gap-5">
              <h1 className="text-xl font-poppins font-bold">{title}</h1>
              <p className="font-poppins text-justify">{desc}</p>
              <div className="w-full flex items-center justify-between">
                <div className="w-1/2 flex items-center gap-5">
                  {tags.map((tag) => {
                    return (
                      <img
                        src={tag.img}
                        className="w-10 hover:scale-102 transition-all duration-200"
                      />
                    );
                  })}
                </div>

                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-40 hover:text-pAccent font-poppins flex items-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <LuExternalLink />
                  View Project
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectDesc;
