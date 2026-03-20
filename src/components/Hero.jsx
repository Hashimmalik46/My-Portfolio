import { anticipate, easeInOut, easeOut, motion } from "motion/react";
import { useState } from "react";

function Hero() {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <>
      <div className="hidden md:flex w-full h-full flex-col items-center justify-center mt-20">
        <motion.h1
          initial={{ x: -200, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 1 * 0.5,
            ease: easeOut,
          }}
          className="text-[160px] font-longsile absolute"
        >
          Hashim Malik
        </motion.h1>
        <motion.img
          src="character.png"
          onLoad={() => setImgLoaded(true)}
          initial={{ bottom: -500, opacity: 0 }}
          animate={imgLoaded ? { bottom: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: easeOut }}
          className="w-[900px] absolute bottom-0 drop-shadow drop-shadow-pAccent"
        />
        <motion.h1
          initial={{ x: 200, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 1 * 0.5,
            ease: easeOut,
          }}
          className="text-5xl md:text-6xl lg:text-[160px] font-longsile absolute text-transparent [-webkit-text-stroke:0.5px_white]"
        >
          Hashim Malik
        </motion.h1>
      </div>

      <div className="md:hidden w-full h-full flex flex-col items-center mt-40">
        <motion.h1
          initial={{
            x: -300,
          }}
          animate={{
            x: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 1 * 0.5,
            ease: easeOut,
          }}
          className="text-[30px] font-longsile"
        >
          Hey there!
        </motion.h1>
        <motion.h1
          initial={{
            x: 600,
          }}
          animate={{
            x: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 2 * 0.5,
            ease: easeOut,
          }}
          className="text-[45px] font-longsile"
        >
          I'm Hashim Malik
        </motion.h1>
        <motion.h1
          initial={{
            y: 600,
          }}
          animate={{
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 3 * 0.5,
            ease: easeOut,
          }}
          className="text-[20px] font-longsile text-center"
        >
          Frontend Dev | Designer | Gamer
        </motion.h1>
        <motion.img
          src="character.png"
          initial={{
            bottom: -500,
            opacity: 0,
          }}
          animate={{
            bottom: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0 * 0.5,
            ease: easeOut,
          }}
          className="absolute bottom-0 drop-shadow drop-shadow-pAccent"
        />
      </div>
    </>
  );
}
export default Hero;
