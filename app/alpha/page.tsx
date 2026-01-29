"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

// ChevronDown SVG component (no lucide-react dependency)
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

// Episode data - matching original Webstudio content exactly
const episodes = [
  {
    number: 1,
    title: "Welcome to the conversation",
    date: "May 4 | Stage 8 | 1PM - 3PM",
    variant: "blue" as const,
  },
  {
    number: 2,
    title: "Jesus is...",
    date: "May 18 | Stage 8 | 1PM - 3PM",
    variant: "lime" as const,
  },
  {
    number: 3,
    title: "What does real love look like?",
    date: "June 1 | Stage 8 | 1PM - 3PM",
    variant: "blue" as const,
  },
  {
    number: 4,
    title: "Why would I want a relationship with God?",
    date: "June 15 | Stage 8 | 1PM - 3PM",
    variant: "lime" as const,
  },
  {
    number: 5,
    title: "What does a relationship with God look like?",
    date: "june 22 | Stage 8 | 1PM - 3PM",
    variant: "blue" as const,
  },
  {
    number: 6,
    title: "Who is the holy spirit?",
    date: null,
    alphaWeekend: true,
    variant: "lime" as const,
  },
  {
    number: 7,
    title: "how can i be filled with the holy spirit?",
    date: null,
    alphaWeekend: true,
    variant: "blue" as const,
  },
  {
    number: 8,
    title: "how does god help us overcome evil?",
    date: null,
    alphaWeekend: true,
    variant: "lime" as const,
  },
  {
    number: 9,
    title: "does god heal today?",
    date: "July 13 | Stage 8 | 1PM - 3PM",
    variant: "blue" as const,
  },
  {
    number: 10,
    title: "what happens next?",
    date: "July 20 | Stage 8 | 1PM - 3PM",
    variant: "lime" as const,
    isBold: true,
  },
];

// FAQ data - matching original Webstudio content exactly
const faqs = [
  {
    question: "What are the dates?",
    answer: (
      <>
        Alpha Youth kicks off on <strong>May 4</strong> and runs for{" "}
        <strong>8 weeks</strong>. The highlight will be our{" "}
        <strong>Alpha Weekend Getaway</strong>—more details coming soon!
      </>
    ),
  },
  {
    question: "Do I have to commit to all the sessions?",
    answer:
      "While we encourage you to come for all sessions (since each builds on the last), you're free to join as many as you can. Just show up, and we'll be happy to have you!",
  },
  {
    question: "Can my friends join halfway?",
    answer:
      "Yes! We'd love to have them anytime. But it's best to start early so they don't miss out on key conversations.",
  },
  {
    question: "Do i have to be Christian to join?",
    answer:
      "Not at all! Alpha Youth is for anyone curious about faith—whether you're Christian, unsure, or just exploring. It's a safe space to ask anything—no judgment, just conversation.",
  },
  {
    question: "What will we be talking about?",
    answer: (
      <>
        Alpha Youth is all about real, honest conversations on faith, life, and
        meaning. Some of the topics include:
        <br />
        <br />
        <strong>- Who is Jesus?</strong>
        <br />
        <strong>- Why did Jesus die?</strong>
        <br />
        <strong>- Why do I need a relationship with God?</strong>
        <br />
        <strong>- How do I develop a relationship with God?</strong>
        <br />
        <strong>- Why does evil exist, and how can I overcome it</strong>?
        <br />
        <br />
        No question is off-limits, and everyone is free to share their thoughts
        (or just listen!).
      </>
    ),
  },
  {
    question: "What happens at Alpha Youth?",
    answer:
      "Every session includes food, a short video, and an open discussion where you can ask anything. No preaching, no pressure—just real talk.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes! The weekly Alpha Youth sessions are completely free. However, our Alpha Weekend Getaway will have a fee to cover meals, accommodation, and transportation. Financial assistance may be available—just ask!",
  },
  {
    question: "What if I'm shy or don't know anyone?",
    answer: (
      <>
        No worries! Alpha Youth is all about{" "}
        <strong>friendship and open conversations.</strong> You won&apos;t be
        put on the spot, and our team will make sure you feel welcome from day
        one.
      </>
    ),
  },
  {
    question: "What's the Alpha Weekend Getaway?",
    answer: (
      <>
        It&apos;s a <strong>special getaway experience</strong> where we take a
        break from our usual routine, have fun, go deeper in conversations, and
        explore faith in a relaxed setting. It&apos;s the highlight of Alpha
        Youth! More details on location, schedule, and cost coming soon.
      </>
    ),
  },
  {
    question: "Who can I talk to if I have more questions?",
    answer: (
      <>
        You can reach out to{" "}
        <a
          href="https://www.instagram.com/strictlystudents/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C1FE01] font-bold"
        >
          @strictlystudents
        </a>{" "}
        on Instagram.
      </>
    ),
  },
];

