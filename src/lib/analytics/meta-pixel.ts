export const META_PIXEL_ID = "852381565767658";

// Local dev and Vercel preview deployments must not report into the live pixel.
export const META_PIXEL_HOSTS = ["searchploy.com", "www.searchploy.com"];

type MetaStandardEvent = "ViewContent" | "Lead" | "CompleteRegistration" | "SubmitApplication";

// Params are hard-coded labels at every call site. Never pass anything the user
// typed (email, name, company, codes) — this goes straight to Meta.
type MetaEventParams = Record<string, string | number>;

type FbqArgs = [string, string, MetaEventParams?];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __metaPixelQueue?: FbqArgs[];
  }
}

// Tracking sits inside signup, verification and listing submission; a blocked
// or broken fbq must never throw into those flows.
function send(args: FbqArgs) {
  try {
    if (!META_PIXEL_HOSTS.includes(window.location.hostname)) return;
    // The base code loads after hydration, so an event fired from a page's
    // first render (ViewContent on an ad landing) arrives before fbq exists.
    // It waits here and the base code replays it straight after init.
    if (window.fbq) window.fbq(...args);
    else (window.__metaPixelQueue ??= []).push(args);
  } catch {}
}

export function trackMetaEvent(event: MetaStandardEvent, params?: MetaEventParams) {
  send(["track", event, params]);
}

export function trackMetaPageView() {
  send(["track", "PageView"]);
}
