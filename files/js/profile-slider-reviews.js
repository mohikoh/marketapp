function initializeGallery(mainId, thumbsId, prevBtnId, nextBtnId) {
   const thumbsSwiper = new Swiper(`#${thumbsId}`, {
      slidesPerView: 6,
      spaceBetween: 3,
      freeMode: true,
      watchSlidesProgress: true,
      observer: true,
      observeParents: true,
      breakpoints: {
         0: {
            slidesPerView: 3,
            spaceBetween: 3
         },
         576: {
            slidesPerView: 5, spaceBetween: 5
         },
         992: {
            slidesPerView: 6, spaceBetween: 5
         }
      }
   });

   const mainSwiper = new Swiper(`#${mainId}`, {
      spaceBetween: 16,
      speed: 600,
      observer: true,
      observeParents: true,
      navigation: {
         prevEl: `#${prevBtnId}`,
         nextEl: `#${nextBtnId}`,
      },
      thumbs: {
         swiper: thumbsSwiper,
      },
   });
}