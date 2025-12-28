export type AuthUser = {
  id?: string | number;
  email?: string;
  name?: string;
};

export type AuthSession = {
  token?: string | null;
  user?: AuthUser | string | null;
};

export type AuthResponse = {
  token?: string;
  accessToken?: string;
  user?: AuthUser | string;
  email?: string;
};
