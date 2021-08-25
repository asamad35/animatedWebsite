let controller;
let slideScene;
let pageScene;
let body = document.querySelector("body");
let mouse = document.querySelector(".cursor");
let mouseText = mouse.querySelector("span");
let burger = document.querySelector(".burger");

function animateSlides() {
  //Init controller
  controller = new ScrollMagic.Controller();
  // Select some things
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  // loop over eacch slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP animation
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" }, "+=0.3");
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=1");

    //Create scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.3,
      reverse: false,
    })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "slide",
      // })
      .addTo(controller);
    // New animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    //create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      // .addIndicators({
      //   colorStart: "lightBlue",
      //   colorTrigger: "lightBlue",
      //   name: "page",
      //   indent: 200,
      // })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}
function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    mouseText.innerText = "Tap";
    gsap.to(".title-swipe", 1, { y: "0%" });
  } else {
    mouse.classList.remove("explore-active");
    mouseText.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: 45, y: 5, x: -15, background: "black" });
    gsap.to(".line2", 0.5, { rotate: -45, y: -5, x: -15, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".cursor", 1, { borderColor: "black" });
    gsap.to(".nav-bar", 1, { ClipPath: "circle(2500px at 100% -10%)" });
    gsap.to(body, { overflow: "hidden" });
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: 0, y: 0, x: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: 0, y: 0, x: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".cursor", 1, { borderColor: "white" });
    gsap.to(".nav-bar", 1, { ClipPath: "circle(50px at 100% -10%)" });
    gsap.to(body, { overflowY: "auto" });
  }
}
// barba transitions
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        detailAnimation();
        logo.href = "../index.html";
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //An animation
        console.log("hello");

        const tl = gsap.timeline({ default: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        window.scrollTo(0, 0);
        //An animation
        const tl = gsap.timeline({ default: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});
let detailScene;
function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    const nexText = nextSlide.querySelector(".fashion-text");

    //animation
    const pageTl = gsap.timeline();
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, 2, { opacity: 1 }, { opacity: 0 });
    pageTl.fromTo(nextSlide, 1, { y: "50%" }, { y: "0%" }, "-=1");
    pageTl.fromTo(nextImg, { x: "50%" }, { x: "0%" }, "+=1");
    pageTl.fromTo(nexText, { x: "-30%" }, { x: "0%" }, "-=0.5");
    //create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      // .addIndicators({
      //   colorStart: "lightBlue",
      //   colorTrigger: "lightBlue",
      //   name: "page",
      //   indent: 200,
      // })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);
