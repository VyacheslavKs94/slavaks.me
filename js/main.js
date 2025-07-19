const hiSection = document.getElementById('hiSection');
const whoSection = document.getElementById('whoSection');
const workedSection = document.getElementById('workedSection');
const workingSection = document.getElementById('workingSection');
const arrow = document.getElementById('arrow');

// Throttling функция для оптимизации производительности
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function onScroll() {
  const scrollY = window.scrollY;
  const wh = window.innerHeight;

  // Скрытие стрелки
  arrow.style.opacity = scrollY < 40 ? '0.7' : '0';

  // Получаем ссылки навигации
  const whoLink = document.querySelector('a[href="#whoSection"]');
  const workedLink = document.querySelector('a[href="#workedSection"]');
  const workingLink = document.querySelector('a[href="#workingSection"]');

  // Получаем реальные координаты секций
  const whoSectionRect = whoSection.getBoundingClientRect();
  const workedSectionRect = workedSection.getBoundingClientRect();
  const workingSectionRect = workingSection.getBoundingClientRect();

  // WHO AM I - подсвечиваем когда секция видна в верхней части экрана
  if (whoSectionRect.top <= wh * 0.3 && whoSectionRect.bottom >= wh * 0.3) {
    whoLink.classList.add('active');
  } else {
    whoLink.classList.remove('active');
  }

  // THINGS I WORKED ON - подсвечиваем когда секция видна в верхней части экрана
  if (workedSectionRect.top <= wh * 0.3 && workedSectionRect.bottom >= wh * 0.3) {
    workedLink.classList.add('active');
  } else {
    workedLink.classList.remove('active');
  }

  // THINGS I'M WORKING ON - подсвечиваем когда секция видна в верхней части экрана
  if (workingSectionRect.top <= wh * 0.3 && workingSectionRect.bottom >= wh * 0.3) {
    workingLink.classList.add('active');
  } else {
    workingLink.classList.remove('active');
  }

  // Показываем секции (оставляем старую логику для анимации появления)
  if (scrollY > wh * 0.1) {
    whoSection.classList.add('visible');
  } else {
    whoSection.classList.remove('visible');
  }

  if (scrollY > wh * 0.3) {
    workedSection.classList.add('visible');
  } else {
    workedSection.classList.remove('visible');
  }

  if (scrollY > wh * 0.5) {
    workingSection.classList.add('visible');
  } else {
    workingSection.classList.remove('visible');
  }
}

// Применяем throttling к функции скролла
const throttledOnScroll = throttle(onScroll, 16); // ~60fps

window.addEventListener('scroll', throttledOnScroll);
window.addEventListener('resize', throttledOnScroll);

document.body.style.minHeight = '250vh';

onScroll();

// === BLOBS BACKGROUND ===
const blobColors = [
  'hsl(260, 60%, 30%)', // тёмно-фиолетовый
  'hsl(200, 70%, 25%)', // тёмно-синий
  'hsl(170, 60%, 22%)', // тёмно-бирюзовый
  'hsl(340, 55%, 28%)', // тёмно-бордовый
  'hsl(120, 50%, 22%)', // тёмно-зелёный
  'hsl(30, 60%, 28%)',  // тёмно-оранжевый
  'hsl(220, 40%, 24%)', // графитово-синий
  'hsl(280, 50%, 26%)', // баклажан
  'hsl(190, 60%, 22%)', // глубокий сине-зелёный
  'hsl(50, 40%, 30%)',  // тёмно-жёлтый
];

// Адаптивное количество блобов в зависимости от размера экрана
const isMobile = window.innerWidth <= 700;
const blobsCount = isMobile ? 3 : 5;
const blobs = [];
const blobsBg = document.querySelector('.blobs-bg');

// Храним состояние каждого блоба
const blobStates = [];

function createBlobs() {
  for (let i = 0; i < blobsCount; i++) {
    const blob = document.createElement('div');
    blob.className = 'blob';
    
    // Адаптивный размер блобов
    const baseSize = isMobile ? 150 : 250;
    const sizeVariation = isMobile ? 80 : 120;
    const size = baseSize + Math.random() * sizeVariation;
    
    blob.style.width = blob.style.height = `${size}px`;
    
    // Рандомная начальная позиция по всему экрану
    const startX = Math.random() * 80 + 10; // 10-90%
    const startY = Math.random() * 80 + 10; // 10-90%
    blob.style.left = `${startX}%`;
    blob.style.top = `${startY}%`;
    
    // Инициализируем цвет
    const initialColor = blobColors[Math.floor(Math.random() * blobColors.length)];
    blob.style.background = initialColor;
    
    // Создаём состояние блоба
    const state = {
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 0.15, // медленная начальная скорость по X
      vy: (Math.random() - 0.5) * 0.15, // медленная начальная скорость по Y
      color: initialColor,
      colorChangeTime: Date.now() + Math.random() * 5000, // время следующей смены цвета
      size: size
    };
    
    blobStates.push(state);
    blobsBg.appendChild(blob);
    blobs.push(blob);
  }
}

function animateBlobs() {
  const currentTime = Date.now();
  
  blobs.forEach((blob, i) => {
    const state = blobStates[i];
    
    // Обновляем позицию
    state.x += state.vx;
    state.y += state.vy;
    
    // Отскок от границ экрана
    if (state.x <= 5 || state.x >= 85) {
      state.vx *= -1;
      state.x = Math.max(5, Math.min(85, state.x));
    }
    if (state.y <= 5 || state.y >= 85) {
      state.vy *= -1;
      state.y = Math.max(5, Math.min(85, state.y));
    }
    
    // Случайное изменение направления (небольшое)
    if (Math.random() < 0.005) { // уменьшаем частоту изменений
      state.vx += (Math.random() - 0.5) * 0.05; // уменьшаем силу изменений
      state.vy += (Math.random() - 0.5) * 0.05;
    }
    
    // Ограничиваем скорость
    const maxSpeed = 0.25; // медленная максимальная скорость
    state.vx = Math.max(-maxSpeed, Math.min(maxSpeed, state.vx));
    state.vy = Math.max(-maxSpeed, Math.min(maxSpeed, state.vy));
    
    // Смена цвета
    if (currentTime > state.colorChangeTime) {
      const currentColorIndex = blobColors.indexOf(state.color);
      const nextColorIndex = (currentColorIndex + 1) % blobColors.length;
      state.color = blobColors[nextColorIndex];
      blob.style.background = state.color;
      state.colorChangeTime = currentTime + 6000 + Math.random() * 4000; // 6-10 секунд
    }
    
    // Применяем новую позицию
    blob.style.left = `${state.x}%`;
    blob.style.top = `${state.y}%`;
  });
  
  // Планируем следующее обновление
  requestAnimationFrame(animateBlobs);
}



createBlobs();
// Запускаем анимацию блобов
animateBlobs();

// Обработчик изменения размера окна
function handleResize() {
  // Очищаем старые блобы
  blobsBg.innerHTML = '';
  blobs.length = 0;
  blobStates.length = 0; // Очищаем массив состояний
  
  // Пересоздаем блобы с новыми параметрами
  createBlobs();
  animateBlobs(); // Перезапускаем анимацию
}

window.addEventListener('resize', throttle(handleResize, 250)); 