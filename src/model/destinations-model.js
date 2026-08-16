export default class DestinationsModel {
  #destinations = [];
  #pointsApiService = null;

  constructor({ pointsApiService }) {
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
      throw err;
    }
  }

  get destinations() {
    return [...this.#destinations];
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
