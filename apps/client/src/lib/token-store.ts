/**
 * lib/token-store.ts — Module-level JWT token store.
 *
 * Holds the current access token in a plain module variable so the Axios
 * interceptor (a singleton created outside React) can always read the latest
 * value without creating circular dependencies with AuthContext.
 *
 * AuthContext is the ONLY writer.  Axios interceptors are the ONLY readers.
 */

let _token: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export const tokenStore = {
  /** Read the current in-memory token. */
  getToken: (): string | null => _token,

  /** Called by AuthContext whenever the token changes (login / logout). */
  setToken: (token: string | null): void => {
    _token = token;
  },

  /**
   * Register a callback that fires when the server returns 401.
   * AuthContext sets this to its own `logout` function so the Axios
   * response interceptor can tear down the session automatically.
   */
  setOnUnauthorized: (cb: (() => void) | null): void => {
    _onUnauthorized = cb;
  },

  /** Called by the Axios response interceptor on 401 responses. */
  triggerUnauthorized: (): void => {
    _onUnauthorized?.();
  },
};
