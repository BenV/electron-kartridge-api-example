This is a very bare-bones example of how to get the Kartridge API working with Electron,
Electron Forge, and Node FFI. It can be used as a reference for other Electron packagers
and nwjs as well. This example is based on Node 10.11.0 to match version 4 of Electron, so
it uses `node-ffi-napi` instead of `node-ffi`, but the API is the same either way.

The API in `kartridge_api.js` was generated with `node-ffi-generate` after making some minor
modifications to `kongregate.h` from the SDK (removing `extern C` and converting `bool` to `unsigned char`).
This means that boolean variables will be represented as 1 for true and 0 for false in node.
The `longlong` type was also manually changed to `uint64` since `longlong` is 32 bits on 32-bit systems.

The dynamic libraries live in the `resources` directory and Electron Forge is configured to include
the DLL and dylib files in package.json like so:

```
"electronPackagerConfig": {
  "packageManager": "npm",
  "extraResource": [
    "resources/kartridge-sdk-x86.dll",
    "resources/kartridge-sdk-x86_64.dll",
    "Contents/Resources/libkartridge-sdk.dylib"
  ]
}
```

This example includes Electron-specific logic in the `kartridge_api.js` file for determining the
location of the dylib file for OSX (using `app.isPackaged` and `process.resourcesPath`), so if
you are using something other than Electron that logic will need to change to match your specific
framework.

The `kong_gameid.txt` file should be updated with your game ID when running during development, and
should not be included in the build.

If you have electron-forge installed you can run the project with `electron-forge start` and package
it with `electron-forge package --arch ia32` for a 32-bit build (recommended for Kartridge). Both
32-bit and 64-bit DLLs are included in this example, but you only need to include the one that matches
the architecture you are building for.
