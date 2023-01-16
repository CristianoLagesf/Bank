'use strict';

// const { header } = require("express/lib/response");

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
const header = document.querySelector('.header');
const imgTarget = document.querySelectorAll('img[data-src]')







btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect()
  console.log(s1coords)

  // method 1 (old method)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })

  // method 2 ( only works in modern browsers)
  section1.scrollIntoView({ behavior: 'smooth' })
})



//=============================== Scroll nav-bar

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     const sec = document
//       .querySelector(id)
//       .scrollIntoView({ behavior: 'smooth' })
//   })
// })


document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault()
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id)
      .scrollIntoView({ behavior: 'smooth' })
  }
})


// =============================== Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')
  const data = e.target.getAttribute('data-tab')

  if (!clicked) return

  tabs.forEach(t =>
    t.classList.remove('operations__tab--active'))
  tabsContent.forEach(c =>
    c.classList.remove('operations__content--active'))

  clicked.classList.add('operations__tab--active')



  document.querySelector(`.operations__content--${data}`)
    .classList.add('operations__content--active')
})


// =================================================================================================
const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}


nav.addEventListener('mouseover', handleHover.bind(0.5))

nav.addEventListener('mouseout', handleHover.bind(1))

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect()

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky')
//   else nav.classList.remove('sticky')
// })

// Sticky navigation using  Intersection Observe API
const navHeight = nav.getBoundingClientRect().height

const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) nav.classList.add('sticky')
    else nav.classList.remove('sticky')
  })
}

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}

const observer = new IntersectionObserver(obsCallBack, obsOptions)
observer.observe(header)


// Reveal sections
const allSections = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)

}

const sectionObserver = new IntersectionObserver
  (revealSection, {
    root: null,
    threshold: 0.15,
  })
allSections.forEach(function (section) {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})


// lazy loading images

console.log(imgTarget)

const loadImg = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver
  (loadImg,
    {
      root: null,
      threshold: 0,
      rootMargin: '-200px'

    })
imgTarget.forEach(img => imgObserver.observe(img))


// Slider
const slides = document.querySelectorAll('.slide')
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots')


let curSlide = 0
const maxSlide = slides.length

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  })
}

createDots()

const activeDot = function (slide) {
  document.querySelectorAll('.dots__dot')
    .forEach(dots => dots.classList.remove('dots__dot--active'))

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active')
}
activeDot(0)

const goToSlide = function (slide) {
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`))

}
goToSlide(0)

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0
  } else { curSlide++ }
  goToSlide(curSlide)
  activeDot(curSlide)
}

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1
  } else { curSlide-- }
  goToSlide(curSlide)
  activeDot(curSlide)
}


btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide()
  e.key === 'ArrowRight' && nextSlide()
})

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset
    goToSlide(slide)
    activeDot(slide)
  }
})


// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min)

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`

// const h1 = document.querySelector('.highlight')

// h1.addEventListener('click', function () {
//   h1.style.backgroundColor = randomColor()
//   h1.style.color = randomColor()

// })




// console.log(document.querySelector('.header__title'))
// console.log(document.getElementById('section--1'))

// // creating and inserting elements
// const message = document.createElement('div')
// message.classList.add('cookie-message')

// message.innerHTML =
//   'We use cookied for improved func and analytics. <button class ="btn btn--close-cookie">got it</button>';

// header.prepend(message)
// header.append(message)

// const title = document.querySelector('.highlight')

// title.style.backgroundColor = 'blue'

// console.log(getComputedStyle(title).color)

// document.documentElement.style.setProperty('--color-primary', 'orangered')
// const logo = document.querySelector('.nav__logo')
// console.log(logo.alt)
// console.log(logo.src)