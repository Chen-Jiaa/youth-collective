import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Container from "../../components/Container";

export const metadata: Metadata = {
  title: "About | Strictly Students",
  description: "A God-centred community for students who want to know Jesus, find their people, and live for what matters most.",
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#f7f6f1] text-[#292823]">
      <section className="border-b border-black/15 bg-black py-5 md:py-8">
        <Container>
          <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
            <div className="flex min-h-[31rem] flex-col justify-between border border-white/15 p-7 text-white sm:p-10 md:min-h-[37rem] md:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#dce8c6]">About Strictly Students</p>
              <div className="max-w-2xl py-10">
                <h1 className="font-heading text-[clamp(3rem,7vw,6.25rem)] leading-[0.88] tracking-[-0.055em]">Come as you are. Grow together.</h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-white/75 md:text-lg md:leading-8">
                  Strictly Students is a God-centred community for students. There&apos;s room here for curiosity, doubt, friendship, laughter, and a life changed by Jesus.
                </p>
              </div>
              <a href="#what-to-expect" className="inline-flex w-fit min-h-12 items-center border border-white/40 px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#dce8c6]">
                What to expect <span aria-hidden="true" className="ml-2">↓</span>
              </a>
            </div>
            <div className="relative min-h-[22rem] border-x border-b border-white/15 lg:min-h-0 lg:border-b-0 lg:border-l-0">
              <Image src="/assets/program/summer/summer-program-03.jpg" alt="Students enjoying a moment together" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <section id="what-to-expect" className="scroll-mt-6 py-20 md:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4e684a]">What we&apos;re about</p>
              <h2 className="mt-4 max-w-md font-heading text-4xl leading-[0.9] tracking-[-0.045em] md:text-5xl">Faith that makes room for real life.</h2>
            </div>
            <div className="divide-y divide-black/15 border-y border-black/15">
              <article className="py-7 md:grid md:grid-cols-[11rem_1fr] md:gap-8 md:py-9">
                <h3 className="font-heading text-2xl leading-none tracking-[-0.03em] text-[#4e684a]">Know Jesus</h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-black/70 md:mt-0 md:text-lg">We&apos;re here to learn the way of Jesus and discover the kind of life he invites us into—not to pretend we have all the answers.</p>
              </article>
              <article className="py-7 md:grid md:grid-cols-[11rem_1fr] md:gap-8 md:py-9">
                <h3 className="font-heading text-2xl leading-none tracking-[-0.03em] text-[#4e684a]">Find people</h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-black/70 md:mt-0 md:text-lg">Learning Labs are built around shared meals, conversations, and time together. You&apos;ll meet students who are figuring things out alongside you.</p>
              </article>
              <article className="py-7 md:grid md:grid-cols-[11rem_1fr] md:gap-8 md:py-9">
                <h3 className="font-heading text-2xl leading-none tracking-[-0.03em] text-[#4e684a]">Live it out</h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-black/70 md:mt-0 md:text-lg">We make space to practise faith in ordinary life: praying honestly, serving others, and choosing what matters most.</p>
              </article>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/15 bg-white py-16 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-5">
            <article className="border border-black/15 bg-[#e4eddc] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4e684a]">Learning Labs</p>
              <h2 className="mt-5 max-w-md font-heading text-4xl leading-[0.9] tracking-[-0.045em]">Two ways to take your next step.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-black/70">Join a Class for recurring conversations and practical faith, or step into Experience for a week away to meet God and your people.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/classes" className="inline-flex min-h-11 items-center bg-[#273022] px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#4e684a] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#625e85]">Classes ↗</Link>
                <Link href="/learninglabs" className="inline-flex min-h-11 items-center border border-[#273022] px-5 py-3 text-sm font-semibold text-[#273022] no-underline transition-colors hover:bg-[#f45c36] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#625e85]">Experience ↗</Link>
              </div>
            </article>
            <article className="border border-black/15 bg-black p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#dce8c6]">Our faith</p>
              <h2 className="mt-5 max-w-md font-heading text-4xl leading-[0.9] tracking-[-0.045em]">Jesus is at the centre.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">We believe God loves people relentlessly, meets us through Jesus, and calls us into a life shaped by grace, truth, and love for others.</p>
              <p className="mt-8 text-sm leading-6 text-white/60">Strictly Students is part of the wider <a href="https://collective.my/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline underline-offset-4 hover:text-[#dce8c6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#dce8c6]">Collective</a> church community.</p>
            </article>
          </div>
        </Container>
      </section>

    </main>
  );
}
