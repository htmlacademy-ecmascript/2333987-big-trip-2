import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from './model/filters-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';
import InfoPresenter from './presenter/info-presenter.js';

const AUTHORIZATION = 'Basic f39Ul2g16RI528mf';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const filterContainerElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ pointsApiService });
const destinationsModel = new DestinationsModel({ pointsApiService });
const offersModel = new OffersModel({ pointsApiService });
const filtersModel = new FiltersModel();

const filterPresenter = new FilterPresenter({
  filterContainerElement,
  filtersModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  container: mainElement,
  newPointButtonContainer: tripMainElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filtersModel,
});

const infoPresenter = new InfoPresenter({
  container: tripMainElement,
  pointsModel,
  destinationsModel,
  offersModel,
});

filterPresenter.init();
boardPresenter.init();
infoPresenter.init();

// Справочники (пункты назначения и офферы) загружаются до точек,
// так как точки ссылаются на них по id
Promise.all([
  destinationsModel.init(),
  offersModel.init(),
])
  .then(() => pointsModel.init())
  .catch(() => {
    boardPresenter.showLoadError();
  })
  .finally(() => {
    boardPresenter.enableNewPointButton();
  });
