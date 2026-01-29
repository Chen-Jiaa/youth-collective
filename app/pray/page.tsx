"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrayPage() {
  return (
    <main className="text-black min-h-screen font-sans">
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/DSCF7707_(1)_e1jDFreZ5uHHnMF-9ENlh.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-8xl uppercase tracking-tight text-center text-white">
            PRAY
          </h1>
        </div>
      </section>

      {/* Prayer Apps Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-black text-sm uppercase tracking-widest mb-4">
            TOOLS
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-center text-black mb-12">
            Find more ways to pray.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Echo Prayer */}
            <div className="flex flex-col">
              <div className="relative w-full aspect-video mb-4">
                <Image
                  src="/assets/echo_1_vdQpxqI1jl6nzc8vZzHQE.jpg"
                  alt="Echo Prayer"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="font-heading text-xl md:text-2xl text-black mb-2">
                Echo Prayer
              </h3>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                Turn your phone into a prayer room.
              </p>
              <Link
                href="#"
                className="inline-block bg-white text-black font-bold uppercase text-sm px-6 py-3 rounded hover:bg-gray-200 transition-colors text-center"
              >
                PRAY NOW
              </Link>
            </div>

            {/* Lectio 365 */}
            <div className="flex flex-col">
              <div className="relative w-full aspect-video mb-4">
                <Image
                  src="/assets/lectio-scaled_sCGv1_aZFapAInAeye8e8.webp"
                  alt="Lectio 365"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="font-heading text-xl md:text-2xl text-black mb-2">
                Lectio 365
              </h3>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                Help you to pray the Bible every day.
              </p>
              <Link
                href="https://www.24-7prayer.com/resource/lectio-365/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black font-bold uppercase text-sm px-6 py-3 rounded hover:bg-gray-200 transition-colors text-center"
              >
                PRAY NOW
              </Link>
            </div>

            {/* How to pray */}
            <div className="flex flex-col">
              <div className="relative w-full aspect-video mb-4">
                <Image
                  src="/assets/inner-room-resource_content_header-scaled_13lZRk8ML9rwnORdISa6_.jpg"
                  alt="How to pray"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="font-heading text-xl md:text-2xl text-black mb-2">
                How to pray?
              </h3>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                Learn how to pray from 24-7 Prayer, a student-led prayer that
                went viral and led groups all over the world to pray together.
              </p>
              <Link
                href="https://www.24-7prayer.com/how-to-pray/help-me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black font-bold uppercase text-sm px-6 py-3 rounded hover:bg-gray-200 transition-colors text-center"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Teachings Section */}
      <section className=" py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-400 text-sm uppercase tracking-widest mb-4">
            TEACHINGS
          </p>
          <p className="text-gray-400 text-center text-base md:text-lg mb-12">
            Listen to the past teachings on prayer.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Video 1 */}
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ERm4RGcv5Fk"
                title="[May 19, 2019] Prayer: Hallowed - Esther Ku"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded"
              />
            </div>

            {/* Video 2 */}
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/Yg_kooVvv7s"
                title="[May 26, 2019] Prayer: Unanswered Prayer - Kevin Loo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded"
              />
            </div>

            {/* Video 3 */}
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/wa04cOsH1Hk"
                title="[June 9, 2019] Prayer: Wordless - Kevin Loo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
