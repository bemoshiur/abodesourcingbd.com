import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // Brute-force protection for the public /admin login.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name"],
  },
  fields: [{ name: "name", type: "text" }],
};
