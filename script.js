/* =========================================================
   PORTFOLIO JAVASCRIPT
   Semua fitur dipisahkan agar tidak saling bentrok.
========================================================= */


/* =========================================================
   1. LOADING SCREEN
   Class khusus: .site-loaded
   JANGAN gunakan .reveal di sini.
========================================================= */

(function initLoader() {

  const screen =
    document.getElementById("loading-screen");

  const fill =
    document.getElementById("track-fill");

  const runner =
    document.getElementById("runner");

  const percent =
    document.getElementById("loading-percent");

  const mainSite =
    document.getElementById("main-site");

  let progress = 0;

  const duration = 2200;

  const start =
    performance.now();


  /* Lock scroll */

  document.body.style.overflow = "hidden";


  function tick(now) {

    const elapsed =
      now - start;


    progress =
      Math.min(
        100,
        (elapsed / duration) * 100
      );


    /* Progress bar */

    if (fill) {
      fill.style.width =
        progress + "%";
    }


    /* Runner */

    if (runner) {
      runner.style.left =
        progress + "%";
    }


    /* Percentage */

    if (percent) {
      percent.textContent =
        Math.floor(progress) + "%";
    }


    /* Continue */

    if (progress < 100) {

      requestAnimationFrame(tick);

      return;
    }


    /* Finished */

    setTimeout(() => {

      if (screen) {

        screen.classList.add(
          "hide"
        );

      }


      /*
        PENTING:
        BUKA WEBSITE MENGGUNAKAN
        .site-loaded
      */

      if (mainSite) {

        mainSite.classList.add(
          "site-loaded"
        );

      }


      /* Unlock scroll */

      document.body.style.overflow = "";

    }, 250);

  }


  requestAnimationFrame(tick);

})();



/* =========================================================
   2. NAVBAR SCROLL MORPHING
========================================================= */

(function initNavbar() {

  const navbar =
    document.getElementById("navbar");

  if (!navbar) return;


  let isScrolled = false;


  function handleScroll() {

    const shouldScroll =
      window.scrollY > 40;


    if (
      shouldScroll &&
      !isScrolled
    ) {

      navbar.classList.add(
        "scrolled"
      );

      isScrolled = true;

    }


    else if (
      !shouldScroll &&
      isScrolled
    ) {

      navbar.classList.remove(
        "scrolled"
      );

      isScrolled = false;

    }

  }


  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );


  /* Check posisi awal */

  handleScroll();

})();



/* =========================================================
   3. MOBILE NAVIGATION
========================================================= */

(function initMobileNav() {

  const toggle =
    document.querySelector(
      ".nav-toggle"
    );

  const links =
    document.querySelector(
      ".nav-links"
    );


  if (!toggle || !links) return;


  toggle.addEventListener(
    "click",
    () => {

      toggle.classList.toggle(
        "open"
      );

      links.classList.toggle(
        "open"
      );

    }
  );


  /* Tutup menu ketika klik link */

  links
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          toggle.classList.remove(
            "open"
          );

          links.classList.remove(
            "open"
          );

        }
      );

    });

})();



/* =========================================================
   4. REVEAL ON SCROLL
   KHUSUS SECTION/ELEMENT
========================================================= */

(function initReveal() {

  const revealEls =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    !revealEls.length
  ) return;


  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) return;


            entry.target.classList.add(
              "in-view"
            );


            revealObserver.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.15
      }
    );


  revealEls.forEach(
    element => {

      revealObserver.observe(
        element
      );

    }
  );

})();



/* =========================================================
   5. SKILL PROGRESS BAR
========================================================= */

(function initSkillBars() {

  const skillCards =
    document.querySelectorAll(
      ".skill-card"
    );


  if (
    !skillCards.length
  ) return;


  const skillObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) return;


            const card =
              entry.target;


            const fill =
              card.querySelector(
                ".skill-bar-fill"
              );


            if (!fill) return;


            const percent =
              card.dataset.percent;


            if (
              percent !== undefined
            ) {

              fill.style.width =
                percent + "%";

            }


            skillObserver.unobserve(
              card
            );

          }
        );

      },
      {
        threshold: 0.4
      }
    );


  skillCards.forEach(
    card => {

      skillObserver.observe(
        card
      );

    }
  );

})();



/* =========================================================
   6. STATISTICS COUNTER
========================================================= */

(function initCounters() {

  const statNums =
    document.querySelectorAll(
      ".num[data-count]"
    );


  if (
    !statNums.length
  ) return;


  const statObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) return;


            const element =
              entry.target;


            const target =
              parseInt(
                element.dataset.count,
                10
              );


            if (
              Number.isNaN(target)
            ) return;


            let current = 0;

            const duration = 1200;

            const stepTime =
              Math.max(
                Math.floor(
                  duration / target
                ),
                20
              );


            const timer =
              setInterval(
                () => {

                  current++;


                  /*
                    Hanya update text node pertama.
                    Elemen + tetap aman.
                  */

                  if (
                    element.firstChild
                  ) {

                    element.firstChild.textContent =
                      current;

                  }


                  if (
                    current >= target
                  ) {

                    clearInterval(
                      timer
                    );


                    if (
                      element.firstChild
                    ) {

                      element.firstChild.textContent =
                        target;

                    }

                  }

                },
                stepTime
              );


            statObserver.unobserve(
              element
            );

          }
        );

      },
      {
        threshold: 0.6
      }
    );


  statNums.forEach(
    element => {

      statObserver.observe(
        element
      );

    }
  );

})();



