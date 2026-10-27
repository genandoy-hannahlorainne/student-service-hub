/**
 * Type declarations for netlify-identity-widget v1.
 * The package does not ship its own .d.ts files.
 */
declare module "netlify-identity-widget" {
  export interface User {
    id: string;
    /** Returns a Promise<string> for the user's current JWT. */
    jwt: (forceRefresh?: boolean) => Promise<string>;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
      [key: string]: unknown;
    };
    app_metadata: {
      provider?: string;
      roles?: string[];
      [key: string]: unknown;
    };
    created_at: string;
    updated_at: string;
    confirmed_at?: string;
    role: string;
    url: string;
    token?: {
      access_token: string;
      expires_at: number;
      expires_in: number;
      refresh_token: string;
      token_type: string;
    };
  }

  export interface InitOptions {
    container?: string | HTMLElement;
    locale?: string;
    logo?: boolean;
  }

  type EventName = "init" | "login" | "logout" | "error" | "open" | "close";

  export function init(opts?: InitOptions): void;
  export function open(tab?: "login" | "signup"): void;
  export function close(): void;
  export function logout(): void;
  export function currentUser(): User | null;
  export function refresh(): Promise<string>;

  export function on(event: "init", cb: (user: User | null) => void): void;
  export function on(event: "login", cb: (user: User) => void): void;
  export function on(event: "logout", cb: () => void): void;
  export function on(event: "error", cb: (err: Error) => void): void;
  export function on(event: "open" | "close", cb: () => void): void;
  export function on(event: EventName, cb: (...args: unknown[]) => void): void;

  export function off(event: EventName, cb?: (...args: unknown[]) => void): void;

  const widget: {
    init: typeof init;
    open: typeof open;
    close: typeof close;
    logout: typeof logout;
    currentUser: typeof currentUser;
    refresh: typeof refresh;
    on: typeof on;
    off: typeof off;
    gotrue: {
      login: (email: string, password: string) => Promise<User>;
      signup: (
        email: string,
        password: string,
        data?: Record<string, unknown>
      ) => Promise<User>;
      [key: string]: unknown;
    };
  };

  export default widget;
}
