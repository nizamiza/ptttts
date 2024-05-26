export class Utils {
  /**
   * @template {Record<string, any>} Options
   * @template {Partial<Options>} Defaults
   * @template {Options & Defaults} ResolvedOptions
   *
   * @param {Options | undefined | null} options
   * @param {Defaults | undefined | null} defaults
   * @returns {ResolvedOptions}
   */
  static getOptions(options, defaults) {
    return /** @type {ResolvedOptions } */ ({ ...defaults, ...options });
  }

  /**
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
