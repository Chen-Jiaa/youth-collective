"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    className={className}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4 6 4 4 4-4"
    />
  </svg>
);

const faqs = [
  {
    question: "What should I bring?",
    answer: "Placeholder answer - details coming soon.",
  },
  {
    question: "Is food provided?",
    answer: "Placeholder answer - details coming soon.",
  },
  {
    question: "What if I can't afford the fee?",
    answer: "Placeholder answer - details coming soon.",
  },
  {
    question: "Can I join with friends?",
    answer: "Placeholder answer - details coming soon.",
  },
];

const FAQItem = ({
  value,
  question,
  answer,
}: {
  value: string;
  question: string;
  answer: React.ReactNode;
}) => (
  <Accordion.Item value={value} className="border-b border-white/20 w-full">
    <Accordion.Header>
      <Accordion.Trigger className="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-white text-lg font-semibold text-left font-[Inter,sans-serif] group">
        {question}
        <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden text-white/80 text-base leading-relaxed font-[Inter,sans-serif]">
      <div className="pb-5">{answer}</div>
    </Accordion.Content>
  </Accordion.Item>
);

export default function ProgramPage() {
  return (
    <main className="font-[Inter,sans-serif]">
      <Navbar />

      {/* Hero Section */}
      <section className=" text-black flex flex-col items-center text-center px-4 pt-25 pb-15">
        <h1 className="text-[clamp(40px,8vw,72px)] font-black uppercase leading-none mb-6">
          Collective Youth
          <br />
          Summer Program
        </h1>
        <p className="text-[clamp(16px,3vw,20px)] max-w-175 leading-relaxed text-black/90 mb-10">
          A 1 week program designed to help you discover more about yourself and
          God, learn essential life skills, and connect meaningfully with the
          world beyond you.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-200 w-full mb-10">
          <div className="bg-[#FF6B35] p-5 rounded-[10px]">
            <p className="font-bold mb-1">When</p>
            <p className="text-sm">March 23 - 29, 2026</p>
          </div>
          <div className="bg-[#FF6B35] p-5 rounded-[10px]">
            <p className="font-bold mb-1">Where</p>
            <p className="text-sm">Collective Church + Airbnb</p>
          </div>
          <div className="bg-[#FF6B35] p-5 rounded-[10px]">
            <p className="font-bold mb-1">Fee</p>
            <p className="text-sm">RM599 (all inclusive)</p>
          </div>
          <div className="bg-[#FF6B35] p-5 rounded-[10px]">
            <p className="font-bold mb-1">Age</p>
            <p className="text-sm">16-18 years old</p>
          </div>
        </div>

        <p className="text-[#FF6B35] font-semibold">
          Deadline to register: March 8, 2026
        </p>

        {/* Hero Image Placeholder */}
        <div className="w-full max-w-200 h-100 bg-[#1a2a44] rounded-2xl mt-10 flex items-center justify-center text-white/40 text-lg">
          [Hero Image Placeholder]
        </div>
      </section>

      {/* Best School Break Section */}
      <section className="bg-black text-white py-20 px-4 text-center">
        <h2 className="text-[clamp(32px,6vw,56px)] font-black uppercase mb-4">
          Get Ready for the Best
          <br />
          School Break Week
        </h2>
        <p className="text-2xl text-[#FF6B35] font-semibold mb-12">
          Step into a life worth living
        </p>

        <p className="text-xl mb-8">
          <span className="text-[#FF6B35] font-bold">
            How do you get excited
          </span>{" "}
          about your studies,
          <br />
          your career, and your future?
        </p>
        <p className="text-xl mb-8">
          <span className="text-[#FF6B35] font-bold">
            How do you grow deeper
          </span>{" "}
          in your relationship
          <br />
          with God?
        </p>
        <p className="text-xl mb-8">
          <span className="text-[#FF6B35] font-bold">
            How do you build real community
          </span>{" "}
          and
          <br />
          connect with others who believe in you?
        </p>
        <p className="text-xl mb-8">
          <span className="text-[#FF6B35] font-bold">How do you serve</span> in
          the most effective
          <br />
          and joyful way possible?
        </p>
        <p className="text-xl">
          <span className="text-[#FF6B35] font-bold">
            How do you discover who you are
          </span>
          <br />
          and what you&apos;re meant to do?
        </p>
      </section>

      {/* The Week That Changes Everything */}
      <section className="bg-[#0a1628] text-white py-20 px-4 text-center">
        <h2 className="text-[clamp(32px,6vw,56px)] font-black uppercase mb-8">
          The Week That Changes
          <br />
          Everything
        </h2>

        <div className="flex flex-col md:flex-row gap-8 max-w-225 mx-auto items-center">
          {/* Image Placeholder */}
          <div className="w-full md:w-1/2 h-75 bg-[#1a2a44] rounded-2xl flex items-center justify-center text-white/40 text-lg">
            [Image Placeholder]
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 text-left">
            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The Collective Youth Summer Program was started to help youth
              discover their{" "}
              <span className="text-[#FF6B35] font-semibold">purpose</span>,
              grow their{" "}
              <span className="text-[#FF6B35] font-semibold">faith</span>, build{" "}
              <span className="text-[#FF6B35] font-semibold">community</span>,
              and develop real-world{" "}
              <span className="text-[#FF6B35] font-semibold">skills</span>.
            </p>
            <p className="text-lg leading-relaxed text-white/90">
              This isn&apos;t just about learning — it&apos;s about
              transformation. You&apos;ll leave with clarity about your future,
              deeper relationships, and a stronger foundation for life.
            </p>
          </div>
        </div>

        <a
          href="#register"
          className="inline-block mt-12 bg-[#FF6B35] text-white font-bold uppercase px-8 py-4 rounded-[10px] no-underline text-lg"
        >
          Register Here
        </a>
      </section>

      {/* What's In Store Section */}
      <section className="bg-black text-white py-20 px-4 text-center">
        <h2 className="text-[clamp(32px,6vw,56px)] font-black uppercase mb-12">
          What&apos;s in store 👀
        </h2>

        {/* 4 Quadrant Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 max-w-225 mx-auto mb-12">
          <div className="bg-[#FF6B35] p-8 rounded-2xl">
            <h3 className="text-2xl font-extrabold mb-4">GROW</h3>
            <p className="text-sm leading-relaxed">
              Scripture Workshops
              <br />
              Skills Training
            </p>
          </div>
          <div className="bg-[#0a1628] p-8 rounded-2xl border-2 border-[#FF6B35]">
            <h3 className="text-2xl font-extrabold mb-4">BE IN COMMUNITY</h3>
            <p className="text-sm leading-relaxed">Worship + Pray Together</p>
          </div>
          <div className="bg-[#0a1628] p-8 rounded-2xl border-2 border-[#FF6B35]">
            <h3 className="text-2xl font-extrabold mb-4">EXPLORE</h3>
            <p className="text-sm leading-relaxed">Placeholder activities</p>
          </div>
          <div className="bg-[#FF6B35] p-8 rounded-2xl">
            <h3 className="text-2xl font-extrabold mb-4">SERVE</h3>
            <p className="text-sm leading-relaxed">Placeholder activities</p>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="w-full max-w-200 h-100 bg-[#1a2a44] rounded-2xl mx-auto mb-12 flex items-center justify-center text-white/40 text-lg">
          [Program Image Placeholder]
        </div>

        <a
          href="#register"
          className="inline-block bg-[#FF6B35] text-white font-bold uppercase px-8 py-4 rounded-[10px] no-underline text-lg"
        >
          I Want In!!
        </a>
      </section>

      {/* Not Just Another Camp */}
      <section className="bg-[#0a1628] text-white py-20 px-4 text-center">
        <p className="text-[clamp(24px,4vw,36px)] font-semibold max-w-150 mx-auto">
          Not just another camp or program.
        </p>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="bg-black text-white py-20 px-4">
        <div className="max-w-200 mx-auto">
          <h2 className="text-[clamp(32px,6vw,56px)] font-black uppercase text-center mb-12">
            We Know You&apos;ve Got Questions
          </h2>

          <Accordion.Root
            type="single"
            collapsible
            defaultValue="0"
            className="w-full font-[Inter,sans-serif]"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                value={String(index)}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#0a1628] text-white py-20 px-4 text-center">
        <h3 className="text-2xl font-bold mb-6">
          For any inquiries, please contact:
        </h3>
        <div className="flex flex-col gap-2 text-base text-white/80">
          <p>[Contact Person]</p>
          <p>[Email Address]</p>
          <p>[Website]</p>
          <p>[YouTube]</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
