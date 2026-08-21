/**
 * Pure honeypot check, extracted from the route handler so it can be
 * tested without spinning up Next's request/response machinery. Real
 * visitors never see or fill the "website" field on the submission form;
 * anything in it means the request is automated.
 */
export function isHoneypotTriggered(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0;
}
