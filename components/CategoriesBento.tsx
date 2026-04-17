"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategoriesBento() {
  return (
    <section className="py-12 px-6 md:px-12 bg-surface" id="categories">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="max-w-md">
            <h2 className="text-3xl font-headline font-semibold text-primary tracking-tighter mb-3 underline decoration-secondary/20 underline-offset-4">
              Curated Collections
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed opacity-80 font-body">
              Precision-engineered solutions for the discerning modern cultivator.
            </p>
          </div>
          <Link 
            href="/products" 
            className="text-primary font-bold font-headline border-b border-primary pb-0.5 hover:text-secondary hover:border-secondary transition-colors uppercase tracking-widest text-[9px]"
          >
            Browse All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[480px]">
          {/* Primary Feature: Heirloom Seeds */}
          <Link 
            href="/seeds"
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[1.5rem] bg-surface-container-lowest shadow-editorial"
          >
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_36tEg5S-uU1u8Tj5TiCuSB_o1L6rmYF40b3_dwUNIm6RsXobL62YUVsAQDvXmt8F4Uo7kJksU5_wY2_1LzqDQSWFDbq7VQMn83OKmYtp4AD5ss95251d1ofU8M4thMmjR2DV0X2PXxvhj11uozVOHWiiOTNCh5NJ-Fl0IKYujNSvIPZr3eEF812YNeT4xEWDdpSlu2F0nqE-L_fQ-v2_l1m-LOc3v3v2cGKTlAWf2t-BV6moA5qCkv_U0MFcLDk-tH7rTIZ7M6g"
              alt="Young green sprouts"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent"></div>
            <div className="absolute bottom-5 left-5 text-white">
              <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-secondary-fixed-dim/80 mb-1 block">Foundations</span>
              <h3 className="text-2xl font-headline font-bold">Heirloom Seeds</h3>
            </div>
          </Link>

          {/* Side Card: Bio-Fertilizers */}
          <Link 
            href="/products?category=fertilizers"
            className="md:col-span-2 relative group overflow-hidden rounded-[1.5rem] bg-surface-container-lowest shadow-editorial"
          >
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQP-EVHzq9cFT5Ju96gM2adRIBj1S7EGuM4rLJ7u-MHUg00n1P5b1GR19NUAypHLuCJXByQzWcEWO5XQMFkpg_540U1KHsNR0chpteP7mO2vaVoNgoZ2_2lf-U06fTnpQN2PKnzP0wmmk3te2a4WcW1W3HBnVRKs0SJmwrz5H8ndh6SimvkLIOzxY2zkX1dSsosAppaz-ZHFwjxJMZ6nYNRPtgySfi0lVZAn7FdHBJl0_rxB5kXQG9hH1L71wvFml2zlMnDDvGb5o"
              alt="Organic fertilizers"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-5 left-5 text-white">
              <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-secondary-fixed-dim/80 mb-1 block">Nourishment</span>
              <h3 className="text-xl font-headline font-bold">Bio-Fertilizers</h3>
            </div>
          </Link>

          {/* Small Card: Plant Health */}
          <Link 
            href="/products?category=pesticides"
            className="md:col-span-1 relative group overflow-hidden rounded-[1.5rem] bg-surface-container-lowest shadow-editorial min-h-[160px]"
          >
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwG2YUL2ptxK5h5D8Difcjqv-UutxjLuYTTx0g_CZ9MrtrO8OdsHGouU7SEm2o1vWuw3UmE_Zarc8RC3GqYm86iDyz_Sje9MAn39MObq8DjtK83wIvBfeV-Tah4wyy70Uz4x_WnoAz46Ewc4Rikv9BCLiAEDNUTAk4eJgf9JZmj39LePiU55JiIOWzV_Fh0HuPmF3l3yM49Xg0X99JYEf0zJQN8Ew1NnNz7ZqsMvoSQmo0WIaKQdaAklDjncJu8a_JBog6_gFNp0I"
              alt="Green leaf macro"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white pr-4">
              <h3 className="text-base font-headline font-bold">Plant Health</h3>
            </div>
          </Link>

          {/* Small Card: Agri-Tech */}
          <Link 
            href="/products?category=equipment"
            className="md:col-span-1 relative group overflow-hidden rounded-[1.5rem] bg-surface-container-lowest shadow-editorial min-h-[160px]"
          >
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCodbAPEzCKp4nula1mQXkjWGmmbiazekmHVZenW9rbkVJO5_Jk6PgvmzDyDV2bfq3iX_HQG4lhGVLgwxx4HHQj3fPhYJZv3359o1jBTuyn3Mg2bFf2uk9O2BISrpiyeeKS73BzESn-ThUnW8tJ1fIfdoScF8cYtHBcbrnKtzEcS-mY661_rJPn8kCeEmArpf3OFF5G3apcz6xSk3IlWt8GeMEaT_Gyi9KltiJRGUY7fUuLBxTt-t8j-d4_XQV_Md124CgmqN_ScGI"
              alt="Farm tech"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white pr-4">
              <h3 className="text-base font-headline font-bold">Agri-Tech</h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
