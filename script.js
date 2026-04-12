(function () {
  const header = document.getElementById("site-header");
  const hero = document.getElementById("hero");
  const burger = document.getElementById("nav-burger");
  const drawer = document.getElementById("nav-drawer");

  function setDrawerOpen(open) {
    if (!header || !burger || !drawer) return;
    header.classList.toggle("is-drawer-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger && drawer) {
    burger.addEventListener("click", function () {
      setDrawerOpen(!header.classList.contains("is-drawer-open"));
    });

    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setDrawerOpen(false);
    });
  }

  function updateHeaderScrolled() {
    if (!header || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    header.classList.toggle("is-scrolled", heroBottom < 72);
  }

  updateHeaderScrolled();
  window.addEventListener("scroll", updateHeaderScrolled, { passive: true });
  window.addEventListener("resize", function () {
    updateHeaderScrolled();
    if (window.innerWidth > 900) setDrawerOpen(false);
  }, { passive: true });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".section-reveal[data-reveal]").forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  const nodes = document.querySelectorAll(".section-reveal[data-reveal]");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );

  nodes.forEach(function (node) {
    observer.observe(node);
  });
})();
