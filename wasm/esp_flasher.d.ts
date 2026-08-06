/**
 * Type stub for the Emscripten-generated ES module glue.
 * @param moduleOverrides Optional Emscripten module overrides
 * @returns Initialized module instance
 */
declare function createEspFlasherModule(
  moduleOverrides?: Record<string, unknown>,
): Promise<Record<string, unknown>>;

export default createEspFlasherModule;
export { createEspFlasherModule };