// Episode Card component - matching original blue (#0042FE) and lime (#C1FE01) colors
const EpisodeCard = ({ episode }: { episode: (typeof episodes)[0] }) => {
  const bgColor = episode.variant === "blue" ? "bg-[#0042FE]" : "bg-[#C1FE01]";
  const textColor = episode.variant === "blue" ? "text-white" : "text-black";

  return (
    <div
      className={`${bgColor} ${textColor} flex flex-col items-center justify-center text-center uppercase font-[Inter,sans-serif] min-w-81.25 min-h-81.25 py-5 px-10 gap-2.5`}
    >
      <p className="text-[20px] font-bold tracking-[0.05em]">
        Episode {episode.number}
      </p>
      <h3 className="text-[28px] leading-none font-extrabold uppercase">
        {episode.isBold ? <strong>{episode.title}</strong> : episode.title}
      </h3>
      {episode.date && (
        <p className="text-[14px] tracking-[0.05em] py-1.25 px-2.5">
          {episode.date}
        </p>
      )}
      {episode.alphaWeekend && (
        <a
          href="#alpha-weekend"
          className={`text-[14px] tracking-[0.05em] underline py-1.25 px-2.5 ${episode.variant === "lime" ? "text-black" : "text-white"}`}
        >
          Alpha weekend getaway
        </a>
      )}
    </div>
  );
};

// Accordion Item component
const FAQItem = ({
  question,
  answer,
  value,
}: {
  question: string;
  answer: React.ReactNode;
  value: string;
}) => (
  <Accordion.Item value={value} className="w-full border-b border-slate-200">
    <Accordion.Header className="flex w-full font-[Inter,sans-serif] font-medium uppercase">
      <Accordion.Trigger className="flex flex-1 items-center justify-between py-4 text-left font-medium hover:underline group w-full">
        <span className="text-white font-bold uppercase text-start">
          {question}
        </span>
        <div className="flex items-center justify-center transition-transform duration-200 w-6 h-6">
          <ChevronDown className="w-4 h-4 text-white group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </div>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden text-white data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up pb-4 font-[Inter,sans-serif]">
      {answer}
    </Accordion.Content>
  </Accordion.Item>
);