/* =========================================================
   PROJECT SYSTEM
   FILTER + CLICK + MODAL + SLIDER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


/* =====================================================
   ELEMENTS
===================================================== */

const projectCards =
    document.querySelectorAll(".project-card");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const modal =
    document.getElementById("projectModal");

const modalBackdrop =
    document.getElementById("projectModalBackdrop");

const modalClose =
    document.getElementById("projectModalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalCategory =
    document.getElementById("modalCategory");

const modalLive =
    document.getElementById("modalLive");

const modalDescription =
    document.getElementById("modalDescription");

const modalTech =
    document.getElementById("modalTech");

const modalImage =
    document.getElementById("modalImage");

const modalCounter =
    document.getElementById("modalCounter");

const modalPrev =
    document.getElementById("modalPrev");

const modalNext =
    document.getElementById("modalNext");

const imageScroll =
    document.querySelector(".modal-image-scroll");

const scrollNotice =
    document.getElementById("scrollNotice");


/* =====================================================
   SLIDER
===================================================== */

let currentImages = [];

let currentImageIndex = 0;

let currentProject = null;


    /* =====================================================
       FILTER
    ===================================================== */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter =
                button.getAttribute("data-filter");


            /* ACTIVE BUTTON */

            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            button.classList.add("active");


            /* FILTER PROJECT */

            projectCards.forEach(function (card) {

                const category =
                    card.getAttribute("data-category");


                if (
                    filter === "all" ||
                    category === filter
                ) {

                    card.classList.remove("hide");

                } else {

                    card.classList.add("hide");

                }

            });

        });

    });



    /* =====================================================
       TITLE FORMAT
    ===================================================== */

    function formatTitle(title) {

        const words =
            title.trim().split(/\s+/);


        if (words.length === 1) {

            return `<span>${words[0]}</span>`;

        }


        const lastWord =
            words.pop();

        const firstWords =
            words.join(" ");


        return `
            ${firstWords}
            <span>${lastWord}</span>
        `;

    }



    /* =====================================================
       OPEN MODAL
    ===================================================== */

