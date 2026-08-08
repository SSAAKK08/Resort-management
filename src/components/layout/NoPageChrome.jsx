// Older detail components still include page-level chrome tags inline.
// The App Router root layout now renders the real shared chrome once.
export default function NoPageChrome() {
  return null;
}
