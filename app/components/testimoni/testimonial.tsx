import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Budi Santoso",
    review: "Beli kebutuhan konstruksi disini\nMurah,satset jadi gedung",
  },
  {
    name: "ari prasetyo",
    review:
      "Mantep sih website responsiv\ntampilannya simpe;tapi tetep enak dipandangnya",
  },
  {
    name: "Dewi Lestari",
    review:
      "Kayaknya bakal 999x order lagi sih disini\nsoalnya murah,ramah,dan cepat juga",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-16 bg-white text-white md:px-[20%] mx-auto">
      <h2 className="text-3xl uppercase text-start font-bold text-blue-900 mb-10 ">
        Ulasan Pelanggan
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-gray-700 rounded-2xl p-6 flex flex-col items-center text-center space-y-3 shadow-md"
          >
            {/* Stars */}
            <div className="flex space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            {/* Name */}
            <p className="font-semibold">{t.name}</p>

            {/* Review */}
            <p className="text-sm whitespace-pre-line">{t.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
