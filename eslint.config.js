// Root ESLint config — uses the shared Softeneers preset.
// apps/landing is a standalone Next.js app (not a workspace member) with its own
// Next lint, so it's excluded from this root pass.
import softeneers from "@softeneers/config/eslint";

export default [...softeneers, { ignores: ["apps/landing/**"] }];
