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
        createConfetti(dayDiv)
        setTimeout(() => {
          alert("31 мамыр - Үйлену тойы күні! Сағат 15:00-де кездесеміз!")
        }, 300)
      }
    })

    dayDiv.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (day === 31) {
          createConfetti(dayDiv)
          setTimeout(() => {
            alert("31 мамыр - Үйлену тойы күні! Сағат 15:00-де кездесеміз!")
          }, 300)
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

  // Добавляем анимацию пульсации для секунд
  const secondsElement = document.getElementById("seconds")
  secondsElement.classList.add("pulse")
  setTimeout(() => {
    secondsElement.classList.remove("pulse")
  }, 500)

  // Анимация для кругов таймера
  animateCountdownCircles(days, hours, minutes, seconds)
}

// Анимация кругов таймера
function animateCountdownCircles(days, hours, minutes, seconds) {
  // Получаем максимальные значения для каждой единицы времени
  const maxDays = 365
  const maxHours = 24
  const maxMinutes = 60
  const maxSeconds = 60

  // Вычисляем процент заполнения для каждого круга
  const daysPercent = (1 - days / maxDays) * 100
  const hoursPercent = (1 - hours / maxHours) * 100
  const minutesPercent = (1 - minutes / maxMinutes) * 100
  const secondsPercent = (1 - seconds / maxSeconds) * 100

  // Применяем градиент для создания эффекта заполнения
  const daysCircle = document.querySelector(".countdown-unit:nth-child(1) .countdown-circle")
  const hoursCircle = document.querySelector(".countdown-unit:nth-child(2) .countdown-circle")
  const minutesCircle = document.querySelector(".countdown-unit:nth-child(3) .countdown-circle")
  const secondsCircle = document.querySelector(".countdown-unit:nth-child(4) .countdown-circle")

  if (daysCircle) daysCircle.style.background = `conic-gradient(var(--accent) ${daysPercent}%, var(--accent-light) 0%)`
  if (hoursCircle)
    hoursCircle.style.background = `conic-gradient(var(--accent) ${hoursPercent}%, var(--accent-light) 0%)`
  if (minutesCircle)
    minutesCircle.style.background = `conic-gradient(var(--accent) ${minutesPercent}%, var(--accent-light) 0%)`
  if (secondsCircle)
    secondsCircle.style.background = `conic-gradient(var(--accent) ${secondsPercent}%, var(--accent-light) 0%)`
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
  // Detect if device is mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    "ontouchstart" in window

  // Add mobile class to body if on mobile device
  if (isMobile) {
    document.body.classList.add("mobile-device")
  }

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

  // Add active state for buttons on touch devices
  if (isMobile) {
    const buttons = document.querySelectorAll('button, [role="button"]')
    buttons.forEach((button) => {
      button.addEventListener(
        "touchstart",
        () => {
          button.classList.add("touch-active")
        },
        { passive: true },
      )

      button.addEventListener(
        "touchend",
        () => {
          button.classList.remove("touch-active")
          setTimeout(() => button.classList.remove("touch-active"), 300)
        },
        { passive: true },
      )
    })
  }

  // Оптимизация для устройств с разной плотностью пикселей
  const devicePixelRatio = window.devicePixelRatio || 1
  if (devicePixelRatio > 3) {
    // Уменьшаем размер фонового узора для устройств с высокой плотностью пикселей
    document.body.style.backgroundSize = `${50 / devicePixelRatio}px auto`
  }
}

