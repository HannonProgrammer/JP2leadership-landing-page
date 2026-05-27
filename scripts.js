const dom = {
  accordions: '.accordion-toggle',
  sliderRoot: '[data-slider]',
  filterInput: '#course-filter',
  filterButtons: '[data-filter]',
  courseCards: '.course-card',
  galleryItem: '.gallery-item',
  modal: '.modal',
  modalImage: '.modal-image',
  modalCaption: '.modal-caption',
  modalClose: '.modal-close'
};

document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initSlider();
  initCourseFilter();
  initGallery();
  initVideoBackgrounds();
});

function initAccordions() {
  const buttons = document.querySelectorAll(dom.accordions);
  buttons.forEach((button) => {
    const panel = button.nextElementSibling;
    if (!panel) return;
    button.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      button.classList.toggle('active', !open);
      panel.style.maxHeight = open ? '0px' : `${panel.scrollHeight}px`;
    });
  });
}

function initSlider() {
  document.querySelectorAll(dom.sliderRoot).forEach((root) => {
    const track = root.querySelector('.slide-track');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.slider-control.prev');
    const next = root.querySelector('.slider-control.next');
    if (!track || slides.length === 0) return;
    let currentIndex = 0;

    const update = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    prev?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      update();
    });

    next?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      update();
    });

    if (root.dataset.autoplay === 'true') {
      setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        update();
      }, 7000);
    }
  });
}

function initCourseFilter() {
  const input = document.querySelector(dom.filterInput);
  const buttons = document.querySelectorAll(dom.filterButtons);
  const cards = document.querySelectorAll(dom.courseCards);
  if (!cards.length) return;

  const applyFilter = () => {
    const query = (input?.value || '').trim().toLowerCase();
    const activeButton = document.querySelector(`${dom.filterButtons}.active`);
    const category = activeButton?.dataset.filter || 'all';

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const matchesText = query === '' || text.includes(query);
      const matchesCategory = category === 'all' || card.dataset.category === category;
      card.style.display = matchesText && matchesCategory ? '' : 'none';
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyFilter();
    });
  });

  input?.addEventListener('input', applyFilter);
}

function initGallery() {
  const items = document.querySelectorAll(dom.galleryItem);
  const modal = document.querySelector(dom.modal);
  const image = modal?.querySelector(dom.modalImage);
  const caption = modal?.querySelector(dom.modalCaption);
  const close = modal?.querySelector(dom.modalClose);
  if (!items.length || !modal || !image || !caption || !close) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.querySelector('img')?.src;
      const title = item.dataset.title || item.querySelector('img')?.alt || '';
      if (!src) return;
      image.src = src;
      caption.textContent = title;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
}

function initVideoBackgrounds() {
  document.querySelectorAll('.video-panel video').forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.play().catch(() => {
      // Some browsers require user interaction before playing video.
    });
  });
}
