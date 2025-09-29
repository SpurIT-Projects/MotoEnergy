/**
 * Scroll Manager - управление прокруткой страницы
 */
class ScrollManager {
    constructor() {
        this.scrollTopBtn = document.getElementById('scrollTopBtn');
        this.init();
    }

    init() {
        this.setupScrollToTop();
        this.setupSmoothScrolling();
        this.setupScrollIndicator();
    }

    // Кнопка прокрутки наверх
    setupScrollToTop() {
        if (!this.scrollTopBtn) return;

        // Показать/скрыть кнопку при прокрутке
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.scrollTopBtn.classList.add('visible');
            } else {
                this.scrollTopBtn.classList.remove('visible');
            }
        });

        // Прокрутка наверх при клике
        this.scrollTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    // Плавная прокрутка для якорных ссылок
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                this.scrollToElement(target);
            }
        });
    }

    // Индикатор прокрутки страницы
    setupScrollIndicator() {
        let ticking = false;

        const updateScrollIndicator = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            // Обновляем прогресс бар если он есть
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                progressBar.style.width = `${scrollPercent}%`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollIndicator);
                ticking = true;
            }
        });
    }

    // Плавная прокрутка к элементу
    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // Прокрутка наверх
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Прокрутка к определенной позиции
    scrollTo(position) {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    }

    // Получить текущую позицию прокрутки
    getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    // Проверка видимости элемента
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Анимация появления элементов при прокрутке
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-up');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Автоматический скролл вверх при смене страницы
class PageScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Сохранение позиции при уходе со страницы
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition();
        });

        // Восстановление или сброс позиции при загрузке
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });

        // Обработка навигации в SPA
        this.setupNavigationScrollReset();
    }

    saveScrollPosition() {
        const position = window.pageYOffset;
        sessionStorage.setItem('scrollPosition', position.toString());
    }

    handlePageLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const resetScroll = urlParams.get('reset-scroll');
        
        // Если это новая страница или есть параметр сброса скролла
        if (resetScroll === 'true' || this.isNewPageLoad()) {
            window.scrollTo(0, 0);
            sessionStorage.removeItem('scrollPosition');
        } else {
            // Восстанавливаем позицию для обновления страницы
            const savedPosition = sessionStorage.getItem('scrollPosition');
            if (savedPosition && !window.location.hash) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedPosition));
                }, 100);
            }
        }
    }

    isNewPageLoad() {
        const referrer = document.referrer;
        const currentDomain = window.location.origin;
        
        // Считаем загрузку новой, если пришли с другого домена или без referrer
        return !referrer || !referrer.startsWith(currentDomain);
    }

    setupNavigationScrollReset() {
        // Обработка кликов по ссылкам навигации
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Если это внутренняя ссылка на другую страницу
            if (href && href.startsWith('/') && !href.startsWith('/#')) {
                // Добавляем параметр для сброса скролла
                if (!href.includes('reset-scroll=true')) {
                    const separator = href.includes('?') ? '&' : '?';
                    link.href = href + separator + 'reset-scroll=true';
                }
            }
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем менеджеры прокрутки
    window.scrollManager = new ScrollManager();
    window.pageScrollManager = new PageScrollManager();
    
    // Добавляем анимации прокрутки
    window.scrollManager.setupScrollAnimations();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollManager, PageScrollManager };
}