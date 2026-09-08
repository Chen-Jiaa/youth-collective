import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const learningLabs = [
  {
    title: "Learning Labs: Classes",
    description:
      "A few hours to eat together, ask honest questions, and practise the way of Jesus with people figuring it out too.",
    href: "/classes",
    action: "Find a class",
    accent: "bg-[#e4eddc] text-[#273022]",
    actionStyle: "bg-[#273022] text-white hover:bg-[#4e684a]",
    image: "/assets/homepage/hero-image.jpg",
    imageAlt: "Students spending time together",
    detail: "Recurring gatherings",
  },
  {
    title: "Learning Labs: Experience",
    description:
      "A week away from distractions to experience God for yourself—alongside new friends, big questions, and plenty of fun.",
    href: "/learninglabs",
    action: "Discover the experience",
    accent: "bg-[#f45c36] text-black",
    actionStyle: "bg-black text-white hover:bg-white hover:text-black",
    image: "/assets/program/summer/summer-program-01.jpg",
    imageAlt: "Students enjoying time together at Learning Labs",
    detail: "6–12 Dec 2026 · Ages 13–17",
  },
] as const;

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white text-[#292823] antialiased">
      <section className="border-b border-black/10 bg-white py-5 md:py-8">
        <Container>
          <div className="grid overflow-hidden border border-black/15 bg-black lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <div className="flex min-h-[31rem] flex-col justify-between p-7 text-white sm:p-10 md:min-h-[38rem] md:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#dce8c6]">
                Strictly Students
              </p>
              <div className="max-w-2xl py-10">
                <h1 className="font-heading text-[clamp(3rem,7vw,6.25rem)] leading-[0.88] tracking-[-0.055em]">
                  A place to bring your whole self.
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-white/75 md:text-lg md:leading-8">
                  We&apos;re a God-centred community for students who want to know Jesus, find their people, and live for what matters most.
                </p>
              </div>
              <a
                className="inline-flex w-fit min-h-12 items-center border border-white/40 px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#dce8c6]"
                href="#learning-labs"
              >
                Explore Learning Labs <span aria-hidden="true" className="ml-2">↓</span>
              </a>
            </div>
            <div className="relative min-h-[22rem] border-t border-white/15 lg:min-h-0 lg:border-l lg:border-t-0">
              <Image
                src="/assets/program/summer/summer-program-08.jpg"
                alt="Students gathered together outdoors"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <p className="absolute bottom-0 left-0 bg-[#dce8c6] px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#273022] sm:px-7">
                Made for students
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="learning-labs" className="scroll-mt-6 bg-white py-20 md:py-28">
        <Container>
          <div className="grid gap-7 border-b border-black/15 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.58fr)] md:items-end md:gap-14 md:pb-14">
            <div>
              <h2 className="max-w-3xl font-heading text-[clamp(3rem,6vw,5.5rem)] leading-[0.88] tracking-[-0.055em]">
                Find your way into Learning Labs.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-black/65 md:text-lg">
              Two ways to step out of the everyday, meet people, and discover more of God. Start with the one that fits your season.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {learningLabs.map((lab) => (
              <article key={lab.href} className={`grid overflow-hidden border border-black/15 ${lab.accent} md:grid-cols-[minmax(0,1fr)_13rem]`}>
                <div className="flex min-h-[25rem] flex-col justify-between p-7 sm:p-9">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-65">{lab.detail}</p>
                    <h3 className="mt-8 max-w-sm font-heading text-4xl leading-[0.9] tracking-[-0.045em] md:text-5xl">
                      {lab.title}
                    </h3>
                    <p className="mt-5 max-w-md text-base leading-7 opacity-80">{lab.description}</p>
                  </div>
                  <Link
                    href={lab.href}
                    className={`inline-flex min-h-12 w-fit items-center px-5 py-3 text-sm font-semibold no-underline transition-colors focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-current ${lab.actionStyle}`}
                  >
                    {lab.action} <span aria-hidden="true" className="ml-2">↗</span>
                  </Link>
                </div>
                <div className="relative min-h-64 border-t border-black/15 md:min-h-0 md:border-l md:border-t-0">
                  <Image src={lab.image} alt={lab.imageAlt} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-black/15 bg-white py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4e684a]">More ways in</p>
              <h2 className="mt-4 max-w-md font-heading text-4xl leading-[0.9] tracking-[-0.045em] md:text-5xl">
                Keep showing up in the ways that matter.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/pray" className="group border border-black/15 p-6 text-black no-underline transition-colors hover:bg-[#efedf6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#625e85]">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#625e85]">Practise</p>
                <h3 className="mt-7 font-heading text-3xl leading-none tracking-[-0.035em]">Pray</h3>
                <p className="mt-4 text-sm leading-6 text-black/65">Simple tools and teachings to help you connect with God.</p>
                <span className="mt-7 inline-block text-sm font-semibold group-hover:underline">Explore prayer ↗</span>
              </Link>
              <Link href="/serve" className="group border border-black/15 p-6 text-black no-underline transition-colors hover:bg-[#e4eddc] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4e684a]">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#4e684a]">Contribute</p>
                <h3 className="mt-7 font-heading text-3xl leading-none tracking-[-0.035em]">Serve</h3>
                <p className="mt-4 text-sm leading-6 text-black/65">Use what you&apos;ve got to help others experience God&apos;s love.</p>
                <span className="mt-7 inline-block text-sm font-semibold group-hover:underline">Find a place ↗</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20">
        <Container className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4e684a]">New here?</p>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl leading-[0.9] tracking-[-0.045em] md:text-5xl">You don&apos;t have to have it all figured out to belong here.</h2>
          </div>
          <Link href="/about" className="inline-flex min-h-12 w-fit items-center border border-[#273022] px-5 py-3 text-sm font-semibold text-[#273022] no-underline transition-colors hover:bg-[#273022] hover:text-white focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#625e85]">
            About Strictly Students <span aria-hidden="true" className="ml-2">↗</span>
          </Link>
        </Container>
      </section>
    </main>
  );
}
