import { motion, AnimatePresence } from "motion/react";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-20 text-white font-longsile">
      
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
      >
        Contact Me
      </motion.h2>

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
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-800 font-poppins"
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
          <ValidationError prefix="Email" field="email" errors={state.errors} />
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
      </motion.form>
    </div>
  );
}

export default ContactForm;