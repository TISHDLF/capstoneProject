import React, { useEffect, useRef } from "react";

const CatCarousel = ({ catImages, selectedImage }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || catImages.length === 0) return;

    // ✅ Duplicate images to create a seamless infinite scroll effect
    const duplicatedImages = [...catImages, ...catImages];
    scrollContainer.innerHTML = ""; // clear existing content

    // Recreate all images manually
    duplicatedImages.forEach((img, index) => {
      const imgElement = document.createElement("img");
      imgElement.src = img.url;
      imgElement.alt = `Cat ${index}`;
      imgElement.className = `
        w-[140px] md:w-[160px] 
        h-[140px] md:h-[160px] 
        rounded-[10px] object-cover cursor-pointer 
        transform transition-transform duration-500 
        opacity-100 hover:scale-110 hover:border-2 border-transparent hover:border-[#DC8801]
      `;
      scrollContainer.appendChild(imgElement);
    });

    let scrollAmount = 0;
    let animationFrame;
    const scrollSpeed = 0.3;

    const scrollStep = () => {
      if (!scrollContainer) return;

      scrollAmount += scrollSpeed;

      // ✅ When half of duplicated content is scrolled, reset smoothly
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }

      scrollContainer.scrollLeft = scrollAmount;
      animationFrame = requestAnimationFrame(scrollStep);
    };

    animationFrame = requestAnimationFrame(scrollStep);

    // Pause on hover
    const pauseScroll = () => cancelAnimationFrame(animationFrame);
    const resumeScroll = () =>
      (animationFrame = requestAnimationFrame(scrollStep));

    scrollContainer.addEventListener("mouseenter", pauseScroll);
    scrollContainer.addEventListener("mouseleave", resumeScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollContainer.removeEventListener("mouseenter", pauseScroll);
      scrollContainer.removeEventListener("mouseleave", resumeScroll);
    };
  }, [catImages]);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full md:w-[1080px] rounded-br-4xl rounded-bl-4xl rounded-tl-4xl shadow-2xl hover:shadow-xl transition-shadow duration-300 p-5 bg-white">
        <div className="w-full overflow-hidden">
          {/* Hidden scrollbar + smooth scroll */}
          <div
            ref={scrollRef}
            className="scroll-container flex gap-5 no-scrollbar scroll-smooth"
            style={{
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CatCarousel;
