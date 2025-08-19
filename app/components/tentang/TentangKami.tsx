import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import React from "react";

export default async function TentangKami() {
  const { data } = await supabase.from("products").select("*");
  return (
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
           text-justify "
        >
          Bintang Survey adalah supplier alat pengukuran yang fokus pada
          penyediaan alat surveying instrument, survey pemetaan tanah, GPSMap,
          peralatan konstruksi dan bangunan, peralatan pertambang, peralatan
          kehutanan, peralatan sipil, jasa service dan kalibrasi serta peralatan
          pendukung proyek lainnya:
        </p>
        <ol className="list-decimal list-inside pl-2">
          {data &&
            data.slice(0, 5).map((item) => (
              <li key={item.id} className="hover:underline">
                <a href={`/products/${item.id}`}>{item.name}</a>
              </li>
            ))}
          {/* <li>Total Station</li>
          <li>Digital Theodolite</li>
          <li>GPS Geodetik</li>
          <li>Automatic Level</li>
          <li>Digital Level</li>
          <li>GPS Garmin</li>
          <li>Alat Sipil</li>
          <li>Drone / Lidar</li>
          <li>Sparepart / Aksesoris</li>
          <li>Jasa Kalibrasi & Service</li> */}
        </ol>
        <p>
          Dari Berbagai Merk dan Type Seperti : Ruide, Topcon, Sokkia, Efix,
          CHCNAV, Leica, Nikon, Spectra, Hi Target, Trimble, Alpha Geo, South,
          Foif Dll.
        </p>
      </div>
    </section>
  );
}
