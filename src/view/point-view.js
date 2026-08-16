import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';

function createPointTemplate(point, allOffers, allDestinations) {
  const { type, basePrice, dateFrom, dateTo, isFavorite, destination, offers: selectedOffersIds } = point;

  const pointDestination = allDestinations.find((item) => item.id === destination);
  const pointTypeOffer = allOffers.find((offer) => offer.type === type);

  const dateStart = dayjs(dateFrom);
  const dateEnd = dayjs(dateTo);

  const durationMinutes = dateEnd.diff(dateStart, 'minute');
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationText = `${hours > 0 ? `${String(hours).padStart(2, '0')}H ` : ''}${String(minutes).padStart(2, '0')}M`;

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const selectedOffersTemplate = () => {
    if (!pointTypeOffer || !selectedOffersIds.length) {
      return '';
    }
    return pointTypeOffer.offers
      .filter((offer) => selectedOffersIds.includes(offer.id))
      .map((offer) => `
        <li class="event__offer">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${he.encode(String(offer.price))}</span>
        </li>`).join('');
  };

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateStart.format('YYYY-MM-DD')}">${dateStart.format('MMM D')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${he.encode(type)} ${pointDestination ? he.encode(pointDestination.name) : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateStart.format('YYYY-MM-DDTHH:mm')}">${dateStart.format('HH:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateEnd.format('YYYY-MM-DDTHH:mm')}">${dateEnd.format('HH:mm')}</time>
          </p>
          <p class="event__duration">${durationText}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffersTemplate()}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`.trim();
}

export default class PointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, offers, destinations, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
