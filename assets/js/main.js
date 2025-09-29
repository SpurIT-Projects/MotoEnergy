/**
 * Основной JavaScript файл для MotoEnergy
 */
class MotoEnergyApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSearch();
        this.setupImageLoading();
        this.setupForms();
        this.setupAnimations();
        this.setupLazyLoading();
    }

    // Мобильное меню
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        if (!mobileMenuBtn || !mainNav) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenuBtn.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header') && mainNav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Закрытие меню при изменении размера экрана
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        mobileMenuBtn.classList.add('active');
        mainNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Поиск
    setupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchBtn) return;

        searchBtn.addEventListener('click', () => {
            this.openSearchModal();
        });

        // Создаем модальное окно поиска если его нет
        if (!document.querySelector('.search-modal')) {
            this.createSearchModal();
        }
    }

    createSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-content">
                <h3>Поиск по каталогу</h3>
                <input type="text" class="search-input" placeholder="Введите название товара или бренд..." autocomplete="off">
                <div class="search-results"></div>
                <button class="search-close-btn" aria-label="Закрыть">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Обработчики событий для модального окна
        const closeBtn = modal.querySelector('.search-close-btn');
        const searchInput = modal.querySelector('.search-input');

        closeBtn.addEventListener('click', () => {
            this.closeSearchModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeSearchModal();
            }
        });

        // Поиск при вводе
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeSearchModal();
            }
        });
    }

    openSearchModal() {
        const modal = document.querySelector('.search-modal');
        const searchInput = modal.querySelector('.search-input');
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Фокус на поле ввода
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    closeSearchModal() {
        const modal = document.querySelector('.search-modal');
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Очистка результатов
        const results = modal.querySelector('.search-results');
        results.innerHTML = '';
    }

    performSearch(query) {
        const resultsContainer = document.querySelector('.search-results');
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Имитация поиска (в реальном приложении здесь был бы API запрос)
        const mockResults = [
            { name: 'Yamaha YZF-R7', category: 'Спортивные мотоциклы', price: '$8,500' },
            { name: 'Kawasaki Ninja ZX-6R', category: 'Спортивные мотоциклы', price: '$9,200' },
            { name: 'Honda CBR600RR', category: 'Спортивные мотоциклы', price: '$9,800' }
        ].filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(mockResults);
    }

    displaySearchResults(results) {
        const resultsContainer = document.querySelector('.search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Ничего не найдено</p>';
            return;
        }

        const resultsHTML = results.map(item => `
            <div class="search-result-item">
                <h4>${item.name}</h4>
                <p>${item.category}</p>
                <span class="price">${item.price}</span>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;
    }

    // Загрузка изображений
    setupImageLoading() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Добавляем плейсхолдер во время загрузки
            img.addEventListener('load', () => {
                img.classList.remove('image-loading');
                img.classList.add('image-loaded');
            });

            img.addEventListener('error', () => {
                img.classList.add('image-error');
                // Заменяем на плейсхолдер при ошибке загрузки
                this.handleImageError(img);
            });

            // Добавляем класс загрузки если изображение еще не загружено
            if (!img.complete) {
                img.classList.add('image-loading');
            }
        });
    }

    handleImageError(img) {
        // Создаем SVG плейсхолдер
        const placeholder = `
            <svg width="100%" height="200" viewBox="0 0 400 200" style="background: #f5f5f5;">
                <rect width="100%" height="100%" fill="#e0e0e0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif">
                    Изображение недоступно
                </text>
            </svg>
        `;
        
        img.outerHTML = placeholder;
    }

    // Обработка форм
    setupForms() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription(newsletterForm);
            });
        }
    }

    handleNewsletterSubscription(form) {
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        
        if (!email) return;

        // Показываем состояние загрузки
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Имитация отправки (в реальном приложении здесь был бы API запрос)
        setTimeout(() => {
            // Показываем успешное сообщение
            this.showNotification('Спасибо за подписку!', 'success');
            
            // Сбрасываем форму
            form.reset();
            button.innerHTML = '<i class="fas fa-paper-plane"></i>';
            button.disabled = false;
        }, 2000);
    }

    // Уведомления
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Показать уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Закрытие по клику
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // Анимации
    setupAnimations() {
        // Intersection Observer для анимаций при прокрутке
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами которые нужно анимировать
        const animatedElements = document.querySelectorAll(
            '.catalog-card, .article-card, .about-text, .gallery-item'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Ленивая загрузка изображений
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('lazyloaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                img.classList.add('lazyload');
                imageObserver.observe(img);
            });
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.motoEnergyApp = new MotoEnergyApp();
});

// Утилитарные функции
const Utils = {
    // Форматирование цен
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },

    // Дебаунс функция
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Проверка мобильного устройства
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Получение параметров URL
    getUrlParams() {
        return new URLSearchParams(window.location.search);
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MotoEnergyApp, Utils };
}