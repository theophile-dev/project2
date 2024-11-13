
await Bun.build({
    entrypoints: ['server.ts'],
    outdir: './serverbuild',  // Specify the output directory
    target: "bun",
  });