export default class URLS {
  static base_url = __ENV.BASE_URL;

  static get checkoutUrl () {
    return `${this.base_url}/checkout`
  }
}
