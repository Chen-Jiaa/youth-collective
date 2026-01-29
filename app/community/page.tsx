"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CommunityPage() {
  return (
    <main className="text-black min-h-screen font-sans">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-white">
            <span className="font-['Archivo_Black'] text-4xl md:text-6xl lg:text-8xl uppercase tracking-tight">
              LIVE IN COMMUNITY
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-400 text-lg md:text-xl uppercase">
            PRE-TEENS
          </p>
        </div>
      </section>

      {/* Intro Quote */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-center">
          Spiritual maturity goes from something you do alone to something we do
          together.
        </p>
      </section>

      {/* Hero Image with Text Overlay - Desktop */}
      <section
        className="hidden md:flex relative min-h-125 items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/live_in_community_zYA1dMibhg1HJiU0ENgg-.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h2 className="relative z-10 font-['Archivo_Black'] text-4xl md:text-5xl lg:text-6xl text-center text-white px-4 max-w-4xl">
          Share life together around the table
        </h2>
      </section>

      {/* Hero Image with Text Overlay - Mobile */}
      <section
        className="md:hidden relative min-h-100 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/SnapInsta.to_499221724_18503232136021030_2570933653056605276_n_F5ykwhEXXLaved0RkQZ1T.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h2 className="relative z-10 font-['Archivo_Black'] text-3xl text-center text-white px-4">
          Share life together around the table
        </h2>
      </section>

      {/* Three Pillars Section */}
      <section className="bg-black py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Live as family */}
          <div>
            <h3 className="font-['Archivo_Black'] text-2xl md:text-3xl text-white mb-4">
              Live as family
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              As the family of God, we take time to eat together, pray for one
              another, talk honestly and share life together. We exist to love
              and support each other in practical ways.
            </p>
          </div>

          {/* Become like Jesus */}
          <div>
            <h3 className="font-['Archivo_Black'] text-2xl md:text-3xl text-white mb-4">
              Become like Jesus
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Through deep friendships, we can change our lives to be more like
              Jesus by helping each other follow him. Yes, living together means
              we&apos;ll have conflict. But that&apos;s okay. When we stick with
              each other, even when we&apos;re different, we learn more about
              ourselves and how to love others better.
            </p>
          </div>

          {/* Do what Jesus did */}
          <div>
            <h3 className="font-['Archivo_Black'] text-2xl md:text-3xl text-white mb-4">
              Do what Jesus did
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              We&apos;re not just living for ourselves, we&apos;re living for
              something bigger. We want to do what Jesus would do if He was one
              of us, working with God to show his love to those we meet and
              bring hope to a broken world.
            </p>
          </div>
        </div>
      </section>

      {/* Practice the Way Section - Desktop */}
      <section
        className="hidden md:flex relative min-h-100 items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/Edited2fc1e995-f203-4149-8f55-6a4fd3f45ee9_Q3LkYswb4FmMrGTy7PsUl.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h2 className="relative z-10 font-['Archivo_Black'] text-3xl md:text-4xl lg:text-5xl text-center text-white px-4 max-w-4xl">
          <strong>Practice the way of Jesus together</strong>
        </h2>
      </section>

      {/* Practice the Way Section - Mobile */}
      <section
        className="md:hidden relative min-h-75 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/SnapInsta.to_499594408_18503232103021030_1613399707013934574_n_Cyz1QtE6Zoofb-Q9PMywz.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h2 className="relative z-10 font-['Archivo_Black'] text-2xl text-center text-white px-4">
          <strong>Practice the way of Jesus together</strong>
        </h2>
      </section>

      {/* What We Do & How It Works - Light Section */}
      <section className="bg-white text-black py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* What we do */}
          <div>
            <h2 className="font-['Archivo_Black'] text-3xl md:text-4xl mb-8">
              What we do?
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-800 text-base leading-relaxed">
                  <b>Eat Together</b>
                  <br />
                  We gather around the table to eat together and talk to each
                  other. Sometimes a few of us whip up something for the rest,
                  but most of the time we grabfood together.
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-base leading-relaxed">
                  <b>Learn Together</b>
                  <br />
                  We learn about a practice from the way of Jesus and discuss
                  how it&apos;s like for us with our small group after trying it
                  out. Sometimes we pair up with people who are different from
                  us because it helps us to discover a part of us that we never
                  knew before. But we stick with the same group for four weeks.
                  Less awkward.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="font-['Archivo_Black'] text-3xl md:text-4xl mb-8">
              How it works?
            </h2>
            <div className="space-y-6">
              <p className="text-gray-800 text-base leading-relaxed">
                Information alone is not enough to produce formation.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                The Practices are a multi-week journey that you do with a group.
                Each week, you&apos;ll meet with your group to learn. Then
                you&apos;ll try to put it into practice in your life. Before you
                meet up again, you can reflect with God and others, and maybe
                check out some extra books if you want.
                <br />
                <br />
                We don&apos;t just want to know what Jesus taught, we want to do
                what he taught. We get his ideas from our minds into the muscle
                memory of our bodies. It opens us to God, helps us get closer to
                him and let him change us into people of love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Large Background Image Sections - Alternate Colors */}
      <section className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* What we do - Dark */}
          <div>
            <h2 className="font-['Archivo_Black'] text-3xl md:text-4xl text-white mb-8">
              What we do?
            </h2>
            <div className="space-y-6">
              <p className="text-gray-300 text-base leading-relaxed">
                <b>Eat Together</b>
                <br />
                We gather around the table to eat together and talk to each
                other. Sometimes a few of us whip up something for the rest, but
                most of the time we grabfood together.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                <b>Learn Together</b>
                <br />
                We learn about a practice from the way of Jesus and discuss how
                it&apos;s like for us with our small group after trying it out.
                Sometimes we pair up with people who are different from us
                because it helps us to discover a part of us that we never knew
                before. But we stick with the same group for four weeks. Less
                awkward.
              </p>
            </div>
          </div>

          {/* How it works - Dark */}
          <div>
            <h2 className="font-['Archivo_Black'] text-3xl md:text-4xl text-white mb-8">
              How it works?
            </h2>
            <div className="space-y-6">
              <p className="text-white text-base leading-relaxed">
                Information alone is not enough to produce formation.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                The Practices are a multi-week journey that you do with a group.
                Each week, you&apos;ll meet with your group to learn. Then
                you&apos;ll try to put it into practice in your life. Before you
                meet up again, you can reflect with God and others, and maybe
                check out some extra books if you want.
                <br />
                <br />
                We don&apos;t just want to know what Jesus taught, we want to do
                what he taught. We get his ideas from our minds into the muscle
                memory of our bodies. It opens us to God, helps us get closer to
                him and let him change us into people of love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="w-full">
        <Image
          src="/assets/20230321_101120972_iOS_GgeVo00af5wLd7XEZKtAt.jpg"
          alt="Community gathering"
          width={1500}
          height={951}
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Commit to Community CTA */}
      <section className="bg-black py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Archivo_Black'] text-3xl md:text-4xl text-white mb-6">
            Commit to a Community
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Be a part of this family and stick it out to grow together. You need
            a safe space as much as everyone else, but it only works if all of
            us show up together.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
