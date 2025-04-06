// Создание календаря для месяца мамыр
function createCalendar() {
  const calendarGrid = document.getElementById("calendarGrid")
  calendarGrid.innerHTML = ""

  // Определяем первый день месяца (0 - воскресенье, 1 - понедельник, и т.д.)
  // Для примера используем 2025 год, где 1 мая - четверг (индекс 4)
  const firstDayOfMonth = 3 // Четверг

  // Добавляем пустые ячейки для дней до начала месяца
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div")
    emptyCell.className = "day empty"
    calendarGrid.appendChild(emptyCell)
  }

  // Добавляем дни месяца
  for (let day = 1; day <= 31; day++) {
    const dayDiv = document.createElement("div")
    dayDiv.className = "day"
    dayDiv.textContent = day
    dayDiv.setAttribute("aria-label", `${day} мамыр`)
    dayDiv.setAttribute("role", "button")
    dayDiv.setAttribute("tabindex", "0")

    if (day === 31) {
      dayDiv.classList.add("highlight")
      dayDiv.setAttribute("aria-label", `${day} мамыр - Үйлену тойы күні`)
    }

    // Добавляем обработчик событий для клика и нажатия клавиши Enter
    dayDiv.addEventListener("click", () => {
      if (day === 31) {
        alert("31 мамыр - Үйлену тойы күні! Сағат 15:00-де кездесеміз!")
      }
    })

    dayDiv.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (day === 31) {
          alert("31 мамыр - Үйлену тойы күні! Сағат 15:00-де кездесеміз!")
        }
      }
    })

    calendarGrid.appendChild(dayDiv)
  }
}

// Таймер до 31 мая 15:00
function updateCountdown() {
  const now = new Date()
  const currentYear = now.getFullYear()
  // Используем следующий год, если текущий месяц май и прошло 31 число или уже июнь и далее
  const targetYear = now.getMonth() > 4 || (now.getMonth() === 4 && now.getDate() > 31) ? currentYear + 1 : currentYear

  const targetDate = new Date(targetYear, 4, 31, 15, 0, 0)
  const diff = targetDate - now

  // Расчет оставшегося времени
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  // Обновление элементов таймера с ведущими нулями
  document.getElementById("days").textContent = days.toString().padStart(2, "0")
  document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
  document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
  document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")
}

// Анимация элементов при прокрутке
function handleScrollAnimations() {
  if ("IntersectionObserver" in window) {
    const fadeElements = document.querySelectorAll(".fade")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running"
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    fadeElements.forEach((element) => {
      element.style.animationPlayState = "paused"
      observer.observe(element)
    })
  } else {
    // Fallback для браузеров без поддержки IntersectionObserver
    const fadeElements = document.querySelectorAll(".fade")
    fadeElements.forEach((element) => {
      element.style.animationPlayState = "running"
    })
  }
}

// Функция для кнопки "Наверх"
function setupBackToTopButton() {
  const backToTopButton = document.getElementById("backToTop")

  // Показываем кнопку при прокрутке вниз
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible")
    } else {
      backToTopButton.classList.remove("visible")
    }
  })

  // Прокрутка наверх при клике
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Функция для кнопки перехода на карту 2GIS
function setupLocationButton() {
  const addToCalendarButton = document.getElementById("addToCalendar")

  addToCalendarButton.addEventListener("click", () => {
    // Открываем ссылку на 2GIS в новой вкладке
    window.open("https://2gis.kz/kokshetau/geo/70030076160871124/69.393397,53.264342", "_blank")
  })
}

// Оптимизация для мобильных устройств
function setupMobileOptimizations() {
  // Предотвращаем зум при двойном касании на iOS
  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    },
    { passive: false },
  )

  // Улучшаем отзывчивость касаний
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    },
    { passive: false },
  )

  // Оптимизация для устройств с разной плотностью пикселей
  const devicePixelRatio = window.devicePixelRatio || 1
  if (devicePixelRatio > 3) {
    // Уменьшаем размер фонового узора для устройств с высокой плотностью пикселей
    document.body.style.backgroundSize = `${50 / devicePixelRatio}px auto`
  }
}

// Функция для кнопки воспроизведения музыки и прокрутки
function setupPlayButton() {
  const playButton = document.getElementById("playButton")
  const backgroundMusic = document.getElementById("backgroundMusic")

  playButton.addEventListener("click", () => {
    // Воспроизведение/пауза музыки
    if (backgroundMusic.paused) {
      backgroundMusic
        .play()
        .then(() => {
          playButton.classList.add("playing")
          playButton.innerHTML = '<span class="play-icon">♫</span> Тоқтату'
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения аудио:", error)
        })
    } else {
      backgroundMusic.pause()
      playButton.classList.remove("playing")
      playButton.innerHTML = '<span class="play-icon">♫</span> Ойнау'
    }

    // Плавная прокрутка к основному контенту
    const extraContent = document.getElementById("extraContent")
    extraContent.scrollIntoView({ behavior: "smooth", block: "start" })
  })
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  createCalendar()
  updateCountdown()
  setInterval(updateCountdown, 1000)
  handleScrollAnimations()
  setupBackToTopButton()
  setupLocationButton()
  setupMobileOptimizations()
  setupPlayButton() // Добавляем инициализацию кнопки воспроизведения

  // Проверка на поддержку сенсорного экрана
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add("touch-device")
  }

  // Предзагрузка изображений для улучшения производительности
  const preloadImages = ["1.jpg", "3.png", "4.jpg"]
  preloadImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
})

