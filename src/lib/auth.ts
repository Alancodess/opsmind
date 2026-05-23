export const AUTH_COOKIE = "opsmind_session";

export type MockUser = {
  name: string;
  email: string;
  role: string;
  avatar: string;
};

export const MOCK_USER: MockUser = {
  name: "Alex Morgan",
  email: "alex@opsmind.dev",
  role: "Engineering Lead",
  avatar: "AM",
};

export const WORKSPACES = [
  { id: "ws-acme", name: "Acme Production", plan: "Enterprise" },
  { id: "ws-staging", name: "Staging", plan: "Team" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Developer" },
] as const;

export function setSessionCookie() {
  document.cookie = `${AUTH_COOKIE}=mock; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearSessionCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
