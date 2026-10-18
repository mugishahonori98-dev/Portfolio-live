(() => {
    const page = document.querySelector('.motion-page');
    if (!page || !('IntersectionObserver' in window)) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveals = [...page.querySelectorAll(
        '.section > .container, .cv-grid, .skill-card, .skill-detail, .project-card, .project-detail-card'
    )];
    const flow = page.querySelector('.concept-flow');
    let observer;

    function reveal(element) {
        element.classList.remove('motion-pending');
        element.classList.add('motion-entered');
        observer?.unobserve(element);
    }

    function syncMotion() {
        observer?.disconnect();
        reveals.forEach(element => element.classList.remove('motion-pending'));
        flow?.classList.remove('motion-flow-active');
        if (preference.matches) return;

        observer = new IntersectionObserver(entries => {
            entries.forEach(({ target, isIntersecting }) => {
                if (!isIntersecting) return;
                if (target === flow) {
                    target.classList.add('motion-flow-active');
                    observer.unobserve(target);
                } else {
                    reveal(target);
                }
            });
        }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });

        reveals.forEach(element => {
            if (element.classList.contains('motion-entered')) return;
            element.classList.add('motion-pending');
            observer.observe(element);
        });
        if (flow) observer.observe(flow);
    }

    // Keyboard navigation must never leave focused content hidden or fading.
    page.addEventListener('focusin', ({ target }) => {
        reveals.forEach(element => {
            if (element.contains(target)) reveal(element);
        });
    });

    preference.addEventListener('change', syncMotion);
    syncMotion();
})();
