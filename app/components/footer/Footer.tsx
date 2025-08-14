import Logo from "@/app/ui/Logo";
import Image from "next/image";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="bg-blue-600 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between space-y-8 md:space-y-0">
        {/* Left: Menu + Socials */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-semibold">Beranda</p>
            <p className="font-semibold">Produk</p>
            <p className="font-semibold">Tentang</p>
          </div>

          <div className="space-x-4 flex items-center pt-2">
            <a href="#" className="hover:text-gray-300">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaWhatsapp size={20} />
            </a>
            <a
              href="mailto:someone@example.com"
              className="hover:text-gray-300"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        {/* Center: Address */}
        <div>
          <p className="font-semibold mb-2">Alamat</p>
          <p className="max-w-sm text-sm leading-relaxed">
            Jl. Palem I No.54, RT.8/RW.3,
            <br />
            Petukangan Utara, Kec. Pesanggrahan, Kota Jakarta Selatan,
            <br />
            Daerah Khusus Ibukota Jakarta 12260
          </p>
        </div>

        {/* Right: Newsletter */}
        <div className="space-y-3">
          <p className="font-semibold">Dapatkan informasi produk terbaru</p>
          <div className="flex items-center border rounded bg-white overflow-hidden max-w-md">
            <input
              type="email"
              placeholder="emailkamu@domain.com"
              className="px-4 py-2 text-black w-full focus:outline-none"
            />
            <button className="bg-gray-300 p-2 hover:bg-gray-400 transition">
              📩
            </button>
          </div>

          {/* Logo */}
          {/* <div className="pt-4">
            <img src="/bs-logo.png" alt="Bintang Survey" className="h-10" />
          </div> */}

          <div className={`flex items-center `}>
            <Image
              src="/logo.png"
              alt="Logo Maxima"
              width={70}
              height={70}
              className="inline-block mr-2"
            />
            <div className="name flex flex-col ">
              <span className="text-lg font-bold italic text-red-500">
                Bintang Survey
              </span>
              <span className=" text-gray-200 text-xs">
                Survey Instrument&apos;s
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
