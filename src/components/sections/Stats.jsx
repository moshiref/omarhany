import { motion } from "framer-motion";

const stats = [
  { value: "40+", label: "Content Pieces Created" },
  { value: "20+", label: "Brand Collaborations" },
  { value: "98%", label: "Content Performance" },
  { value: "5.0 ⭐", label: "Client Rating" },
];

function Stats() {
  return (
    <section
      id="statistics"
      className="relative w-full scroll-mt-20 overflow-x-clip px-6 py-24 sm:px-10 sm:py-28 lg:px-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          className="mb-10 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-sm tracking-[0.3em] text-text-secondary uppercase">
            UGC Creator Stats
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-accent sm:text-4xl lg:text-5xl">
            Premium performance metrics
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            A concise snapshot of creative output, brand trust, and viewer impact.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="rounded-[1.75rem] border border-border bg-bg-card/90 p-6 text-left shadow-xl shadow-black/5"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: "easeOut" },
                },
              }}
            >
              <p className="text-3xl font-semibold leading-tight text-accent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;
