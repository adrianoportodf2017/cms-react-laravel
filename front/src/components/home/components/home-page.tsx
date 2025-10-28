import { Slides } from "./slide";
import { Numeros } from "./numeros";
export default function HomePage() {
    return (
        <>
            <Slides />
            <Numeros />

            {/* blog */}
            <section className="relative overflow-hidden bg-[#ffcc00] text-white ">
                {/* Fundo: colinas longas porém numerosas */}
                <svg
                    className="pointer-events-none absolute -top-10 left-0 h-40 w-[240%] md:h-56"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        className="fill-gray-50"
                        d="
        M0,84
        Q60,54 120,84  T240,84  T360,84  T480,84
        T600,84  T720,84  T840,84  T960,84  T1080,84 T1200,84
        V0 H0 Z"
                    />
                </svg>

                {/* Conteúdo */}
                <div className="container mx-auto px-4 mt-20 mb-20">
                    <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-16 text-center">
                        <h2 className="text-3xl font-bold md:text-5xl text-gray-900">Notícias</h2>
                    </div>

                    {/* Grid de posts */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Post 1 */}
                        <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                            <img
                                src="/post1.png"
                                alt="Post 1"
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6 text-left">
                                <p className="text-sm text-[#ffcc00] flex items-center gap-2">
                                    <span>📅</span> 19/08/2025
                                </p>
                                <h3 className="mt-2 text-lg font-bold text-gray-900">
                                    Doe com Pix Recorrente e transforme vidas com a COOPERFORTE
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Uma iniciativa simples e transformadora para apoiar a causa todos os meses.
                                </p>
                                <a
                                    href="#"
                                    className="mt-4 inline-block text-[#ffcc00] font-semibold hover:underline"
                                >
                                    Ler mais →
                                </a>
                            </div>
                        </div>

                        {/* Post 2 */}
                        <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                            <img
                                src="/post2.jpg"
                                alt="Post 2"
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6 text-left">
                                <p className="text-sm text-[#ffcc00] flex items-center gap-2">
                                    <span>📅</span> 16/05/2025
                                </p>
                                <h3 className="mt-2 text-lg font-bold text-gray-900">
                                    Instituto COOPERFORTE
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Assembleia Geral 2025
                                </p>
                                <a
                                    href="#"
                                    className="mt-4 inline-block text-[#ffcc00] font-semibold hover:underline"
                                >
                                    Ler mais →
                                </a>
                            </div>
                        </div>

                        {/* Post 3 */}
                        <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                            <img
                                src="/post3.png"
                                alt="Post 3"
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6 text-left">
                                <p className="text-sm text-[#ffcc00] flex items-center gap-2">
                                    <span>📅</span> 17/02/2025
                                </p>
                                <h3 className="mt-2 text-lg font-bold text-gray-900">
                                    Campanha Planeta Esperança chega na COOPERFORTE
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Um filme emocionante que mostra como pequenos gestos mudam histórias.
                                </p>
                                <a
                                    href="#"
                                    className="mt-4 inline-block text-[#ffcc00] font-semibold hover:underline"
                                >
                                    Ler mais →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}