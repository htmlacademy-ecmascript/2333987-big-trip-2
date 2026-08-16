import { render, replace } from '../framework/render.js';
import ListView from '../view/list-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import ListSortView from '../view/sort-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import { SortType } from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #points = [];
  #offers = [];
  #destinations = [];

  #listComponent = new ListView();
  #sortComponent = null;

  constructor({ boardContainer, points, offers, destinations }) {
    this.#boardContainer = boardContainer;
    // На старте получаем массивы данных
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init() {
    if (this.#points.length === 0) {
      render(new ListEmptyView({ filterType: 'everything' }), this.#boardContainer);
      return;
    }

    this.#sortComponent = new ListSortView({
      currentSortType: SortType.DAY,
      onSortTypeChange: (sortType) => {
        // Тут будет логика пересортировки в будущем
      }
    });
    render(this.#sortComponent, this.#boardContainer);

    render(this.#listComponent, this.#boardContainer);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onFavoriteClick: () => {
        // Будущая логика изменения статуса избранного
      }
    });

    const pointEditComponent = new EditPointView({
      point,
      offersForType: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: (updatedPoint) => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormClose: () => {
        pointEditComponent.reset(point);
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onDeleteClick: () => {
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }
}
