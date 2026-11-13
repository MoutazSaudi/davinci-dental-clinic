// Next.js supplies this build-time marker. Tests run server modules directly in Node.
import { registerHooks } from "node:module";
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return { url: new URL("./server-only-stub.cjs", import.meta.url).href, shortCircuit: true };
    if (process.env.VIDEO_TEST_AUTH === "true" && ["next/headers", "next/headers.js"].includes(specifier)) {
      return { url: new URL("./video-headers-stub.cjs", import.meta.url).href, shortCircuit: true };
    }
    if (process.env.APPOINTMENT_TEST_AUTH === "true" && ["next/headers", "next/headers.js"].includes(specifier)) {
      return { url: new URL("./headers-stub.cjs", import.meta.url).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
