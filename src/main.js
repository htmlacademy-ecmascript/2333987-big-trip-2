import BoardPresenter from './presenter/board-presenter.js';
import ListFilterView from './view/filter-view.js';
import InfoView from './view/info-view.js';
import { render, RenderPosition } from '../framework/render.js';

// Селекторы из index.html
const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

// Временные моковые данные для проверки отрисовки (замените на свои, когда появятся модели)
const mockPoints = [
  { id: '1', type: 'taxi', basePrice: 120, dateFrom: '2026-08-15T09:00:00.000Z', dateTo: '2026-08-15T10:30:00.000Z', destination: 'dest-1', offers:, isFavorite: false },
  { id: '2', type: 'flight', basePrice: 500, dateFrom: '2026-08-16T12:00:00.000Z', dateTo: '2026-08-16T16:40:00.000Z', destination: 'dest-2', offers:, isFavorite: true }
];
const mockOffers = [
  { type: 'taxi', offers: [{ id: 1, title: 'Upgrade to business', price: 20 }] },
  { type: 'flight', offers: [{ id: 2, title: 'Add luggage', price: 50 }, { id: 3, title: 'Choose seat', price: 15 }] }
];
const mockDestinations = [
  { id: 'dest-1', name: 'Amsterdam', description: 'Beautiful city', pictures: [] },
  { id: 'dest-2', name: 'Geneva', description: 'Swiss city', pictures: [] }
];
const mockFilters = [{ type: 'everything', name: 'Everything', count: mockPoints.length }];

// 1. Отрисовка общих данных путешествия в шапку (в самое начало)
render(new InfoView({ points: mockPoints, offers: mockOffers, destinations: mockDestinations }), tripMainElement, RenderPosition.AFTERBEGIN);

// 2. Отрисовка фильтров
render(new ListFilterView({ filters: mockFilters, currentFilterType: 'everything', onFilterTypeChange: () => {} }), tripControlsFiltersElement);

// 3. Инициализация и запуск главного презентера
const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsElement,
  points: mockPoints,
  offers: mockOffers,
  destinations: mockDestinations
});

boardPresenter.init();
