import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Heritage | Sri Basaveshwara Agro Kendra",
  description: "Understanding fifteen years of agricultural dedication. Our legacy of biological precision and farmer-first expertise.",
};

export default function AboutPage() {
  return (
    <main className="bg-surface font-body text-on-surface antialiased">
      {/* Hero Section: Immersive Storytelling */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDSUvMwVjO1lGSGTQK2e0-PbDM4hawKu95vgpUuqRNWmTQTXixH3fmBNy-GFZY6nVU8jhCvWLNt8prKuZmmQbwTcpAS5ke5jksK5n84uXo_yCRuRNKeaT49aI9rkqib4Up9co2-8rEtOnhIU9CDGcUjHXojA7OSaQsOWhE04LjfTaE4GpCJi038NDrjrTNge4B7SOj2IYqo1bxQCOL7S7cqErDfK_PpzLENLgPHlzhlrm06NtHY7mbGACp0_0J6Q29JuaTR7DOtJg"
            alt="Aerial drone shot of lush green terraced agricultural fields"
            fill
            className="object-cover grayscale-[20%] brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-6 bg-secondary-container text-on-secondary-fixed font-bold text-[10px] uppercase tracking-widest rounded-full">Established 2009</span>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white mb-6 leading-[1.0]">
              Roots That Run <br/> Deep.
            </h1>
            <p className="text-lg lg:text-xl text-stone-200 leading-relaxed max-w-lg font-medium opacity-90">
              Fifteen years of redefining the intersection of traditional wisdom and modern agrarian technology.
            </p>
          </div>
        </div>
        
        {/* Floating Quote Card */}
        <div className="absolute bottom-8 right-8 z-10 hidden lg:block">
          <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-xl border border-white/15 max-w-[280px]">
            <p className="text-white text-sm font-medium italic leading-relaxed opacity-90">&quot;The land doesn&apos;t just grow crops; it nurtures legacies. We are the stewards of that cycle.&quot;</p>
          </div>
        </div>
      </section>

      {/* Our Heritage: Asymmetric Layout */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl z-10 scale-100">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMQa9EsjD2FcPCiAW3VGf7wV3EROgPG3WT8aQGC8g42rWbn3WW1uL_RHQv-jGlRRCLReUFM5Ofu7MUm8pzT98WcjeUfaOD6HE2lnZdc_tOpL7IHhWUTebkKphqm6Q77Iin6rkL0PM4dawa6_fwhs3-k4JRzd8OVk-D8SpBLUfQOxWdCa7_vgx3_fXLH1faNzwY41kfHhksITnQHmTG0uqGdnzB2cXkaBnrH1IAmO5xKAGzDECDnOQG0mjdVvWHESeaSAc7_ORyqts"
                alt="Our Heritage image"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-surface-container-low -z-10 rounded-xl"></div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-primary mb-8">Our Heritage</h2>
            <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg">
              <p>Founded in the heart of the agrarian belt, Basaveshwara Agro began as a collective of soil scientists and multi-generational farmers. We believed that the future of the harvest lay not in industrial force, but in biological precision.</p>
              <p>For over 15 years, we have documented, tested, and refined the practices that sustain the earth. Our history is written in the soil, measured by the vitality of the crops and the prosperity of the hands that tend them.</p>
            </div>
            <div className="mt-12 flex gap-12">
              <div>
                <div className="text-4xl font-bold text-primary tracking-tighter">15+</div>
                <div className="text-sm font-semibold text-stone-500 uppercase tracking-widest mt-2">Years of Trust</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary tracking-tighter">450k</div>
                <div className="text-sm font-semibold text-stone-500 uppercase tracking-widest mt-2">Acres Optimized</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Modern Agrarian Mission: Bento Grid */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-6">The Modern Agrarian Mission</h2>
              <p className="text-on-surface-variant text-lg">We bridge the gap between archaic methods and future-proofed technology, ensuring every seed reaches its peak potential.</p>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-4xl text-primary/20 select-none">eco</span>
              <span className="material-symbols-outlined text-4xl text-primary/20 select-none">precision_manufacturing</span>
              <span className="material-symbols-outlined text-4xl text-primary select-none">water_drop</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest p-10 rounded-xl hover:scale-[1.02] transition-all duration-500 group">
              <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-lg mb-8 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-on-primary-fixed-variant group-hover:text-on-primary" data-icon="science">science</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tighter text-primary mb-4">Precision Chemistry</h3>
              <p className="text-on-surface-variant leading-relaxed">Our fertilizers and pesticides are formulated for specific micro-climates, reducing waste by 40%.</p>
            </div>

            {/* Card 2 (Large) */}
            <div className="md:col-span-2 relative overflow-hidden rounded-xl group min-h-[400px]">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjJ9zUMt8feJ7ixNPnkQdHynS6vaLVzzda7oEJFCufUAY6Pdpaycx2yw_zfgXFgGXXIAsWS3GBLr2AUfzrp9rvEX4qLI97RDGNVUu9ivnifr_0mCdl_nMHL5AIMTicpdk94UDL6uJjY2OIsr_BLKWcdFZwqoy1RtmbV_v05Q1EEzgvLYBnPBBcVuOcCuJkB5OGYsm85YFBSJ1LftDY_2Ihqyrg-WYSZIgaR02DWJinkloqJ73zl1On2WbfOK57K4iLR_ac57oY57I"
                alt="Modern tractor"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
              <div className="absolute bottom-0 p-10">
                <h3 className="text-3xl font-bold tracking-tighter text-white mb-4">The Equipment Revolution</h3>
                <p className="text-white/80 max-w-md leading-relaxed">From autonomous seeders to AI-driven harvesters, we provide the tools that define the next generation of farming efficiency.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="md:col-span-2 bg-primary text-white p-10 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold tracking-tighter mb-6">Regenerative Focus</h3>
                <p className="text-white/80 text-lg leading-relaxed max-w-xl">We don&apos;t just take from the earth; we replenish it. Our heritage links us to a future where agriculture is a net-positive force for the environment.</p>
              </div>
              <div className="mt-8">
                <Link href="#" className="inline-flex items-center gap-2 font-bold tracking-tight group">
                  Learn about Soil Science
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-highest p-10 rounded-xl">
              <h3 className="text-2xl font-bold tracking-tighter text-primary mb-4">Expertise Network</h3>
              <p className="text-on-surface-variant leading-relaxed mb-6">Access a global network of agronomists and heritage farmers dedicated to your success.</p>
              <div className="flex -space-x-3">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Tf2rMNZPlsVJhQ4uRAOEbnxbBnZqtIZTYjSkBp0Pt5dNfLHp_TgGCbIMo0LZsrAC32gyociK7W-aoqRCPnvnHdjdbZHezInuDGZdHT6vYsBWs2yORfaKUrFUja0Y0Iq_qewjAOUTGTylYQ3RTK1SQAHDRQ5npQKl6JoZk5MdwNNv3RMKyQQO4OYZQoj-tTEhTxnw2yqy5nwInBdU7H3dTvwgWclY9S0IlrYWa6uds6RHadXWoEXhv8yyl91f91ZA-w3fp6IQGGw",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDe3sWMuY4lLQQvsY9qEg23BRrn2jbQQEXobCtB59Hy4kjYkuFuBOrXG24b6Z2kdfgAHL91T1Piwtq1ZICEQmzLjzFepvKxIvvRat--nLkEXwICVqcX7ttumhyZtGcyI7vhwff0_sgIAIQYfHEN6kThvU5W24fdP74SjefJVH6QezfFSC3baYGM-pbS9oKH094kCgK8Qrug_YTukFIZrcUgTQzqFKURhMGxA-QRxoZ24JQOQK3o7mKcnk_X5OyfbRosUh_z9zigJWM",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC_Nlf6NAvgy6JaAo-nlyjmOS5N09QD3_uGaVKg-PCFLhU5TfbeEPIGflmuDVue18YkgTM-EEJ6-_UtjzT1ERCl8q9IDvRQsSEez-Hvpb5HSHW4Wh8vwB4DZ2xnpd_psRTTetkzkYNQc_JOZ9jkKx72UQVQaVu9UoLmvNPV-d4XFqloL7K9p4xbV9JsmZd6evLTztT8IA9VdQPETh723n3GSp4596rmsXXns0wrxVA3Z2AxWq71Q-7RAO5Ki6etJOgGa5VbNUmYfZw"
                ].map((src, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-surface overflow-hidden relative">
                    <Image src={src} fill alt="Expert" className="object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-surface">+12</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section with Overlap */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="bg-surface-container-low p-12 lg:p-24 rounded-xl flex flex-col lg:flex-row gap-16 relative">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-primary mb-8 leading-tight">Grounded in Science. <br/> Powered by Nature.</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">Every product in our catalog undergoes rigorous field testing in three different soil conditions before it reaches our partners. This commitment to data is what separates Basaveshwara Agro from the rest.</p>
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold tracking-tight hover:scale-[1.02] transition-transform active:scale-95">Download Our Soil Report</button>
            </div>
            <div className="lg:w-1/2 lg:-mt-32 lg:-mb-32 relative hidden lg:block overflow-hidden rounded-xl shadow-2xl">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRwuKzQLtkZ9s5qknZn9QKq-1pYvZRzc_eIjdyBtaxDdHmabeAjGjTx6Q9T5hlQnRcU1agIhaarOWGkH51s4lStnnEyRxNIAf9yk9ff579A62a8-xO9JposcwPGxsxUvo7uG2UdxTgaj6uW_UmIqqZdEQyx_DgaH6nMIcSKl15GpjE_kk1OgFY6cNEQxwv8Djd1XRdcFl93FwQ5Lsbb9PpDpiiYG92hiPf7NXg_HKteII8FGfcxJqMZtca5WQ73uA31vQRTZIQSMo"
                alt="Plant science"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Visuals */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA9KxgxeBzEMBoSvtgQLQGNe3x8sR9vslR1xxjffSDUI3oXczKfK4VW6hSGYdKWfbjo-qA-T9Zn8hwntIOeCCJmHzmM1fw7rQBQAeiFrcAGcxWHylkNSUn50wHpPd77jiN4bRxjwJ1auuHs7c37cYoJFUCdIM2N9VNb8ZRLkELLX79fNq3oyhsIFKXew6BaovKZnsSMmjb1J4zs6K9-tti2AiTmx5klWT_JZ1R0bgJMpF4TWz_qJuu0pKw6Q-OJaecEirP73PDEMJA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAR_WmkHNjh2rGX668ybdNXUXdsbJ8TGmssIc4C87w8jT-KHaAVYSFvMbXIm0-SZJnB6YbuXBJgxTtics4HMPxxfsM-r5PnsqAd-LopsAF8poRdsBoxdcbTCbud2ebC2l2AfgGxlf9Hecb0ucJwv7b5vt-BgnZTAEJTkBgmyM8SsJn0QYTS4ndz4pk6h8A3_L7EgyQQAQFYiJga2l036eM2AOG3UJcrhPgiBxWx5tmgpF_22F1muYASN9mXbERhBPHhKtqzQWoKA4U",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDb-5gkSx8rQYASA2M2peIb0cnbM0ql0wXnedTLBbswsxnsaroKNIt10TCKJ2Rw8sw-Xt_Sa0bAkKrFs9fTbvPMdIhvxTdirZ9PTZDcmwb_K7LeTo0L38lDTnBhJZveCMBAHnyuuQUwyHdYsVZEfyeaxgzo9PxCvZdPV1023ob978IOl1yoYNkXS-xslQe4F-ChHLrh7MP7dLna77i_TDHxVWTb02KUpi75dv07iOB1d4o993aOSxptY-59tBia-G38KTYEiALNAuA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuC27smQCCgJFLaj5UsrJIrflLHHC6piSmR_PkoMHtc6eGapiDhkYomK6ZoQHPjepYRtpi1f6ozHFZUlA1z22or6ZQPaNSO8ANu2E16314AKLpWCra0P2FIOx22Ywk2d2zqAIoZNx_z8C8pOa5oh7ukTuozvA5j0UHdUI1Q1iQc4oKiNwuTOjTgXAh90ZVAAKwCbipOkUuqmSPnv0rPuPJ8zZI-8tHuhm50bDZyzEL6QK62CLYbLjlL8ewhTFYwvNsv1An6yiduZBZQ"
            ].map((src, i) => (
              <div key={i} className={`relative h-64 overflow-hidden rounded-lg group ${i % 2 === 1 ? 'translate-y-8' : ''}`}>
                <Image 
                  src={src}
                  alt="Gallery image"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
