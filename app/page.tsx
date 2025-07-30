"use client";
// pages/index.js (or app/page.js for App Router)
import { useState, useEffect } from "react";
import Image from "next/image";

const stories = [
  {
    id: 1,
    couple: "Karishma & Varun",
    subtitle: "Romance in the city",
    description:
      "We felt it from our hearts when Karishma described Varun as the last piece of Jigsaw puzzle that made her life complete. In three days, we were fortunate to capture their beautiful journey...",
    image: "/first.jpg",
  },
  {
    id: 2,
    couple: "Huzaifa & Burhan",
    subtitle: "A fairy tale in the valley",
    description:
      "Kashmir completes everyone who breathes in its pious air. So was the fairy spell of Huzaifa. It captivated everyone. There was so much to feel in such a brief period of time...",
    image: "/second.jpg",
  },
  {
    id: 3,
    couple: "Nandini & Sahil",
    subtitle: "The backyard love affair",
    description:
      "Every wedding that we shoot fills our heart in all the most unique ways. We were at Alibaug, for Nandini and Sahil Intimate signing ceremony in their own backyard...",
    image: "/third.jpg",
  },
  {
    id: 4,
    couple: "Milly & Yunus",
    subtitle: "Cosmopolitan bliss in Cappadocia",
    description:
      "Milly & Yunus is a different kind of story. It just happened by chance. We went to Turkey on a private gig but decided to stay back for a few more days in Cappadocia...",
    image: "/fourth.jpg",
  },
];

interface Video {
  id: number;
  link: string;
  image: string;
  embedUrl: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [preloadedEmbeds, setPreloadedEmbeds] = useState<{
    [key: string]: boolean;
  }>({});
  const [embedTimeouts, setEmbedTimeouts] = useState<{
    [key: number]: NodeJS.Timeout;
  }>({});
  const [embedErrors, setEmbedErrors] = useState<{
    [key: number]: boolean;
  }>({});

