import assert from "node:assert/strict";
import { test } from "node:test";

import { createAuth, getSession, toNodeHandler } from "../dist/index.js";

const auth = createAuth({
  secret: "test-secret-test-secret-test-secret",
  baseURL: "http://localhost:4000",
});

test("createAuth returns a better-auth instance", () => {
  assert.equal(typeof auth.handler, "function");
  assert.equal(typeof auth.api, "object");
});

test("toNodeHandler wraps the instance into a Node handler", () => {
  assert.equal(typeof toNodeHandler(auth), "function");
});

test("getSession returns null for an unauthenticated request", async () => {
  const session = await getSession(auth, {});
  assert.equal(session, null);
});
