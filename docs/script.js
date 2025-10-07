document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password'); // Скрытый input
    const passwordMask = document.getElementById('password-mask'); // Элемент с маской
    const loginButton = document.getElementById('login-button');
    const statusMessage = document.getElementById('status-message');
    const glitchWrapper = document.getElementById('glitch-wrapper');

    // Размеры и позиция
    const CONTAINER_RECT = glitchWrapper.getBoundingClientRect();
    const CONTAINER_PADDING = 40; 
    const MAX_MOVE_RANGE = 70; // Максимальное расстояние для убегания

    const moves = ['left', 'up', 'right', 'down'];
    let moveIndex = 0;
    let buttonIsReady = false;

    // --- 1. Анимированный Фон (Starfield) - Canvas ---
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 200;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createStars() {
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                speed: Math.random() * 0.2 + 0.05,
                color: `rgba(59, 130, 246, ${Math.random() * 0.8 + 0.2})`
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Движение
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(drawStars);
    }
    createStars();
    drawStars();

    // --- 2. Логика Валидации и Кнопки ---

    const updatePasswordMask = () => {
        const valueLength = passwordInput.value.length;
        if (valueLength === 0) {
            passwordMask.innerHTML = '';
            return;
        }

        let maskHTML = '';
        // Символы маски
        for (let i = 0; i < valueLength; i++) {
            // Создаем пульсирующую неоновую точку
            maskHTML += '<span class="pulsing-dot"></span>'; 
        }
        
        // Для удобства, чтобы при клике курсор всегда становился в конец
        passwordMask.innerHTML = maskHTML;
    };
    
    // Скрытый input получает фокус, когда кликаем по маске
    passwordMask.addEventListener('click', () => passwordInput.focus());

    // --- 3. Функции Глитча и Валидации ---
    
    const triggerGlitch = () => {
        glitchWrapper.classList.add('glitch-active');
        setTimeout(() => {
            glitchWrapper.classList.remove('glitch-active');
        }, 150); 
    };

    const checkFields = () => {
        const userFilled = usernameInput.value.trim() !== '';
        const passFilled = passwordInput.value.trim() !== '';

        const ready = userFilled && passFilled;
        
        // Обновление статуса
        if (ready) {
            statusMessage.textContent = "ГОТОВО К ПРОДОЛЖЕНИЮ";
            statusMessage.className = 'status-message success';
        } else {
            statusMessage.textContent = "ПОЛЯ НЕ МОГУТ БЫТЬ ПУСТЫМИ";
            statusMessage.className = 'status-message error';
        }

        // Обновление состояния кнопки
        if (ready && !buttonIsReady) {
            loginButton.disabled = false;
            // Возвращаем в центр с анимацией
            loginButton.style.transform = 'translate(-50%, 0)';
            loginButton.classList.add('bounce-back');
            buttonIsReady = true;
        } else if (!ready && buttonIsReady) {
            loginButton.disabled = true;
            buttonIsReady = false;
            loginButton.classList.remove('bounce-back');
        }
        
        // Устанавливаем статус ошибки для визуализации
        usernameInput.closest('.input-group').classList.toggle('error', !userFilled && !ready);
        passwordInput.closest('.input-group').classList.toggle('error', !passFilled && !ready);
    };

    // --- 4. Логика убегающей кнопки ---

    loginButton.addEventListener('mouseover', () => {
        if (!loginButton.disabled) return; 

        triggerGlitch(); // Глитч при попытке поймать
        
        const direction = moves[moveIndex];
        moveIndex = (moveIndex + 1) % moves.length;
        
        let offsetX = 0;
        let offsetY = 0;
        
        // Определение смещения
        switch (direction) {
            case 'left':
                offsetX = -MAX_MOVE_RANGE;
                break;
            case 'up':
                offsetY = -MAX_MOVE_RANGE;
                break;
            case 'right':
                offsetX = MAX_MOVE_RANGE;
                break;
            case 'down':
                offsetY = MAX_MOVE_RANGE;
                break;
        }
        
        // Применяем transform для движения
        loginButton.style.transform = `translate(calc(-50% + ${offsetX}px), ${offsetY}px)`;
    });

    // --- 5. Слушатели событий ---
    
    // Проверка при вводе
    usernameInput.addEventListener('input', checkFields);
    passwordInput.addEventListener('input', checkFields);
    passwordInput.addEventListener('input', updatePasswordMask); // Обновляем маску пароля
    
    // Стартовая проверка
    checkFields();
    
    // Обработка клика
    loginButton.addEventListener('click', (e) => {
        if (!loginButton.disabled) {
            e.preventDefault();
            alert('Аутентификация прошла успешно. Добро пожаловать в Neo-Grid!');
        }
    });
});