  // Preload Instagram embeds when component mounts
  useEffect(() => {
    const videoData = [
      {
        id: 1,
        embedUrl: "https://www.instagram.com/p/C_uyn94hghY/embed/",
      },
      {
        id: 2,
        embedUrl: "https://www.instagram.com/reel/CwkBnLwRxJT/embed/",
      },
      {
        id: 3,
        embedUrl: "https://www.instagram.com/reel/DKMcMCaz0LU/embed/",
      },
      {
        id: 4,
        embedUrl: "https://www.instagram.com/p/DMU9E3Lzjc3/embed/",
      },
    ];

    // Preload embeds in the background with better error handling
    videoData.forEach((video) => {
      const iframe = document.createElement("iframe");
      iframe.src = video.embedUrl;
      iframe.style.display = "none";
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";

      iframe.onload = () => {
        setPreloadedEmbeds((prev) => ({ ...prev, [video.embedUrl]: true }));
        // Remove the preload iframe after successful load
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      };

      iframe.onerror = () => {
        // If preload fails, remove the iframe and continue
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };

      document.body.appendChild(iframe);

      // Fallback: remove iframe after 10 seconds regardless
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
    });

    // Cleanup function to clear timeouts
    return () => {
      Object.values(embedTimeouts).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [embedTimeouts]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const weddingDate = formData.get("wedding-date") as string;
    const venue = formData.get("venue") as string;
    const message = formData.get("message") as string;

    // Create email subject and body
    const subject = encodeURIComponent(
      "Wedding Photography & Cinematography Inquiry"
    );
    const body = encodeURIComponent(
      `Hello Weeding Troop Team,

I'm interested in your wedding photography and cinematography services.

My Details:
- Name: ${name || "Not provided"}
- Email: ${email || "Not provided"}
- Phone: ${phone || "Not provided"}
- Wedding Date: ${weddingDate || "Not provided"}
- Venue: ${venue || "Not provided"}

Message:
${message || "No additional message provided"}

Looking forward to hearing from you!

Best regards,
${name || "Potential Client"}`
    );

    // Create mailto URL
    const mailtoUrl = `mailto:info@weedingtroop.com?subject=${subject}&body=${body}`;

    // Open default mail application
    window.open(mailtoUrl, "_blank");
  };

  // Handle video click - open Instagram directly on mobile
  const handleVideoClick = (video: Video) => {
    if (window.innerWidth < 768) {
      // On mobile, open Instagram directly
      window.open(video.link, "_blank");
    } else {
      // On desktop, show modal with loading state
      setSelectedVideo(video);
      setModalOpen(true);
      setLoadingStates((prev) => ({ ...prev, [video.id]: true }));

      // Set a timeout to handle slow loading
      const timeout = setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, [video.id]: false }));
      }, 15000); // 15 second timeout

      setEmbedTimeouts((prev) => ({ ...prev, [video.id]: timeout }));
    }
  };

  // Handle iframe load
  const handleIframeLoad = (videoId: number) => {
    setLoadingStates((prev) => ({ ...prev, [videoId]: false }));
    setEmbedErrors((prev) => ({ ...prev, [videoId]: false }));
    // Clear timeout if it exists
    if (embedTimeouts[videoId]) {
      clearTimeout(embedTimeouts[videoId]);
      setEmbedTimeouts((prev) => {
        const newTimeouts = { ...prev };
        delete newTimeouts[videoId];
        return newTimeouts;
      });
    }
  };

  // Handle iframe error
  const handleIframeError = (videoId: number) => {
    setLoadingStates((prev) => ({ ...prev, [videoId]: false }));
    setEmbedErrors((prev) => ({ ...prev, [videoId]: true }));
    // Clear timeout if it exists
    if (embedTimeouts[videoId]) {
      clearTimeout(embedTimeouts[videoId]);
      setEmbedTimeouts((prev) => {
        const newTimeouts = { ...prev };
        delete newTimeouts[videoId];
        return newTimeouts;
      });
    }
  };

  return (
    <>
      {/* Video Background for Hero */}
      <div className='relative min-h-screen w-full overflow-x-hidden'>
        <video
          className='fixed inset-0 w-full h-full object-cover z-0 m-0 p-0'
          src='/top_video.mp4'
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay for darkening video for text readability (optional, can remove if not needed) */}
        <div className='fixed inset-0 w-full h-full bg-black/40 z-10 pointer-events-none' />
        {/* Navigation */}
        <nav className='fixed top-0 w-full z-20 bg-transparent'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <div className='text-2xl font-bold text-slate-100 font-heading'>
                Wedding Troop
              </div>
              {/* Desktop Nav */}
              <div className='hidden md:flex space-x-8'>
                <a
                  href='#home'
                  className='text-slate-100 hover:text-rose-200 font-premium transition-colors'
                >
                  Home
                </a>
                <a
                  href='#portfolio'
                  className='text-slate-100 hover:text-rose-200 font-premium transition-colors'
                >
                  Portfolio
                </a>
                <a
                  href='#brand-statement'
                  className='text-slate-100 hover:text-rose-200 font-premium transition-colors'
                >
                  About
                </a>
                <a
                  href='#contact'
                  className='text-slate-100 hover:text-rose-200 font-premium transition-colors'
                >
                  Contact
                </a>
              </div>
              {/* Hamburger for Mobile */}
              <button
                className='md:hidden flex items-center justify-center p-2 rounded focus:outline-none z-30'
                aria-label='Open menu'
                onClick={() => setMenuOpen((v) => !v)}
              >
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-slate-100'
                >
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu Overlay */}
          {menuOpen && (
            <div className='fixed inset-0 bg-black/80 z-40 flex flex-col items-center justify-center md:hidden transition-all'>
              <button
                className='absolute top-6 right-6 p-2 rounded text-slate-100'
                aria-label='Close menu'
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
              <a
                href='#home'
                className='text-2xl text-slate-100 font-premium mb-8'
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>
              <a
                href='#portfolio'
                className='text-2xl text-slate-100 font-premium mb-8'
                onClick={() => setMenuOpen(false)}
              >
                Portfolio
              </a>
              <a
                href='#brand-statement'
                className='text-2xl text-slate-100 font-premium mb-8'
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
              <a
                href='#contact'
                className='text-2xl text-slate-100 font-premium'
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content Below Hero */}
      <div className='relative z-30 bg-gradient-to-r from-rose-50 to-amber-50'>
        {/* Premium Brand Statement Section */}
        <section
          id='brand-statement'
          className='w-full bg-gradient-to-br from-rose-50 to-amber-50 py-12 md:py-16 px-2 sm:px-4 flex items-center justify-center relative overflow-hidden'
        >
          <div className='max-w-3xl mx-auto text-center relative z-10'>
            <h2 className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-premium text-rose-900 mb-4 md:mb-6 whitespace-pre-line leading-tight'>
              WE DON&apos;T JUST CAPTURE
              <br />
              WEDDINGS
            </h2>
            <span className='block text-center text-lg xs:text-xl md:text-4xl font-premium text-rose-900 mb-4 md:mb-6'>
              — WE LIVE THEM WITH YOU —
            </span>
            <div className='flex justify-center mb-2 md:mb-4'>
              <Image
                src='/divider-1.png'
                alt='Decorative divider'
                width={224}
                height={224}
                className='hidden md:block h-32 md:h-56 w-auto opacity-80'
              />
            </div>
            <p className='text-base xs:text-lg sm:text-xl md:text-2xl text-slate-700 font-heading mb-6 md:mb-8 max-w-2xl mx-auto'>
              At Wedding Troop, we believe the most treasured memories are
              lived, not staged. Every glance, every laugh, every quiet moment
              is a story we experience with you. We are storytellers, memory
              keepers, and emotional archivists—preserving your day in its most
              authentic, heartfelt form.
            </p>
          </div>
        </section>

        {/* Stories Section */}
        <section
          id='portfolio'
          className='py-12 md:py-20 px-2 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-rose-50 to-rose-50'
        >
          <div className='max-w-4xl mx-auto relative z-10'>
            <h2 className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light text-center text-slate-900 mb-2 md:mb-4 font-heading'>
              A Glimpse Into Our Favourite Love Stories
            </h2>
            <p className='text-base sm:text-xl text-center text-slate-500 mb-8 md:mb-16 font-light'>
              Across The World
            </p>
            {/* 2x2 Card Grid, image only */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12'>
              {stories.map((story) => (
                <div
                  key={story.id}
                  className='group rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 hover:border-rose-300 transition-all duration-300 relative'
                >
                  <Image
                    src={story.image}
                    alt={story.couple}
                    width={400}
                    height={500}
                    className='object-cover w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[3/4] h-full transition-transform duration-500 ease-in-out group-hover:scale-105'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Cinematic Love Stories Video Section */}
        <section className='pb-12 md:pb-20 px-2 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-amber-50 relative overflow-hidden'>
          <div className='relative z-10'>
            <div className='relative left-1/2 right-1/2 -mx-[50vw] w-screen max-w-none aspect-[16/12] sm:aspect-[16/8] max-h-[56rem] bg-black mb-10 '>
              <video
                src='/second.mp4'
                autoPlay
                loop
                muted
                playsInline
                className='w-full h-full object-cover rounded-none'
                style={{ display: "block" }}
              />
            </div>
            <h2 className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light text-center text-slate-800 mb-2 md:mb-4 font-heading'>
              Capture the Journey: Pre
              <span
                style={{
                  fontFamily: "inherit",
                  transform: "rotate(0deg)",
                  fontVariantNumeric: "normal",
                  fontFeatureSettings: "normal",
                  display: "inline-block",
                  fontWeight: "normal",
                  fontStyle: "normal",
                }}
              >
                &#8208;
              </span>
              Wedding Love Stories
            </h2>
            <p className='text-base sm:text-xl text-center text-slate-500 mb-8 md:mb-16 font-light max-w-2xl mx-auto'>
              Every love story has its beautiful beginning. From the first spark
              to the moment you say &ldquo;I do,&rdquo; we capture the
              anticipation, the excitement, and the pure joy of your journey
              together. These intimate moments tell the story of your love
              before the big day arrives.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-4xl mx-auto'>
              {[
                {
                  id: 1,
                  image: "/first_video_image.jpg",
                  link: "https://www.instagram.com/p/C_uyn94hghY/?img_index=1",
                  embedUrl: "https://www.instagram.com/p/C_uyn94hghY/embed/",
                },
                {
                  id: 2,
                  image: "/second_video_image.jpg",
                  link: "https://www.instagram.com/weddingtroop/reel/CwkBnLwRxJT/",
                  embedUrl: "https://www.instagram.com/reel/CwkBnLwRxJT/embed/",
                },
                {
                  id: 3,
                  image: "/third_video_image.jpg",
                  link: "https://www.instagram.com/weddingtroop/reel/DKMcMCaz0LU/",
                  embedUrl: "https://www.instagram.com/reel/DKMcMCaz0LU/embed/",
                },
                {
                  id: 4,
                  image: "/fourth_video_image.jpg",
                  link: "https://www.instagram.com/weddingtroop/p/DMU9E3Lzjc3/?img_index=1",
                  embedUrl: "https://www.instagram.com/p/DMU9E3Lzjc3/embed/",
                },
              ].map((video) => (
                <div
                  key={video.id}
                  className='rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 hover:border-rose-300 transition-all duration-300 relative cursor-pointer w-full'
                  onClick={() => handleVideoClick(video)}
                >
                  <div className='w-full aspect-[4/5] relative'>
                    {/* Custom video thumbnail */}
                    <Image
                      src={video.image}
                      alt={`Wedding Film ${video.id}`}
                      width={400}
                      height={500}
                      className='w-full h-full object-cover rounded-2xl absolute inset-0'
                      style={{ aspectRatio: "4/5" }}
                    />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      {/* White triangle with subtle shadow, no border */}
                      <svg
                        width='80'
                        height='80'
                        viewBox='0 0 80 80'
                        fill='none'
                        style={{
                          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.35))",
                        }}
                      >
                        <polygon
                          points='32,22 62,40 32,58'
                          fill='white'
                          style={{
                            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scroll Images Section */}
        <section className='py-16 pb-8 bg-gradient-to-br from-rose-50 to-amber-50 relative overflow-hidden'>
          <div className='max-w-4xl mx-auto text-center mb-12 relative z-10'>
            <h2 className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-4 md:mb-6 font-heading'>
              Every Frame Tells a Story
            </h2>
            <p className='text-base sm:text-xl text-slate-600 mb-8 font-light leading-relaxed max-w-2xl mx-auto'>
              Through our lens, we capture the whispers of love, the laughter of
              celebration, and the quiet moments that make your day uniquely
              yours. Each image is a chapter in your love story—preserved with
              the artistry and emotion it deserves.
            </p>
          </div>
          <div className='relative scroll-container'>
            {/* First Row - Left to Right */}
            <div className='flex space-x-4 md:space-x-8 animate-scroll-left'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={`row1-${num}`}
                  className='flex-shrink-0 w-48 h-36 md:w-80 md:h-64 rounded-2xl overflow-hidden shadow-2xl scroll-image-container'
                >
                  <Image
                    src={
                      num === 10 ? `/scroll${num}.jpeg` : `/scroll${num}.jpg`
                    }
                    alt={`Wedding moment ${num}`}
                    width={320}
                    height={256}
                    className='w-full h-full object-cover scroll-image'
                    loading='lazy'
                  />
                </div>
              ))}
              {/* Duplicate images for seamless loop */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={`row1-duplicate-${num}`}
                  className='flex-shrink-0 w-48 h-36 md:w-80 md:h-64 rounded-2xl overflow-hidden shadow-2xl scroll-image-container'
                >
                  <Image
                    src={
                      num === 10 ? `/scroll${num}.jpeg` : `/scroll${num}.jpg`
                    }
                    alt={`Wedding moment ${num}`}
                    width={320}
                    height={256}
                    className='w-full h-full object-cover scroll-image'
                    loading='lazy'
                  />
                </div>
              ))}
            </div>

            {/* Second Row - Right to Left */}
            <div className='flex space-x-4 md:space-x-8 animate-scroll-right mt-4 md:mt-8'>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                <div
                  key={`row2-${num}`}
                  className='flex-shrink-0 w-48 h-36 md:w-80 md:h-64 rounded-2xl overflow-hidden shadow-2xl scroll-image-container'
                >
                  <Image
                    src={
                      num === 10 ? `/scroll${num}.jpeg` : `/scroll${num}.jpg`
                    }
                    alt={`Wedding moment ${num}`}
                    width={320}
                    height={256}
                    className='w-full h-full object-cover scroll-image'
                    loading='lazy'
                  />
                </div>
              ))}
              {/* Duplicate images for seamless loop */}
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                <div
                  key={`row2-duplicate-${num}`}
                  className='flex-shrink-0 w-48 h-36 md:w-80 md:h-64 rounded-2xl overflow-hidden shadow-2xl scroll-image-container'
                >
                  <Image
                    src={
                      num === 10 ? `/scroll${num}.jpeg` : `/scroll${num}.jpg`
                    }
                    alt={`Wedding moment ${num}`}
                    width={320}
                    height={256}
                    className='w-full h-full object-cover scroll-image'
                    loading='lazy'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section
          id='contact'
          className='py-12 md:py-20 px-2 sm:px-6 lg:px-8 bg-slate-100 relative overflow-hidden'
        >
          <div className='max-w-4xl mx-auto text-center relative z-10'>
            <h2 className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-6 md:mb-8 font-heading'>
              Let&apos;s Create Your Wedding Troop Story
            </h2>
            <p className='text-base sm:text-xl text-slate-600 mb-8 md:mb-12 font-light leading-relaxed'>
              Ready to preserve your most precious moments? We&apos;d love to
              hear about your special day and how we can be part of your
              journey.
            </p>

            {/* Contact Form */}
            <div className='max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/40 shadow-2xl'>
              <form className='space-y-6' onSubmit={handleFormSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-left text-slate-700 text-sm font-medium mb-2'
                    >
                      Your Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      className='w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all'
                      placeholder='Enter your name'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-left text-slate-700 text-sm font-medium mb-2'
                    >
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      className='w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all'
                      placeholder='Enter your email'
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='wedding-date'
                    className='block text-left text-slate-700 text-sm font-medium mb-2'
                  >
                    Wedding Date
                  </label>
                  <input
                    type='date'
                    id='wedding-date'
                    name='wedding-date'
                    className='w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all'
                  />
                </div>
                <div>
                  <label
                    htmlFor='venue'
                    className='block text-left text-slate-700 text-sm font-medium mb-2'
                  >
                    Wedding Venue
                  </label>
                  <input
                    type='text'
                    id='venue'
                    name='venue'
                    className='w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all'
                    placeholder='Enter your wedding venue'
                  />
                </div>
                <div>
                  <label
                    htmlFor='message'
                    className='block text-left text-slate-700 text-sm font-medium mb-2'
                  >
                    Tell Us About Your Special Day
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    rows={4}
                    className='w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all resize-none'
                    placeholder='Share your vision, preferences, and any special moments you want to capture...'
                  ></textarea>
                </div>
                <button
                  type='submit'
                  className='w-full px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-xl transition-all duration-300 text-lg md:text-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-400/50 border border-slate-600 hover:border-slate-500'
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-8 md:py-12 px-2 sm:px-6 lg:px-8 bg-slate-900 text-center'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 font-heading'>
              Wedding Troop
            </div>
            <p className='text-slate-400 mb-4 sm:mb-8 text-sm sm:text-base'>
              Visual storytellers, memory keepers, and emotional archivists
            </p>
            <div className='flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-2 sm:space-y-0 text-slate-400 mb-4'>
              <a
                href='https://www.instagram.com/weddingtroop/'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-rose-400 transition-colors'
              >
                Instagram
              </a>
              <a
                href='https://wa.me/917252841730'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-rose-400 transition-colors'
              >
                WhatsApp
              </a>
              <a
                href='tel:+917252841730'
                className='hover:text-rose-400 transition-colors'
              >
                +917252841731
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Video Modal Overlay */}
      {modalOpen && selectedVideo && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4'
          onClick={() => {
            // Clear timeout if it exists
            if (embedTimeouts[selectedVideo.id]) {
              clearTimeout(embedTimeouts[selectedVideo.id]);
              setEmbedTimeouts((prev) => {
                const newTimeouts = { ...prev };
                delete newTimeouts[selectedVideo.id];
                return newTimeouts;
              });
            }
            setModalOpen(false);
            setSelectedVideo(null);
            setLoadingStates((prev) => ({
              ...prev,
              [selectedVideo.id]: false,
            }));
          }}
          style={{ overflow: "hidden" }}
        >
          <div className='relative'>
            <div
              className='bg-white rounded-2xl overflow-hidden shadow-2xl'
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "400px", // Increased width
                height: "720px", // Increased height to match Instagram aspect ratio
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
            >
              {/* Loading state */}
              {loadingStates[selectedVideo.id] && (
                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
                  <div className='text-center'>
                    <div className='relative'>
                      {/* Skeleton loader */}
                      <div className='w-64 h-48 md:w-80 md:h-60 bg-gray-200 rounded-lg mb-4 animate-pulse'></div>
                      {/* Loading spinner overlay */}
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-500'></div>
                      </div>
                    </div>
                    <p className='text-slate-600 text-sm font-medium'>
                      Loading Instagram content...
                    </p>
                    <p className='text-slate-400 text-xs mt-1'>
                      This may take a few seconds
                    </p>
                  </div>
                </div>
              )}

              <div
                className='w-full h-full bg-gray-50 flex items-center justify-center'
                style={{
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%", // Use full width of modal
                    height: "100%", // Use full height of modal
                    overflow: "hidden",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    backgroundColor: "white",
                  }}
                >
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={`Instagram Reel ${selectedVideo.id}`}
                    allowFullScreen
                    loading={
                      preloadedEmbeds[selectedVideo.embedUrl] ? "eager" : "lazy"
                    }
                    allow='autoplay; encrypted-media'
                    onLoad={() => handleIframeLoad(selectedVideo.id)}
                    onError={() => handleIframeError(selectedVideo.id)}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      overflow: "hidden",
                      opacity: loadingStates[selectedVideo.id] ? 0 : 1,
                      transition: "opacity 0.5s ease-in-out",
                      // Force hide any scrollbars
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  />
                </div>
              </div>

              {/* Fallback content - only show when iframe fails to load */}
              {embedErrors[selectedVideo.id] && (
                <div className='absolute inset-0 flex items-center justify-center bg-white'>
                  <div className='text-center p-8'>
                    <div className='mb-6'>
                      <svg
                        className='w-16 h-16 text-gray-400 mx-auto mb-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                      Video Unavailable
                    </h3>
                    <p className='text-gray-600 mb-6'>
                      This Instagram content couldn&apos;t be loaded. You can
                      view it directly on Instagram.
                    </p>
                    <button
                      onClick={() => window.open(selectedVideo.link, "_blank")}
                      className='px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400/50'
                    >
                      View on Instagram
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Close button positioned outside the modal */}
            <button
              className='absolute -top-3 -right-3 z-40 p-2 rounded-full bg-gray-800/95 text-white hover:bg-gray-700 shadow-lg transition-all duration-200 hover:scale-110 border border-gray-600'
              onClick={() => {
                // Clear timeout if it exists
                if (embedTimeouts[selectedVideo.id]) {
                  clearTimeout(embedTimeouts[selectedVideo.id]);
                  setEmbedTimeouts((prev) => {
                    const newTimeouts = { ...prev };
                    delete newTimeouts[selectedVideo.id];
                    return newTimeouts;
                  });
                }
                setModalOpen(false);
                setSelectedVideo(null);
                setLoadingStates((prev) => ({
                  ...prev,
                  [selectedVideo.id]: false,
                }));
              }}
              aria-label='Close modal'
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        html,
        body {
          width: 100vw;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        .font-playfair {
          font-family: "Playfair Display", serif;
        }
        * {
          font-family: "Inter", sans-serif;
        }
        html {
          scroll-behavior: smooth;
        }

        /* Prevent body scroll when modal is open */
        body.modal-open {
          overflow: hidden;
        }

        /* Custom animations for wedding elements */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes gentle-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: gentle-spin 20s linear infinite;
        }

        /* Enhanced ring animation */
        @keyframes ring-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))
              drop-shadow(0 0 20px rgba(186, 230, 253, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))
              drop-shadow(0 0 30px rgba(186, 230, 253, 0.5));
          }
        }

        .ring-container {
          animation: ring-glow 3s ease-in-out infinite;
        }

        /* Additional romantic animations */
        @keyframes gentle-pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .animate-gentle-pulse {
          animation: gentle-pulse 4s ease-in-out infinite;
        }

        /* Enhanced scroll animations for image gallery */
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 23s linear infinite;
          will-change: transform;
        }

        .animate-scroll-right {
          animation: scroll-right 23s linear infinite;
          will-change: transform;
        }

        /* Smooth pause on hover with transition */
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
          transition: all 0.3s ease-in-out;
        }

        /* Enhanced image hover effects */
        .scroll-image-container {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }

        .scroll-image-container:hover {
          transform: scale(1.08) translateY(-4px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        /* Smooth image loading */
        .scroll-image {
          transition: opacity 0.3s ease-in-out;
          will-change: opacity;
        }

        .scroll-image.loading {
          opacity: 0;
        }

        .scroll-image.loaded {
          opacity: 1;
        }

        /* Performance optimizations */
        .scroll-container {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </>
  );
}