function openProject(card) {

    if (!card || !modal) {
        return;
    }

    /* =================================================
       SCROLL NOTICE
    ================================================= */

    const noScrollNotice =
        card.getAttribute("data-no-scroll-notice") === "true";


    if (noScrollNotice) {

        const notice =
            document.getElementById("scrollNotice");

        if (notice) {

            notice.classList.add(
                "is-hidden"
            );

        }

    } else {

        const notice =
            document.getElementById("scrollNotice");

        if (notice) {

            notice.classList.remove(
                "is-hidden"
            );

        }

    }



        /* =================================================
           GET DATA
        ================================================= */

        const title =
            card.getAttribute("data-title") || "";

        const category =
            card.getAttribute("data-category-name") || "";

        const live =
            card.getAttribute("data-live") || "";

        const description =
            card.getAttribute("data-description") || "";

        const tech =
            card.getAttribute("data-tech") || "";

        const images =
            card.getAttribute("data-images") || "";


            
        /* =================================================
           TITLE
        ================================================= */

        modalTitle.innerHTML =
            formatTitle(title);


        /* =================================================
           CATEGORY
        ================================================= */

        modalCategory.textContent =
            category;


/* =================================================
   LIVE
================================================= */

if (live.trim() !== "") {

    modalLive.textContent =
        "◉ LIVE";

    modalLive.href =
        live;

    modalLive.style.display =
        "inline-flex";

} else {

    modalLive.textContent =
        "";

    modalLive.href =
        "#";

    modalLive.style.display =
        "none";

}


        /* =================================================
           DESCRIPTION
        ================================================= */

        modalDescription.textContent =
            description;


        /* =================================================
           TECH
        ================================================= */

        modalTech.innerHTML =
            "";


        tech
            .split("|")
            .map(function (item) {
                return item.trim();
            })
            .filter(function (item) {
                return item !== "";
            })
            .forEach(function (item) {

                const span =
                    document.createElement("span");

                span.textContent =
                    item;

                modalTech.appendChild(
                    span
                );

            });


        /* =================================================
           IMAGES
        ================================================= */

        currentImages =
            images
                .split("|")
                .map(function (image) {
                    return image.trim();
                })
                .filter(function (image) {
                    return image !== "";
                });


        /*
           Kalau data-images kosong,
           ambil gambar utama dari card.
        */

        if (
            currentImages.length === 0
        ) {

            const mainImage =
                card.querySelector(
                    ".project-thumb img"
                );


            if (mainImage) {

                currentImages = [
                    mainImage.getAttribute("src")
                ];

            }

        }


        currentImageIndex =
            0;


        /* UPDATE */

        updateModalImage();


        /* =================================================
           OPEN
        ================================================= */

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );


        /* RESET SCROLL */

        if (imageScroll) {

            imageScroll.scrollTop =
                0;

        }

    }



    /* =====================================================
       UPDATE IMAGE
    ===================================================== */

    function updateModalImage() {

        if (
            currentImages.length === 0
        ) {
            return;
        }


        /* FADE */

        modalImage.style.opacity =
            "0";


        setTimeout(function () {

            modalImage.src =
                currentImages[
                    currentImageIndex
                ];


            modalImage.onload =
                function () {

                    modalImage.style.opacity =
                        "1";

                };


            /*
               Kalau image gagal load,
               tetap tampilkan.
            */

            modalImage.onerror =
                function () {

                    modalImage.style.opacity =
                        "1";

                };


        }, 80);


        /* =================================================
           COUNTER
        ================================================= */

        modalCounter.textContent =
            `${currentImageIndex + 1} / ${currentImages.length}`;


        /* =================================================
           RESET SCROLL
        ================================================= */

        if (imageScroll) {

            imageScroll.scrollTop =
                0;

        }


        /* =================================================
           ARROW
        ================================================= */

        if (
            currentImages.length <= 1
        ) {

            modalPrev.style.display =
                "none";

            modalNext.style.display =
                "none";

            modalCounter.style.display =
                "none";

        } else {

            modalPrev.style.display =
                "flex";

            modalNext.style.display =
                "flex";

            modalCounter.style.display =
                "block";

        }

    }



    /* =====================================================
       NEXT
    ===================================================== */

    function nextImage() {

        if (
            currentImages.length <= 1
        ) {
            return;
        }


        currentImageIndex++;


        if (
            currentImageIndex >=
            currentImages.length
        ) {

            currentImageIndex =
                0;

        }


        updateModalImage();

    }



    /* =====================================================
       PREVIOUS
    ===================================================== */

    function previousImage() {

        if (
            currentImages.length <= 1
        ) {
            return;
        }


        currentImageIndex--;


        if (
            currentImageIndex < 0
        ) {

            currentImageIndex =
                currentImages.length - 1;

        }


        updateModalImage();

    }



    /* =====================================================
       CARD CLICK
    ===================================================== */

    projectCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openProject(card);

            }
        );

    });



    /* =====================================================
       VIEW PROJECT BUTTON
    ===================================================== */

    document
        .querySelectorAll(".view-project")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const card =
                        button.closest(
                            ".project-card"
                        );


                    openProject(card);

                }
            );

        });



    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    if (modalNext) {

        modalNext.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                nextImage();

            }
        );

    }



    /* =====================================================
       PREVIOUS BUTTON
    ===================================================== */

    if (modalPrev) {

        modalPrev.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                previousImage();

            }
        );

    }



    /* =====================================================
       CLOSE
    ===================================================== */

    function closeProject() {

        if (!modal) {
            return;
        }


        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );


        if (imageScroll) {

            imageScroll.scrollTop =
                0;

        }

    }



    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                closeProject();

            }
        );

    }



    /* =====================================================
       BACKDROP
    ===================================================== */

    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            function () {

                closeProject();

            }
        );

    }



    /* =====================================================
       ESC + KEYBOARD SLIDER
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !modal.classList.contains(
                    "active"
                )
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeProject();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousImage();

            }

        }
    );



    /* =====================================================
       TOUCH SWIPE
    ===================================================== */

    let touchStartX =
        0;

    let touchEndX =
        0;


    if (imageScroll) {

        imageScroll.addEventListener(
            "touchstart",
            function (event) {

                touchStartX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive: true
            }
        );


        imageScroll.addEventListener(
            "touchend",
            function (event) {

                touchEndX =
                    event.changedTouches[0]
                        .screenX;


                const difference =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(difference) < 50
                ) {
                    return;
                }


                if (
                    difference > 0
                ) {

                    nextImage();

                } else {

                    previousImage();

                }

            },
            {
                passive: true
            }
        );

    }

});



/* =========================================================
   8. ACTIVE NAV LINK
========================================================= */

(function initActiveNav() {

  const navLinks =
    document.querySelectorAll(
      '.nav-links a[href^="#"]'
    );


  const sections =
    document.querySelectorAll(
      "section[id]"
    );


  if (
    !navLinks.length ||
    !sections.length
  ) return;


  function updateActiveLink() {

    const scrollPosition =
      window.scrollY + 150;


    let currentSection = "";


    sections.forEach(
      section => {

        const top =
          section.offsetTop;

        const height =
          section.offsetHeight;

        const id =
          section.getAttribute("id");


        if (
          scrollPosition >= top &&
          scrollPosition <
            top + height
        ) {

          currentSection = id;

        }

      }
    );


    navLinks.forEach(
      link => {

        const href =
          link.getAttribute("href");


        link.classList.toggle(
          "active",
          href ===
            "#" + currentSection
        );

      }
    );

  }


  window.addEventListener(
    "scroll",
    updateActiveLink,
    {
      passive: true
    }
  );


  updateActiveLink();

})();
