// Only replace Next's request cookie context. Signatures, users and roles are real.
exports.cookies = async function cookies() {
  return { get() { return { value: globalThis.__videoTestToken }; } };
};
