import { bin, LOCAL_API_URL, run, wait } from "./local-utils.mjs";

const child = run(
  bin("./node_modules/.bin/astro"),
  ["dev", "--host", "127.0.0.1", "--port", "4321"],
  {
    env: {
      ...process.env,
      ASTRO_DEV_BACKGROUND: "0",
      API_URL: process.env.API_URL || LOCAL_API_URL,
      PUBLIC_API_URL: process.env.PUBLIC_API_URL || LOCAL_API_URL,
    },
  },
);
process.exitCode = await wait(child);
