import { gsap } from "https://unpkg.com/gsap@3.12.5/index.js"
import ScrollTrigger from "https://unpkg.com/gsap@3.12.5/ScrollTrigger.js"

gsap.registerPlugin(ScrollTrigger)

const mm = gsap.matchMedia()
const isMobile = window.innerWidth < 768

const fade = {
  opacity: 0,
  duration: .6
}

const slide = {
  translateY: 16,
  duration: .6
}

const revealOptions = (trigger) => {
  return {
    yPercent: 10,
    opacity: 0,
    scrollTrigger: {
      trigger: trigger,
      start: "50% bottom",
    },
  }
}

const numberIncrement = (element) => {
  const numberElement = element.querySelector(".number")
  if (!numberElement) return

  const raw = numberElement.textContent.trim()
  const prefix = raw.startsWith("+") ? "+" : ""
  const target = parseFloat(raw.replace(/[^0-9]/g, ""))
  const obj = { val: 0 }

  gsap.to(obj, {
    val: 1,
    duration: 1,
    ease: "expo.out",
    scrollTrigger: {
      trigger: element,
      start: "50% bottom",
    },
    onUpdate: function () {
      const current = Math.round(obj.val * target)
      const formatted = current.toLocaleString("fr-CH").replace(/\s/g, "'")
      numberElement.textContent = prefix + formatted
    }
  })
}

/* Header */
gsap.from("header", fade)

/* Heros */
const homeHero = document.querySelector('.hero-homepage')
const sectorHero = document.querySelector('.hero-sectors')

if (homeHero) {
  gsap.from(homeHero, { ...fade, ...slide })
}

if (sectorHero) {
  const content = sectorHero.querySelector('.hero-sectors-content')
  const image = sectorHero.querySelector('.hero-sectors-image')

  gsap.from(content, fade)
  gsap.from(image, { ...fade, ...slide })
}

/* Full screen image */
gsap.utils.toArray(".wp-block-eldora-full-screen-image").forEach((container) => {
  gsap.from(container, {
    "--after-opacity": 0,
    scrollTrigger: {
      trigger: container,
      start: "40% bottom",
      end: "90% bottom",
      scrub: true,
      onUpdate: (self) => {
        self.trigger.style.setProperty("--after-opacity", self.progress)
      }
    }
  })
})

/* Cards, accordions */
// 3+ columns layout
gsap.utils.toArray(".pole-card-container, .commitment-card-container").forEach((container) => {
  if (isMobile) {
    container.querySelectorAll(".pole-card, .commitment-card").forEach((card) => {
      gsap.from(card, {
        ...revealOptions(card)
      })
    })
  } else {
    gsap.from(container.querySelectorAll(".pole-card, .commitment-card"), {
      ...revealOptions(container),
      stagger: 0.075,
    })
  }
})

// Two columns layout
gsap.utils.toArray(".numbered-cards-container, .headings-description-card-container").forEach((container) => {
  container.querySelectorAll(".numbered-card:nth-child(odd), .headings-description-card:nth-child(odd)").forEach((card) => {
    gsap.from(card, {
      ...revealOptions(card)
    })
  })

  container.querySelectorAll(".numbered-card:nth-child(even), .headings-description-card:nth-child(even)").forEach((card) => {
    gsap.from(card, {
      ...revealOptions(card),
      delay: 0.075,
    })
  })
})

// One column layout
gsap.utils.toArray(".two-columns-column:has(> .accordion)").forEach((container) => {
  container.querySelectorAll(".accordion").forEach((card) => {
    gsap.from(card, {
      ...revealOptions(card)
    })
  })
})

/* Key numbers */
gsap.utils.toArray(".image-metrics-number-container").forEach((container) => {
  container.querySelectorAll('.image-metrics-number:nth-child(odd)').forEach((number) => {
    numberIncrement(number)

    gsap.from(number, {
    ...revealOptions(number),
      yPercent: -20,
      delay: 0.2
    })
  })

  container.querySelectorAll('.image-metrics-number:nth-child(even)').forEach((number) => {
    numberIncrement(number)

    gsap.from(number, {
    ...revealOptions(number),
      yPercent: -20,
    })
  })
})

/* Gallery images */
gsap.utils.toArray(".images-area.format-four-images").forEach((container) => {
  const scrollTrigger = {
    trigger: container,
    start: "top bottom",
    end: "150% bottom",
    scrub: true,
  }

  mm.add("(min-width: 640px)", () => {
    gsap.fromTo(container.querySelectorAll("picture:nth-child(odd)"),
      { y: -25 },
      { y: 50, scrollTrigger }
    )

    gsap.fromTo(container.querySelectorAll("picture:nth-child(even)"),
      { y: 25 },
      { y: -50, scrollTrigger }
    )
  })

  mm.add("(max-width: 639px)", () => {
    gsap.fromTo(container.querySelectorAll("picture:nth-child(odd)"),
      { y: -12.5 },
      { y: 25, scrollTrigger }
    )

    gsap.fromTo(container.querySelectorAll("picture:nth-child(even)"),
      { y: 12.5 },
      { y: -50, scrollTrigger }
    )
  })
})