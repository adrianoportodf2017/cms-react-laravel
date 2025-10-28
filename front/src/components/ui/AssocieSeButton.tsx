import { useEffect, useState } from "react";

export default function AssocieSeButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <a
      href="/associe-se"
      className={`
        fixed top-1/3 right-0 -translate-y-1/2 z-50
        bg-[#ffcc00] text-black font-semibold px-5 py-3
        rounded-l-full shadow-lg
        transform transition-all duration-500 ease-in-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
       style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
      ASSOCIE-SE
    </a>
      <a
      href="/doar"
      className={`
        fixed top-1/2 right-0 -translate-y-1/2 z-50
        bg-[#ffcc00] text-black font-semibold px-5 py-3
        rounded-l-full shadow-lg
        transform transition-all duration-500 ease-in-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
       style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
DOE    </a></>
  );
}
