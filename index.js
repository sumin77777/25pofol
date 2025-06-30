// index.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Splash intro fetch + inject
  const resp = await fetch('intro.html');
  if (!resp.ok) return console.error('intro.html 불러오기 실패');
  const html = await resp.text();
  const introContainer = document.getElementById('intro-container');
  introContainer.innerHTML = html;

  if (window.initFallEffect) {
    // 인트로 애니 시작
    const introPromise = window.initFallEffect();

    // 0.8초 뒤에 메인 애니 실행
    setTimeout(() => {
      initMainAnimations();
    }, 4000);

    // 인트로 끝난 뒤 페이드아웃
    await introPromise;
    await gsap.to('#intro', {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete() {
        introContainer.innerHTML = '';
      }
    });
  } else {
    // 만약 initFallEffect가 없으면 바로 메인 애니
    initMainAnimations();
  }
});

function initMainAnimations() {
  // GSAP & ScrollTrigger 설정
  gsap.registerPlugin(ScrollTrigger);

  // 프로그레스바
  const progressBar = document.getElementById('scroll-progress');
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: self => {
      gsap.set(progressBar, { height: (self.progress * 100) + '%' });
    }
  });

  // 패널 배치 애니메이션
  ScrollTrigger.batch('.panel', {
    start: 'top 80%',
    onEnter: batch => {
      gsap.fromTo(batch,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.6, ease: 'power2.out' }
      );
    },
    onLeaveBack: batch => {
      gsap.to(batch, { y: 50, opacity: 0, duration: 0.4, ease: 'power2.in' });
    }
  });

  // qmark 바운스
  gsap.to('.qmark', {
    y: -20,
    duration: 1.2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  });

  // 네비게이션 링크 hover
  document.querySelectorAll('.dropdown-content .menu2 a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { x: 5, color: '#000', duration: 0.3, ease: 'power1.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { x: 0, color: '#222', duration: 0.3, ease: 'power1.in' });
    });
  });

  // 포트폴리오 박스 마우스 3D
  document.querySelectorAll('.hoka-box, .asahi-box, .ezair-box, .mcdonald-box, .life4cut-box, .etc-box').forEach(box => {
    box.addEventListener('mousemove', e => {
      const rect = box.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(box, {
        rotationY: 20 * x,
        rotationX: -20 * y,
        transformPerspective: 600,
        transformOrigin: 'center',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    box.addEventListener('mouseleave', () => {
      gsap.to(box, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  // 헤더 페이드인
  gsap.from('.dropdown-content', {
    y: -50, opacity: 0, duration: 1, ease: 'power2.out'
  });

  // 프로필 섹션 슬라이드 인
  ScrollTrigger.create({
    trigger: ".acontent",
    start: "top 75%",
    onEnter: () => {
      gsap.from(".acontent1", { x: -100, opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.from(".acontent2", { x:  100, opacity: 0, duration: 0.6, delay: 0.2, ease: "power2.out" });
    }
  });

  // Experience 타임라인 점프 & hr 애니메이션
const dotBounce = gsap.timeline({ paused: true, repeat: 1 });
  ['.timedot1', '.timedot2', '.timedot3'].forEach((sel, i) => {
    dotBounce
      .to(sel, { y: -30, duration: 0.5, ease: 'power2.out' }, i * 0.4)
      .to(sel, { y: 0,    duration: 0.5, ease: 'bounce.out' }, `-=${0.5 - i * 0.1}`);
  });

  
  // 2) ScrollTrigger로 트리거 걸기
  ScrollTrigger.create({
    trigger: ".econtent",
    start: "top 50%",
    onEnter: () => dotBounce.play(), // 섹션이 뷰포트에 들어올 때 dotBounce 재생
    once: true                       // 한 번만 실행
  });

  // 기존 hr 애니도 ScrollTrigger로 묶어두면 함께 동작
  gsap.from(".timetable hr", {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1,
    ease: "power1.out",
    scrollTrigger: {
      trigger: ".econtent",
      start: "top 50%",
      toggleActions: "play none none none"
    }
  });

  // 포트폴리오 박스 스케일업
  document.querySelectorAll('.hoka-box, .asahi-box, .ezair-box, .mcdonald-box, .life4cut-box, .etc-box').forEach(box => {
    ScrollTrigger.create({
      trigger: box,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(box, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' });
      }
    });
  });

  // 제목 글자 등장 (ScrollTrigger)
  gsap.to(".title span", {
    opacity: 1,
    y: 0,
    stagger: 0.3,
    duration: 1,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: ".wrap2",
      start: "top 80%",
    }
  });

  // 타입라이터
  const el = document.querySelector('.typewriter');
  if (el) {
    const fullText = el.textContent;
    el.textContent = '';
    let idx = 0;
    (function type() {
      if (idx < fullText.length) {
        el.textContent += fullText[idx++];
        setTimeout(type, 150);
      } else {
        el.style.borderRight = '2px solid transparent';
      }
    })();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const thumbs    = document.querySelectorAll('.pdf-thumb');
  const modal     = document.getElementById('pdfModal');
  const viewer    = document.getElementById('pdfViewer');
  const btnClose  = document.getElementById('pdfClose');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const url = thumb.dataset.pdf;
      // PDFObject 임베드
      PDFObject.embed(url, "#pdfViewer", {
        fallbackLink: "<p>PDF를 보려면 <a href='" + url + "' target='_blank'>여기</a>를 클릭하세요.</p>"
      });
      // 모달 보이기
      modal.classList.remove('hidden');
    });
  });

  // 모달 닫기
  btnClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    viewer.innerHTML = "";  // embed 내용 제거
  });

  // 백드롭 클릭해도 닫히게
  document.querySelector('.modal-backdrop').addEventListener('click', () => {
    btnClose.click();
  });
});
