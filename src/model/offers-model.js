export default class OffersModel {
  #offers = [];
  #pointsApiService = null;

  constructor({ pointsApiService }) {
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch (err) {
      this.#offers = [];
      throw err;
    }
  }

  get offers() {
    return this.#offers;
  }

  getById(id) {
    const flattenOffers = this.#offers.flatMap((item) => item.offers);
    return flattenOffers.find((offer) => offer.id === id);
  }

  getByIds(offersIds) {
    return offersIds.map((id) => this.getById(id)).filter(Boolean);
  }
}
