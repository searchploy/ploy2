export const MIN_PASSWORD_LENGTH = 10;

/**
 * The passwords that actually show up in credential-stuffing lists: short
 * ones, keyboard runs, and the user's own email or the product name. This is
 * not a substitute for Supabase's leaked-password check against
 * HaveIBeenPwned — that catches breached passwords this cannot know about —
 * but it removes the obvious ones for free.
 *
 * Returns the first problem, or null when the password is acceptable.
 */
export function validatePassword(password: string, email?: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  const lower = password.toLowerCase();

  // A password made of one repeated character, however long.
  if (/^(.)\1+$/.test(password)) {
    return "That's the same character repeated — pick something less guessable.";
  }

  // Sequential runs, forwards or backwards.
  const runs = ["0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop"];
  for (const run of runs) {
    for (let i = 0; i + 6 <= run.length; i++) {
      const slice = run.slice(i, i + 6);
      if (lower.includes(slice) || lower.includes([...slice].reverse().join(""))) {
        return "Avoid runs of sequential characters like 123456 or qwerty.";
      }
    }
  }

  const banned = ["password", "letmein", "welcome", "iloveyou", "admin", "ploy"];
  if (banned.some((word) => lower.includes(word))) {
    return "That contains a very common word. Pick something harder to guess.";
  }

  // The local part of their own email is one of the first things guessed.
  const localPart = email?.split("@")[0]?.toLowerCase();
  if (localPart && localPart.length >= 4 && lower.includes(localPart)) {
    return "Don't use your email address in your password.";
  }

  // Some variety, without demanding a specific mix of symbols — length plus
  // unpredictability matters more than forcing everyone to add "!1".
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (classes < 2) {
    return "Mix in another kind of character — a capital, a number or a symbol.";
  }

  return null;
}
