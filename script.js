'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// btnCloseModal.addEventListener('click', closeModal);
// overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////////////////////////
// Button see more (button scrooling)
btnScrollTo.addEventListener('click', function (e) {
  // e.defaultPrevented();
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});
// Page navegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. add event listener to common parent element
// 2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////
// tabbed compoment

// tabs.forEach(t =>
//   t.addEventListener('click', function (e) {
//     console.log('tab');
//   })
// );

// tabsContainer.addEventListener('click', function (e) {
//   const clicked = e.target.closest('.operations__tab');

//   //guard clause
//   if (!clicked) return;

//   //remove active classes
//   tabs.forEach(t => t.classList.remove('operations__tab--active'));
//   tabsContent.forEach(c => c.classList.remove('operations__content--active'));
//   // activate tab
//   clicked.classList.add('operations__tab--active');
//   // activate content area
//   document
//     .querySelector(`.operations__content--${clicked.dataset.tab}`)
//     .classList.add('operations__content--active');
// });
/////////////////////////////////////////////////////

// menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
/////////////////////////////////////////////////////
//sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
/////////////////////////////////////////////////////
//sticky navigation: intersection observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entr => {
//     console.log(entr);
//     // nav.classList.add('sticky');
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////////
//reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
/////////////////////////////////////////////////////
// Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');
// console.log(imgTarget);
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTarget.forEach(img => imgObserver.observe(img));
/////////////////////////////////////////////////////
//slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // const activeteDot = function (slide) {
  //   document
  //     .querySelectorAll('.dots__dot')
  //     .forEach(dot => dot.classList.remove('dots__dot--active'));
  //   document
  //     .querySelector(`.dots__dot[data-slide="${slide}"]`)
  //     .classList.add('dots__dot--active');
  //   // console.log(slide);
  // };

  let curSlider = 0;
  const maxSlider = slides.length - 1;
  // console.log(slides);
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlider === maxSlider) {
      curSlider = 0;
    } else {
      curSlider++;
    }
    goToSlide(curSlider);
    activeteDot(curSlider);
  };

  const prevSlide = function () {
    if (curSlider === 0) {
      curSlider = maxSlider;
    } else {
      curSlider--;
    }
    goToSlide(curSlider);
    activeteDot(curSlider);
  };
  // btnRight.addEventListener('click', nextSlide);
  // btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();

    e.key === 'ArrowLeft' && prevSlide();
  });
  const init = function () {
    createDots();
    goToSlide(0);
    activeteDot(0);
  };
  // init();
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('dot');
      const slide = e.target.dataset.slide;

      goToSlide(slide);
      activeteDot(slide);
    }
  });
};
// slider();

// menu responsivo
let show = true;
const menuSection = document.querySelector('.menu--section');
const menuToggle = document.querySelector('.menu--toggle');
const navItem = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  document.body.style.overflow = show ? 'hidden' : 'initial';
  menuSection.classList.toggle('on', show);
  show = !show;
});
navItem.addEventListener('click', function () {
  document.body.style.overflow = 'initial';
  menuSection.classList.remove('on');
  show = !show;
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
/////////////////////////////////////////////////////

//rbg(255,255,255)
// Elements point even place, children and father
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('link', e.target, e.currentTarget);
//   this.style.backgrounColor = randomColor;
//   //stop propagation
//   e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('cointainer', e.target, e.currentTarget);
//   this.style.backgrounColor = randomColor;
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   console.log('Nav', e.target, e.currentTarget);
//   this.style.backgrounColor = randomColor;
// });
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('addEventListener: Great!You are reading the heading :D');
//   // setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 2000);
// };
// h1.addEventListener('mouseenter', alertH1);
//
/////////////////////////////////////////////////////
// console.log(document.documentElement);
// const header = document.querySelector('.header');

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie"> Got it!</button>';
// header.after(message);
// // header.append(message);
// // header.append(message.cloneNode(true));
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     console.log('funcioona');
//   });
// message.style.backgroundColor = 'orange';
