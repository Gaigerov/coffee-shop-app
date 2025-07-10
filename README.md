# Coffee Shop App - E-commerce

![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-purple?logo=redux)
![MUI](https://img.shields.io/badge/Material_UI-7.2.0-blue?logo=mui)
![Supabase](https://img.shields.io/badge/Supabase-2.50.4-green?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-7.4.0-blue?logo=stripe)
![Vite](https://img.shields.io/badge/Vite-7.0.3-yellow?logo=vite)
[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-green.svg)](https://gaigerov.github.io/coffee-shop-app/#/)

Этот проект представляет собой полнофункциональное интернет-магазин кофе с использованием современных веб-технологий. Приложение включает каталог товаров, корзину покупок, систему оплаты через Stripe и личный кабинет пользователя.

## Особенности

- ☕ **Каталог товаров** - Отображение кофейных продуктов из Supabase
- 🛒 **Управление корзиной** - Добавление/удаление товаров с хранением в Redux
- 💳 **Интеграция Stripe** - Безопасная оплата в тестовом режиме
- 🔐 **Аутентификация** - Регистрация и вход через Supabase Auth
- 👤 **Личный кабинет** - История заказов и система лояльности ("кофейные зерна")
- 📱 **Адаптивный дизайн** - Полная поддержка мобильных устройств
- 🧩 **Строгая типизация** - TypeScript для надежности кода

## Демо-версия

[Посмотреть работающее приложение на GitHub Pages](https://gaigerov.github.io/coffee-shop-app/#/)

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/gaigerov/coffee-shop-app.git
cd coffee-shop-app
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне проекта и добавьте свои Supabase ключи:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Запустите приложение в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

## Деплой на GitHub Pages

Для публикации на GitHub Pages выполните:
```bash
npm run predeploy
npm run deploy
```

## Структура проекта

```
src/
├── assets/                  # Статические ресурсы
├── components/              # UI компоненты
│   ├── auth/                # Компоненты аутентификации
│   ├── cart/                # Компоненты корзины
│   ├── checkout/            # Компоненты оплаты
│   ├── common/              # Общие компоненты
│   ├── layout/              # Компоненты макета
│   └── products/            # Компоненты товаров
├── features/                # Redux Toolkit slices
│   ├── auth/                # Аутентификация
│   ├── cart/                # Корзина
│   ├── orders/              # Заказы
│   └── products/            # Товары
├── hooks/                   # Кастомные хуки
├── pages/                   # Страницы приложения
│   ├── AuthPage/            # Страница авторизации
│   ├── Cart/                # Страница корзины
│   ├── Checkout/            # Страница оплаты
│   ├── Home/                # Главная страница
│   ├── Menu/                # Меню магазина
│   └── Account/             # Личный кабинет
├── services/                # Сервисы API
│   ├── authService.ts       # Сервис аутентификации
│   ├── orderService.ts      # Сервис заказов
│   ├── productService.ts    # Сервис товаров
│   └── stripeService.ts     # Сервис платежей
├── styles/                  # Глобальные стили и SCSS
├── types/                   # Типы TypeScript
├── utils/                   # Вспомогательные функции
├── App.tsx                  # Главный компонент
└── main.tsx                 # Точка входа
```

## Технологический стек

### Frontend
- **React** (v19.1.0) - Библиотека для создания пользовательских интерфейсов
- **TypeScript** (v5.8.3) - Статическая типизация для JavaScript
- **Redux Toolkit** (v2.8.2) - Управление состоянием приложения
- **React Router** (v7.6.3) - Навигация между страницами
- **Material-UI** (v7.2.0) - UI компоненты и дизайн-система
- **SCSS** (v1.89.2) - Препроцессор CSS для стилизации

### Инфраструктура
- **Vite** (v7.0.3) - Сборщик проекта
- **ESLint** (v9.30.1) - Линтинг кода
- **GitHub Pages** - Хостинг демо-версии

### Бекенд и сервисы
- **Supabase** (v2.50.4) - База данных и аутентификация
- **Stripe API** (v7.4.0) - Платежная система
- **Axios** (v1.10.0) - HTTP-клиент

## Архитектура приложения

Приложение построено по модульному принципу с четким разделением ответственности:

1. **Presentation Layer (Компоненты и страницы)**
   - Отвечает за отображение UI
   - Использует компоненты Material-UI
   - Получает данные через Redux

2. **State Management (Redux Toolkit)**
   - Хранит состояние приложения
   - Управляет корзиной, пользовательскими данными
   - Обрабатывает асинхронные операции через RTK Query

3. **Services Layer (API сервисы)**
   - Общение с Supabase API
   - Интеграция с Stripe
   - Обработка аутентификации

4. **Routing (React Router)**
   - Управление навигацией между страницами
   - Защищенные маршруты для авторизованных пользователей

## Лицензия

Этот проект распространяется под лицензией MIT. Подробнее см. в файле [LICENSE](LICENSE).

---

**Примечание:** Для работы с платежами используется тестовый режим Stripe. Для реальных транзакций необходимо заменить тестовые ключи на реальные.