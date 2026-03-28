"use client"

import { TestimonialsColumn } from "@/components/ui/testimonials-column"
import { motion } from "framer-motion"

const testimonials = [
  {
    text: "Worth revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing Worth was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    name: "Daniel Cooper",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    name: "Sarah Mitchell",
    role: "Customer Support Lead",
  },
  {
    text: "Worth's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    name: "James Whitfield",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    name: "Rachel Henderson",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    name: "Emily Carter",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    name: "Marcus Bennett",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    name: "Lauren Davis",
    role: "Sales Manager",
  },
  {
    text: "Using Worth, our online presence and conversions significantly improved, boosting business performance.",
    name: "Ryan Gallagher",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsSection = () => {
  return (
    <section className="bg-transparent py-24 relative overflow-hidden">
      <div className="container px-6 relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[800px] mx-auto mb-16"
        >
          <div className="flex justify-center">
            <span className="px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/5 border border-primary/20 rounded-full">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-josefin font-bold tracking-tighter text-white text-center">
            What our <span className="text-primary italic">users say</span>
          </h2>
          <p className="text-center mt-6 text-secondary text-lg font-josefin max-w-lg">
            See how Worth is transforming financial intelligence for ambitious companies and individuals.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
        </div>
      </div>
    </section>
  );
};