// Update the createFloatingHearts function to use white hearts
function createFloatingHearts() {
  const container = document.querySelector(".floating-hearts")

  // Создаем сердечки с интервалом
  setInterval(() => {
    // Создаем только если страница видна
    if (document.visibilityState === "visible") {
      const heart = document.createElement("div")

      // Create a white heart using SVG
      heart.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
      </svg>`

      heart.style.position = "absolute"
      heart.style.width = Math.random() * 30 + 15 + "px"
      heart.style.height = "auto"
      heart.style.opacity = "0"
      heart.style.left = Math.random() * 100 + "%"
      heart.style.animation = `floatHeart ${Math.random() * 5 + 5}s linear forwards`
      heart.style.filter = "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"

      container.appendChild(heart)

      // Удаляем сердечко после анимации
      setTimeout(() => {
        heart.remove()
      }, 10000)
    }
  }, 3000)
}

// Create falling petals effect
function createFallingPetals() {
  const container = document.querySelector(".falling-petals")
  const colors = ["#f8e1e4", "#f1d78f", "#e7c0c6", "#f0ead6", "#ffffff"]

  // Create petals at random intervals
  setInterval(() => {
    if (document.visibilityState === "visible") {
      const petal = document.createElement("div")

      // Random petal shape
      const petalType = Math.floor(Math.random() * 3)
      let petalSvg

      if (petalType === 0) {
        // Oval petal
        petalSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0Z" fill="${colors[Math.floor(Math.random() * colors.length)]}"/>
        </svg>`
      } else if (petalType === 1) {
        // Heart-shaped petal
        petalSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18.35l-1.45-1.32C3.4 12.36 0 9.28 0 5.5C0 2.42 2.42 0 5.5 0c1.74 0 3.41.81 4.5 2.09C11.09.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.78-3.4 6.86-8.55 11.54L10 18.35z" fill="${colors[Math.floor(Math.random() * colors.length)]}"/>
        </svg>`
      } else {
        // Leaf-shape
        petalSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,0 C15,5 20,10 15,15 C10,20 5,15 0,10 C5,5 5,0 10,0" fill="${colors[Math.floor(Math.random() * colors.length)]}"/>
        </svg>`
      }

      petal.innerHTML = petalSvg
      petal.style.position = "absolute"
      petal.style.left = Math.random() * 100 + "%"
      petal.style.top = "-20px"
      petal.style.opacity = "0"
      petal.style.transform = `rotate(${Math.random() * 360}deg)`
      petal.style.animation = `fallPetal ${Math.random() * 10 + 5}s linear forwards`
      petal.style.filter = "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1))"

      container.appendChild(petal)

      // Remove petal after animation
      setTimeout(() => {
        petal.remove()
      }, 15000)
    }
  }, 500)
}

// Add a confetti effect when clicking on the wedding date
function createConfetti(element) {
  // Create confetti container if it doesn't exist
  let confettiContainer = document.querySelector(".confetti-container")
  if (!confettiContainer) {
    confettiContainer = document.createElement("div")
    confettiContainer.className = "confetti-container"
    confettiContainer.style.position = "fixed"
    confettiContainer.style.top = "0"
    confettiContainer.style.left = "0"
    confettiContainer.style.width = "100%"
    confettiContainer.style.height = "100%"
    confettiContainer.style.pointerEvents = "none"
    confettiContainer.style.zIndex = "999"
    document.body.appendChild(confettiContainer)
  }

  // Get element position
  const rect = element.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  // Function to create confetti
  const colors = ["#d2b48c", "#8b5e3c", "#a67c5d", "#f1d78f", "#fffaf0", "#f8e1e4", "#e7c0c6"]

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div")
    confetti.style.position = "absolute"
    confetti.style.left = x + "px"
    confetti.style.top = y + "px"
    confetti.style.width = Math.random() * 10 + 5 + "px"
    confetti.style.height = Math.random() * 6 + 3 + "px"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0"
    confetti.style.opacity = Math.random() * 0.5 + 0.5

    // Random rotation
    let rotation = Math.random() * 360
    confetti.style.transform = `rotate(${rotation}deg)`

    // Random direction and speed
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 5 + 3
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed - 2 // Slight upward bias

    confettiContainer.appendChild(confetti)

    // Animate the confetti
    let posX = x
    let posY = y
    let opacity = 1
    const rotationSpeed = (Math.random() - 0.5) * 10

    const animate = () => {
      if (opacity <= 0) {
        confetti.remove()
        return
      }

      posX += vx
      posY += vy + 0.5 // Add gravity
      opacity -= 0.01
      rotation += rotationSpeed

      confetti.style.left = posX + "px"
      confetti.style.top = posY + "px"
      confetti.style.opacity = opacity
      confetti.style.transform = `rotate(${rotation}deg)`

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }
}

// Setup photo modal
function setupPhotoModal() {
  const photoContainer = document.querySelector(".photo-container")
  const photoModal = document.getElementById("photoModal")
  const modalImage = document.getElementById("modalImage")
  const closeModal = document.querySelector(".close-modal")
  const mainPhoto = document.getElementById("mainPhoto")

  if (!photoContainer || !photoModal || !modalImage || !closeModal || !mainPhoto) return

  photoContainer.addEventListener("click", () => {
    modalImage.src = mainPhoto.src
    photoModal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  })

  closeModal.addEventListener("click", () => {
    photoModal.classList.remove("active")
    document.body.style.overflow = "" // Restore scrolling
  })

  // Close modal when clicking outside the image
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) {
      photoModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && photoModal.classList.contains("active")) {
      photoModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })
}

