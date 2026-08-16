import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const MAX_DISPLAYED_DESTINATIONS = 3;

const getDestinations = (points, destinations) => {
  if (points.length === 0 || destinations.length === 0) {
    return 'Your route';
  }

  const selectedDestinations = points.map((point) => {
    const pointDestination = destinations.find((dest) => dest.id === point.destination);
    return pointDestination ? pointDestination.name : '';
  }).filter(Boolean);

  if (selectedDestinations.length > MAX_DISPLAYED_DESTINATIONS) {
    const firstDestination = selectedDestinations[0];
    const lastDestination = selectedDestinations.at(-1);

    return `${firstDestination} &mdash; ... &mdash; ${lastDestination}`;
  }

  return selectedDestinations.join(' &mdash; ');
};

const getTripValue = (points, offers) => {
  if (points.length === 0) {
    return 0;
  }

  const basePricesSum = points.reduce((total, point) => total + point.basePrice, 0);
  let offersPriceSum = 0;

  for (const point of points) {
    const offersByType = offers.find((offer) => point.type === offer.type);

    if (!offersByType) {
      continue;
    }

    for (const offer of offersByType.offers) {
      if (point.offers.includes(offer.id)) {
        offersPriceSum += offer.price;
      }
    }
  }

  return basePricesSum + offersPriceSum;
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '... - ...';
  }

  const dateFrom = dayjs(points[0].dateFrom).format('D MMM');
  const dateTo = dayjs(points.at(-1).dateTo).format('D MMM');

  return `${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;
};

const createTripInfoTemplate = (points, offers, destinations) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getDestinations(points, destinations)}</h1>
      <p class="trip-info__dates">${getTripDates(points)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripValue(points, offers)}</span>
    </p>
  </section>`
);

export default class InfoView extends AbstractView {
  #points = [];
  #offers = [];
  #destinations = [];

  constructor({ points, offers, destinations }) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}