export default function AlphaPage() {
  return (
    <main className="font-[Inter,sans-serif]">
      <Navbar />
      {/* Hero Section - Purple background #5038E1 */}
      <section className="bg-[rgb(80,56,225)] min-h-[80vh] flex flex-col items-center justify-center text-center pt-5 pb-15 px-4 relative overflow-hidden">
        {/* Decorative images */}
        <Image
          src="/assets/Icon_1_a-hU9tJFz_p_ks0lpsvkQ.png"
          alt=""
          width={300}
          height={300}
          className="absolute left-0 bottom-0 w-75 pointer-events-none"
        />
        <Image
          src="/assets/Icon_3_aW_gDKiW0gTfDJErmdojF.png"
          alt=""
          width={250}
          height={250}
          className="absolute top-0 left-0 w-62.5 pointer-events-none"
        />
        <Image
          src="/assets/Icon_2_EbPOWXD_WcapVhJTZZjdh.png"
          alt=""
          width={350}
          height={350}
          className="absolute bottom-0 right-0 w-87.5 pointer-events-none"
        />
        {/* Main content */}
        <Image
          src="/assets/What_s_on_your_mind_aZKPaQ0byEEFmMxIO3VG3.png"
          alt="What's on your mind?"
          width={350}
          height={350}
          className="w-[60%] max-w-150 mb-4"
        />
        <p className="text-white font-[Inter,sans-serif] text-center w-[60%] max-w-150 mb-4">
          An 8 week journey to explore life, faith, and meaning—no judgment, no
          pressure, just real conversations.
        </p>
        <p className="text-[rgb(193,254,1)] font-bold font-[Inter,sans-serif] text-center">
          Sunday | 1pm - 3pm | Stage 8
        </p>
      </section>

      {/* What is Alpha Section */}
      <section className="bg-black text-white flex flex-col items-center pt-8 pb-15 px-4">
        <div className="w-full max-w-300">
          <div className="flex flex-nowrap gap-15">
            {/* Left content */}
            <div className="flex flex-col items-start justify-center gap-4 flex-1 min-w-0">
              <h2 className="text-[rgb(193,254,1)] text-start font-black text-[60px] uppercase leading-none m-0">
                What is Alpha?
              </h2>
              <p className="text-start font-black text-white m-0">
                Let&apos;s talk.{" "}
                <span className="text-[rgb(254,34,236)]">No judgment,</span>{" "}
                <span className="text-[rgb(255,0,135)]">just real convos.</span>
              </p>
              <p className="text-white font-[Inter,sans-serif] text-start text-base m-0">
                Alpha is a 8-week journey designed for you to explore big
                questions about life and faith in an open, no-pressure
                environment. Expect food, fun, and open discussions where every
                opinion is welcome.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-white font-[Inter,sans-serif] text-start text-base m-0">
                  Time: <span className="text-[rgb(193,254,1)]">1PM-3PM</span>
                </p>
                <p className="text-white font-[Inter,sans-serif] text-start text-base m-0">
                  Location:{" "}
                  <span className="text-[rgb(193,254,1)]">Stage 8</span>
                </p>
              </div>
              <p className="text-white font-[Inter,sans-serif] text-start text-base m-0">
                Dates: <span className="text-[rgb(193,254,1)]">May 4, 18,</span>{" "}
                <span className="text-[rgb(254,34,236)]">June 1, 15, 22,</span>{" "}
                <span className="text-[rgb(255,0,135)]">July 13, 20</span>
              </p>
            </div>
            {/* Right content - phone image */}
            <div>
              <Image
                src="/assets/Alpha_Phone_5OzpZnWtVovGiIgK4Q2bq.jpg"
                alt="Alpha Youth"
                width={400}
                height={120}
              />
            </div>
          </div>

          {/* Sticker and group photo */}
          <div className="relative mt-8">
            <Image
              src="/assets/Alpha_youth_APpvBuyart-uJ7tTaggeT.png"
              alt="Alpha Youth Sticker"
              id="sticker"
              width={100}
              height={100}
              className="absolute -left-25 -bottom-25 w-75 z-10 rotate-[5deg] object-contain"
            />
            <Image
              src="/assets/SS_yw0v7rd-kjP80pPAj2fD-.jpg"
              alt="Alpha Youth Group"
              width={500}
              height={300}
              className="w-full aspect-video rounded-lg object-cover"
            />
          </div>

          {/* What to expect section */}
          <div className="flex flex-col items-center mt-16">
            <p className="text-white font-[Inter,sans-serif] text-center text-base mb-8">
              Here&apos;s what to expect in each session:
            </p>
            <div className="flex flex-row flex-wrap justify-center gap-15">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/assets/Eat_Together_yLb0B-bZytfZQyPL7UkX_.png"
                  alt="Eat Together"
                  width={120}
                  height={120}
                />
                <p className="text-[rgb(193,254,1)] font-bold font-[Inter,sans-serif] text-center m-0">
                  Eat Together
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/assets/Learn_Together_G3V1RjD1RPQhkkdcJFYxO.png"
                  alt="Learn Together"
                  width={120}
                  height={120}
                />
                <p className="text-[rgb(254,34,236)] font-bold font-[Inter,sans-serif] text-center m-0">
                  Learn Together
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/assets/Discuss_Together_h9SUQIlfJFNXWRqDjsw9q.png"
                  alt="Discuss Together"
                  width={120}
                  height={120}
                />
                <p className="text-[rgb(255,0,135)] font-bold font-[Inter,sans-serif] text-center m-0">
                  Discuss Together
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episode List Section */}
      <section className="bg-black flex flex-col items-center px-4 pb-15">
        <h2 className="text-white text-center font-black text-[60px] uppercase leading-none mb-8">
          Episode List
        </h2>
        <div className="flex overflow-x-auto gap-4 w-full pb-4 snap-x">
          <div className="min-w-10 pointer-events-none" aria-hidden="true" />
          {episodes.map((episode) => (
            <EpisodeCard key={episode.number} episode={episode} />
          ))}
        </div>
        <div className="flex items-center justify-center mt-8">
          <a
            href="#register"
            className="bg-[rgb(193,254,1)] text-[rgb(255,0,135)] font-[Inter,sans-serif] font-bold uppercase py-2.5 px-6 rounded-[10px] no-underline"
          >
            Sign Up for Alpha Getaway
          </a>
        </div>
      </section>

      {/* Be a Sponsor Section - Purple background */}
      <section className="bg-[rgb(80,56,225)] flex flex-col items-center py-15 px-4">
        <h2 className="text-[rgb(193,254,1)] text-center font-black text-[60px] uppercase leading-none mb-8">
          Be a Sponsor
        </h2>
        <div className="flex justify-center w-full">
          <div className="bg-white text-[rgb(80,56,225)] rounded-[10px] flex flex-col items-center gap-4 p-8 max-w-150 w-full shadow-lg">
            <h3 className="text-inherit font-black text-center uppercase m-0">
              Sponsors
            </h3>
            <p className="text-inherit font-[Inter,sans-serif] text-center text-base m-0">
              Want to make a difference?
              <br />
              <br />
              Become a sponsor to support our youth! Your giving helps provide
              meals for weekly sessions and makes Alpha Weekend Getaway
              accessible to everyone.
              <br />
              <br />
              Every contribution makes a difference.
              <br />
              Thank you for your generosity and heart to invest in the next
              generation!
            </p>
            <a
              href="https://buy.stripe.com/7sI8z98F93yIgtW28t"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[rgb(193,254,1)] text-[rgb(80,56,225)] font-[Inter,sans-serif] font-bold uppercase py-2.5 px-6 rounded-[10px] no-underline"
            >
              Be a Sponsor
            </a>
          </div>
        </div>
      </section>

      {/* FAQs Section - Purple background */}
      <section
        id="faqs"
        className="bg-[rgb(80,56,225)] flex flex-col items-center py-15 px-4"
      >
        <div className="w-full max-w-200 flex flex-col items-start">
          <h2 className="text-white text-center font-black text-[60px] uppercase leading-none mb-8 w-full">
            FAQS
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
      <Footer />
    </main>
  );
}
