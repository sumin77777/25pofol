
// intro.js
function initFallEffect() {
  const container   = document.getElementById('fall-container');
  const templateImg = document.querySelector('.icon-template img');
  const TOTAL    = 200;
  const DURATION = 2;
  const STAGGER  = 0.005;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let done = 0;
  return new Promise(resolve => {
    for (let i = 0; i < TOTAL; i++) {
      setTimeout(() => {
        const clone = templateImg.cloneNode(true);
        clone.classList.add('fall-item');
        container.appendChild(clone);

        gsap.set(clone, { x: Math.random()*vw, y: Math.random()*vh, opacity: 1 });
        gsap.to(clone, {
          y: vh + 50,
          opacity: 0,
          rotation: Math.random()*360,
          duration: DURATION + Math.random(),
          ease: 'power1.in',
          onComplete: () => {
            clone.remove();
            if (++done === TOTAL) resolve();
          }
        });
      }, i * STAGGER * 800);
    }
  });
}