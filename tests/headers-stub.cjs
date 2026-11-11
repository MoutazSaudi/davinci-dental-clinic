// Simulate only Next's request cookie context; sessions still use real signatures and database users.
exports.cookies = async function cookies() {
  return { get() { return { value: globalThis.__appointmentTestToken }; } };
};