// Add interactive calendar hover effects
function setupCalendarInteractions() {
  // Wait for calendar to be created
  setTimeout(() => {
    const days = document.querySelectorAll(".day:not(.empty)")
    if (!days.length) return

    days.forEach((day) => {
      // Create ripple effect on hover
      day.addEventListener("mouseenter", () => {
        const ripple = document.createElement("div")
        ripple.className = "day-ripple"
        ripple.style.position = "absolute"
        ripple.style.top = "50%"
        ripple.style.left = "50%"
        ripple.style.width = "0"
        ripple.style.height = "0"
        ripple.style.backgroundColor = "rgba(139, 94, 60, 0.1)"
        ripple.style.borderRadius = "50%"
        ripple.style.transform = "translate(-50%, -50%)"
        ripple.style.transition = "all 0.5s ease-out"
        ripple.style.zIndex = "0"

        day.style.overflow = "hidden"
        day.appendChild(ripple)

        // Trigger animation
        setTimeout(() => {
          ripple.style.width = "200%"
          ripple.style.height = "200%"
        }, 10)
      })

      day.addEventListener("mouseleave", () => {
        const ripple = day.querySelector(".day-ripple")
        if (ripple) {
          ripple.style.opacity = "0"
          setTimeout(() => {
            ripple.remove()
          }, 500)
        }
      })
    })
  }, 1000)
}

// Функция для кнопки воспроизведения музыки
function setupPlayButton() {
  const playButton = document.getElementById("playButton")
  const backgroundMusic = document.getElementById("backgroundMusic")

  // Preload audio for better mobile experience
  backgroundMusic.load()

  // Add special handling for iOS devices which require user interaction for audio
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  if (isIOS) {
    document.body.addEventListener(
      "touchstart",
      () => {
        // Create and play a silent audio element to unlock audio
        const silentAudio = document.createElement("audio")
        silentAudio.setAttribute(
          "src",
          "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV",
        )
        silentAudio.volume = 0
        document.body.appendChild(silentAudio)
        silentAudio
          .play()
          .then(() => {
            document.body.removeChild(silentAudio)
          })
          .catch(() => {
            // Ignore errors
          })
      },
      { once: true },
    )
  }
  // Use both click and touchend for better mobile response
  ;["click", "touchend"].forEach((eventType) => {
    playButton.addEventListener(
      eventType,
      (e) => {
        // Prevent double firing on devices that trigger both events
        if (e.type === "touchend" && e.cancelable) {
          e.preventDefault()
        }

        // Avoid processing if this is a simulated click from touchend
        if (e.type === "click" && playButton.touchFired) {
          playButton.touchFired = false
          return
        }

        // Set flag for touchend
        if (e.type === "touchend") {
          playButton.touchFired = true
        }

        // Воспроизведение/пауза музыки
        if (backgroundMusic.paused) {
          // Add vibration feedback on mobile if supported
          if ("vibrate" in navigator) {
            navigator.vibrate(50)
          }

          backgroundMusic
            .play()
            .then(() => {
              playButton.classList.add("playing")
              playButton.innerHTML =
                '<span class="play-icon">♫</span><span class="play-text">Тоқтату</span><span class="play-sparkle"></span>'
            })
            .catch((error) => {
              console.error("Ошибка воспроизведения аудио:", error)
            })
        } else {
          backgroundMusic.pause()
          playButton.classList.remove("playing")
          playButton.innerHTML =
            '<span class="play-icon">♫</span><span class="play-text">Ойнау</span><span class="play-sparkle"></span>'
        }
      },
      { passive: false },
    )
  })
}

// Function to handle page visibility changes
function handleVisibilityChange() {
  const backgroundMusic = document.getElementById("backgroundMusic");
  const playButton = document.getElementById("playButton");
  
  // Check if the page is hidden (user switched tabs or minimized)
  if (document.hidden) {
    // If music is playing, pause it
    if (backgroundMusic && !backgroundMusic.paused) {
      backgroundMusic.pause();
      
      // Update the play button appearance if needed
      if (playButton) {
        playButton.classList.remove("playing");
        playButton.innerHTML = 
          '<span class="play-icon">♫</span><span class="play-text">Ойнау</span><span class="play-sparkle"></span>';
      }
    }
  }
}

// Function to handle page unload (browser close or navigation away)
function handleBeforeUnload() {
  const backgroundMusic = document.getElementById("backgroundMusic");
  
  // Pause music when user is leaving the page
  if (backgroundMusic && !backgroundMusic.paused) {
    backgroundMusic.pause();
  }
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
  setupPlayButton()
  createFloatingHearts()
  createFallingPetals()
  setupPhotoModal()
  setupCalendarInteractions()

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

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", handleBeforeUnload);

  // For mobile devices, add these additional event listeners
  window.addEventListener("pagehide", handleBeforeUnload);
  document.addEventListener("pause", handleBeforeUnload); // For some mobile browsers
})