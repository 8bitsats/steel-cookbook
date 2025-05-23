import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      minify: true,
    },
  },
  alias: {},
});
