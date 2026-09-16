/* =========================================================
   PORTFOLIO JAVASCRIPT
========================================================= */

/* 1. LOADING SCREEN */
(function initLoader() {
  const screen = document.getElementById("loading-screen");
  const fill = document.getElementById("track-fill");
  const runner = document.getElementById("runner");
  const percent = document.getElementById("loading-percent");
  const mainSite = document.getElementById("main-site");

  if (!screen) return;

  let progress = 0;
  const duration = 1800;
  const start = performance.now();

  document.body.style.overflow = "hidden";

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min(100, (elapsed / duration) * 100);

    if (fill) fill.style.width = progress + "%";
    if (runner) runner.style.left = progress + "%";
    if (percent) percent.textContent = Math.floor(progress) + "%";

    if (progress < 100) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      screen.classList.add("hide");
      if (mainSite) mainSite.classList.add("site-loaded");
      document.body.style.overflow = "";
    }, 250);
  }

  requestAnimationFrame(tick);
})();

/* 2. NAVBAR SCROLL MORPHING */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let isScrolled = false;

  function handleScroll() {
    const shouldScroll = window.scrollY > 40;
    if (shouldScroll && !isScrolled) {
      navbar.classList.add("scrolled");
      isScrolled = true;
    } else if (!shouldScroll && isScrolled) {
      navbar.classList.remove("scrolled");
      isScrolled = false;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
})();

/* 3. MOBILE NAVIGATION TOGGLE */
(function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const navbar = document.getElementById("navbar");

  if (!toggle || !links) return;

  function openMenu() {
    toggle.classList.add("open");
    links.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    toggle.classList.remove("open");
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = links.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!links.classList.contains("open")) return;
    if (navbar && !navbar.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();

/* 4. REVEAL ON SCROLL */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
})();

/* 5. SKILL PROGRESS BAR */
(function initSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card");
  if (!skillCards.length) return;

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const fill = card.querySelector(".skill-bar-fill");
        if (fill && card.dataset.percent) {
          fill.style.width = card.dataset.percent + "%";
        }
        skillObserver.unobserve(card);
      });
    },
    { threshold: 0.3 }
  );

  skillCards.forEach((card) => skillObserver.observe(card));
})();

/* 6. STATISTICS COUNTER */
(function initCounters() {
  const statNums = document.querySelectorAll(".num[data-count]");
  if (!statNums.length) return;

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = parseInt(element.dataset.count, 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1200;
        const stepTime = Math.max(Math.floor(duration / target), 20);

        const timer = setInterval(() => {
          current++;
          if (element.firstChild) element.firstChild.textContent = current;
          if (current >= target) {
            clearInterval(timer);
            if (element.firstChild) element.firstChild.textContent = target;
          }
        }, stepTime);

        statObserver.unobserve(element);
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => statObserver.observe(el));
})();

/* 7. PROJECT FILTER & MODAL SYSTEM */
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const modal = document.getElementById("projectModal");
  const modalBackdrop = document.getElementById("projectModalBackdrop");
  const modalClose = document.getElementById("projectModalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalLive = document.getElementById("modalLive");
  const modalDescription = document.getElementById("modalDescription");
  const modalTech = document.getElementById("modalTech");
  const modalImage = document.getElementById("modalImage");
  const modalCounter = document.getElementById("modalCounter");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  const imageScroll = document.querySelector(".modal-image-scroll");
  const scrollNotice = document.getElementById("scrollNotice");

  let currentImages = [];
  let currentImageIndex = 0;

  /* Filter Functionality */
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  function formatTitle(title) {
    const words = title.trim().split(/\s+/);
    if (words.length === 1) return `<span>${words[0]}</span>`;
    const lastWord = words.pop();
    return `${words.join(" ")} <span>${lastWord}</span>`;
  }

  function openProject(card) {
    if (!card || !modal) return;

    const noScrollNotice = card.getAttribute("data-no-scroll-notice") === "true";
    if (scrollNotice) {
      noScrollNotice ? scrollNotice.classList.add("is-hidden") : scrollNotice.classList.remove("is-hidden");
    }

    const title = card.getAttribute("data-title") || "";
    const category = card.getAttribute("data-category-name") || "";
    const live = card.getAttribute("data-live") || "";
    const description = card.getAttribute("data-description") || "";
    const tech = card.getAttribute("data-tech") || "";
    const images = card.getAttribute("data-images") || "";

    if (modalTitle) modalTitle.innerHTML = formatTitle(title);
    if (modalCategory) modalCategory.textContent = category;

    if (modalLive) {
      if (live.trim() !== "" && live !== "live") {
        modalLive.textContent = "◉ LIVE";
        modalLive.href = live;
        modalLive.style.display = "inline-flex";
      } else {
        modalLive.style.display = "none";
      }
    }

    if (modalDescription) modalDescription.textContent = description;

    if (modalTech) {
      modalTech.innerHTML = "";
      tech.split("|").forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) {
          const span = document.createElement("span");
          span.textContent = trimmed;
          modalTech.appendChild(span);
        }
      });
    }

    currentImages = images.split("|").map((img) => img.trim()).filter((img) => img !== "");
    if (currentImages.length === 0) {
      const mainImg = card.querySelector(".project-thumb img");
      if (mainImg) currentImages = [mainImg.getAttribute("src")];
    }

    currentImageIndex = 0;
    updateModalImage();

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (imageScroll) imageScroll.scrollTop = 0;
  }

  function updateModalImage() {
    if (!modalImage || currentImages.length === 0) return;

    modalImage.style.opacity = "0";
    setTimeout(() => {
      modalImage.src = currentImages[currentImageIndex];
      modalImage.onload = () => (modalImage.style.opacity = "1");
      modalImage.onerror = () => (modalImage.style.opacity = "1");
    }, 80);

    if (modalCounter) modalCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;

    if (currentImages.length <= 1) {
      if (modalPrev) modalPrev.style.display = "none";
      if (modalNext) modalNext.style.display = "none";
      if (modalCounter) modalCounter.style.display = "none";
    } else {
      if (modalPrev) modalPrev.style.display = "flex";
      if (modalNext) modalNext.style.display = "flex";
      if (modalCounter) modalCounter.style.display = "block";
    }
  }

  function nextImage() {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateModalImage();
  }

  function previousImage() {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateModalImage();
  }

  projectCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openProject(card);
    });
  });

  if (modalNext) modalNext.addEventListener("click", (e) => { e.stopPropagation(); nextImage(); });
  if (modalPrev) modalPrev.addEventListener("click", (e) => { e.stopPropagation(); previousImage(); });

  function closeProject() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (modalClose) modalClose.addEventListener("click", closeProject);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeProject);

  document.addEventListener("keydown", (e) => {
    if (!modal || !modal.classList.contains("active")) return;
    if (e.key === "Escape") closeProject();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") previousImage();
  });
})();

/* 8. ACTIVE NAV LINK ON SCROLL */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;
    let currentSection = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === "#" + currentSection);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
})();