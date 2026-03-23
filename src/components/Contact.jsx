import { motion, AnimatePresence } from "motion/react";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";
import { BorderBeam } from "./ui/border-beam";
import ContactDetails from "./ContactDetails";

function ContactForm() {
  const [state, handleSubmit] = useForm("xeerdlnq");
  const [showMessage, setShowMessage] = useState(false);

  // When form succeeds → show message
  useEffect(() => {
    if (state.succeeded) {
      setShowMessage(true);

      // hide after 3s
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <div className="min-h-[80vh] flex px-6 md:px-20 py-10 text-white font-longsile justify-between">
      {/* Heading */}
      <div className="flex flex-col items-center gap-5 w-1/2">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-4xl font-bold mb-6"
        >
          Contact Me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-white font-poppins text-center"
        >
          Got an idea, a question, or just want to say hi? My inbox is always
          open. Whether it's a project, collaboration, or casual conversation,
          don’t hesitate to reach out!
        </motion.p>
        <ContactDetails />
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-green-500 text-center text-lg mb-6 font-poppins"
          >
            ✅ Message sent successfully!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-lg h-125 rounded-3xl overflow-hidden"
      >
        <BorderBeam duration={8} size={100} />
        <form
          onSubmit={handleSubmit}
          className=" bg-zinc-900 p-8 shadow-2xl border border-zinc-800 font-poppins"
        >
          <input type="text" name="_gotcha" style={{ display: "none" }} />

          <div className="mb-5">
            <label className="block mb-2 text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-400">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full py-3 rounded-lg bg-pAccent font-semibold hover:opacity-90 transition text-white"
          >
            {state.submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ContactForm;
