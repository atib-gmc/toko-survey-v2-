import Image from "next/image";

export default function Logo({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Logo Maxima"
        width={width || 70}
        height={height || 70}
        className="inline-block mr-2"
      />
      <div className="name flex flex-col ">
        <span className="text-lg font-bold italic text-red-500">
          Bintang Survey
        </span>
        <span className=" text-gray-600 text-xs">Survey Instrument&apos;s</span>
      </div>
    </div>
  );
}
