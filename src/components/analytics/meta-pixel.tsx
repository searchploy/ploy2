import Script from "next/script";
import { META_PIXEL_HOSTS, META_PIXEL_ID } from "@/lib/analytics/meta-pixel";
import { MetaPixelPageViews } from "@/components/analytics/meta-pixel-events";

/*
 * Meta's standard base code, with these changes:
 * - disablePushState: the pixel otherwise fires its own PageView on every
 *   history.pushState, which the App Router calls on each navigation. Route
 *   PageViews are sent by MetaPixelPageViews instead, so each counts once.
 * - allowDuplicatePageViews: without it fbevents silently drops every PageView
 *   after the first in a page load, which is every client-side navigation.
 *   MetaPixelPageViews already sends at most one per pathname change.
 * - autoConfig off: stops Meta scraping button text and page metadata into
 *   events it invents; only the events sent explicitly are reported.
 * - the replay of __metaPixelQueue, for events fired before this ran.
 */
const baseCode = `
(function () {
  if (${JSON.stringify(META_PIXEL_HOSTS)}.indexOf(window.location.hostname) === -1) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq.disablePushState = true;
  fbq.allowDuplicatePageViews = true;
  fbq('set', 'autoConfig', false, '${META_PIXEL_ID}');
  fbq('init', '${META_PIXEL_ID}');
  fbq('track', 'PageView');
  var pending = window.__metaPixelQueue || [];
  window.__metaPixelQueue = [];
  for (var i = 0; i < pending.length; i++) fbq.apply(null, pending[i]);
})();
`;

export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {baseCode}
      </Script>
      <MetaPixelPageViews />
    </>
  );
}
