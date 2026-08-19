import { PloyLoadingScreen } from "@/components/shared/ploy-loader";

// Root route loading state. Dashboard segments keep their own skeletons, which
// mirror the page layout and read better than a spinner for content-shaped pages.
export default function Loading() {
  return <PloyLoadingScreen />;
}
