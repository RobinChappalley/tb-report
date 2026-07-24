import EmblaCarousel from "https://unpkg.com/embla-carousel@8.6.0/esm/embla-carousel.esm.js";
import AutoHeight from "https://unpkg.com/embla-carousel-auto-height@8.6.0/esm/embla-carousel-auto-height.esm.js";
import AutoScroll from "https://unpkg.com/embla-carousel-auto-scroll@8.6.0/esm/embla-carousel-auto-scroll.esm.js";

const emblaMobileSlider = () => {
  const emblaNodes = document.querySelectorAll(".embla-mobile-slider");

  if (!emblaNodes.length) return;

  const mobileOptions = { loop: false };
  const desktopOptions = { loop: true, dragFree: false, watchDrag: false };
  const desktopPlugins = [AutoScroll({ speed: .5, stopOnInteraction: false })];

  const emblaApis = new Map(); // Store API instances for each slider

  const initOrDestroySlider = (node) => {
    const api = emblaApis.get(node);

    if (window.innerWidth >= 640 && api) {
      api.destroy();
      emblaApis.delete(node);
      const newApi = EmblaCarousel(node, desktopOptions, desktopPlugins);
      emblaApis.set(node, newApi);
      return;
    }

    if (window.innerWidth >= 640 && !api) {
      const newApi = EmblaCarousel(node, desktopOptions, desktopPlugins);
      emblaApis.set(node, newApi);
      return;
    }

    if (window.innerWidth < 640 && api) {
      api.destroy();
      emblaApis.delete(node);
    }

    if (window.innerWidth < 640 && !emblaApis.get(node)) {
      const newApi = EmblaCarousel(node, mobileOptions);
      emblaApis.set(node, newApi);
    }
  };

  emblaNodes.forEach((node) => {
    if (window.innerWidth >= 640) {
      const api = EmblaCarousel(node, desktopOptions, desktopPlugins);
      emblaApis.set(node, api);
    } else {
      const api = EmblaCarousel(node, mobileOptions);
      emblaApis.set(node, api);
    }
});

  window.addEventListener("resize", () => {
    emblaNodes.forEach((node) => initOrDestroySlider(node));
  });
};

const emblaTestimonialsSlider = () => {
  const emblaNodes = document.querySelectorAll(".embla-testimonials-slider");

  if (!emblaNodes.length) return;

  const options = { loop: false, align: "start" };
  const emblaApis = new Map(); // Store API instances for each slider

  emblaNodes.forEach((node) => {
    const viewportNode = node.querySelector(".embla__viewport");
    const api = EmblaCarousel(viewportNode, options, [AutoHeight()]);
    emblaApis.set(node, api);

    const prevButtonNode = node.querySelector(".embla__prev");
    const nextButtonNode = node.querySelector(".embla__next");

    prevButtonNode.addEventListener("click", api.scrollPrev, false);
    nextButtonNode.addEventListener("click", api.scrollNext, false);
  });
};

export { emblaTestimonialsSlider, emblaMobileSlider };
