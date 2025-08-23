import Link from "next/link";
import React from "react";
import Image from "next/image";
import Profile from "./profile.";

export default async function NavBar() {
  return (
    <div
      id="top"
      className="w-full flex text-blue-700 md:px-[20%]  md:justify-between items-start md:items-center justify-start  shadow-md flex-col md:flex-row"
    >
      {/* <Link href="/" className="logo text-xl text-gray-900 font-bold"></Link> */}
      <ul className="flex gap-6 w-full items-center font-semibold ">
        <li>
          <Link href="/" className="flex items-center">
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
              <span className=" text-gray-600 text-xs">
                Survey Instrument&apos;s
              </span>
            </div>
          </Link>
        </li>
      </ul>
      <ul className="flex w-full gap-6 ml-auto flex-wrap justify-center  lg:flex-nowrap md:justify-end items-center my-3 md:my-0  md:flex font-semibold pr-2">
        <li>
          <Link href="/#tentang">Tentang</Link>
        </li>
        <li>
          <Link href="/products">Produk</Link>
        </li>
        <li>
          <Link href="/#footer">Hubungi</Link>
        </li>
        <li>
          <Profile />
        </li>
      </ul>
      {/* <SearchResult /> */}
    </div>
  );
}
