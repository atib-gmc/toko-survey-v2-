import Image from "next/image";
import Link from "next/link";
import { products } from "./data/products";
import ProductCard from "./ui/productCard";
import { clientLogos } from "@/app/ui/clientLogo";
import Footer from "./components/footer/Footer";
import Testimonials from "./components/testimoni/testimonial";
import OurProduct from "./components/OurProduct";
import { ClientLogo } from "@/components/ui/ClientCard";

export default function HomePage() {
  return (
    <main className="bg-white text-left  text-blue-900">
      {/* Hero Section */}
      <section className="relative section-hero bg-[url('/hero-bg.jpg')] md:bg-cover bg-center   bg-fixed  text-white text-center min-h-[80%]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
        <div className="relative z-20 px-4 md:px-[20%] py-32 text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Solusi Terpercaya untuk Kebutuhan Instrumen pengukuran dan pemetaan
            konstruksi anda
          </h1>
          <div className="flex gap-2">
            <Link
              href={"/products"}
              className="bg-red-500 px-6 py-3 font-semibold rounded-lg shadow hover:bg-red-700 transition"
            >
              Lihat Produk
            </Link>
            <Link
              href="#footer"
              className="bg-blue-700 px-6 py-3 font-semibold rounded-lg shadow hover:bg-blue-800 transition"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
      {/* Tentang Kami Section */}
      <section
        id="tentang"
        className="section-about  md:px-[20%] md:gap-8  [&>*]:w-full  w-full flex gap-5 py-6 px-4 flex-col xl:flex-row  mx-auto text-left  md:flex"
      >
        <div className="logo flex items-center ">
          <Image
            src="/logo.png"
            alt="Logo Maxima"
            width={150}
            height={150}
            className="inline-block mr-2 "
          />
          <div className="name flex flex-col ">
            <span className="text-2xl font-bold italic text-red-500">
              Bintang Survey
            </span>
            <span className=" text-gray-600 text-xs">
              Survey Instrument&apos;s
            </span>
          </div>
        </div>
        <div className="row space-y-2">
          <h2 className="text-3xl font-bold mb-4 uppercase">Tentang Kami</h2>
          <p
            className="
           text-gray-700 text-justify "
          >
            <strong>Bintang Survey</strong> adalah supplier alat konstruksi yang
            fokus pada penyediaan alat survey tanah, GPS tracker, dan peralatan
            pendukung proyek. Kami Menyediakan Berbagai Macam Alat Survey Baru &
            Bekas Diantaranya :
          </p>
          <ol className="list-decimal list-inside pl-2">
            <li>Total Station</li>
            <li>Theodolite</li>
            <li>GPS Geodetik</li>
            <li>Automatic Level / Waterpass</li>
            <li>GPS Garmin Maps</li>
            <li>Sparepart / Aksesoris</li>
            <li>Jasa Kalibrasi & Service</li>
          </ol>
          <p>
            Dari Berbagai Merk dan Type Seperti : Ruide, Topcon, Sokkia, Leica,
            Nikon, Spectra, Hi Target, Alpha Geo, South, Foif Dll.
          </p>
        </div>
      </section>

      {/* Produk Section */}
      <OurProduct />
      {/* Testimonial Section */}
      <Testimonials />
      {/* Galeri Proyek Section */}
      <section className="section-galeri px-4 -space-y-6 py-16 bg-slate-800 w-full md:px-[20%]  mx-auto">
        <h2 className="text-3xl font-bold text-white text-left uppercase mb-10">
          Sudah Dipercaya Oleh Berbagai Client
        </h2>
        <p className="text-gray-300 text-justify">
          Kami telah dipercaya oleh berbagai klien dari berbagai sektor, seperti
          konstruksi, pertambangan, properti, dan infrastruktur. Kepercayaan ini
          terwujud melalui layanan profesional, akurasi tinggi, serta komitmen
          kami dalam memberikan hasil terbaik sesuai kebutuhan proyek.
        </p>
        <div className="flex pt-11 md:pt-8 text-white flex-wrap gap-2 p-4 mt-8">
          {/* Client Logos */}
          {/* Replace with your actual client logos */}
          {/* <ClientLogo logo={clientLogos} /> */}
          {clientLogos.map((logo, i) => (
            <Image
              key={i}
              src={`/${logo}`}
              alt="Client Logo"
              width={138}
              height={100}
              className="w-24 h-24 object-contain mx-auto my-4 invert brightness-0"
            />
          ))}
        </div>
      </section>
      {/* Kontak Section */}
      <Footer />
    </main>
  );
}
