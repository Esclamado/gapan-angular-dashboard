## Setup Host

Navigate to your `hosts` file and add `127.0.0.1 dev.fresheggsph.com`. Save it.

## Install NPM

Run `npm cache clean --force` on the root directory.

Run `npm i` to install node_modules and plugins.

## Run Web App

# Development Server

Before running the web app on your PC, go to `src/app/lib/env/env.ts`.
Make sure you are using `import { environment } from "src/environments/environment";` on the top portion.

Run `ng serve --host=dev.fresheggsph.com --port=4200 --live-reload=false` for a dev server.

Go to your web browser and type in `http://dev.fresheggsph.com:4200`.

## Build Web App

# Development Server

Before running the web app on your PC, go to `src/app/lib/env/env.ts`.
Make sure you are using `import { environment } from "src/environments/environment";` on the top portion.

Run `ng build --prod=false --vendorChunk=true --commonChunk=true --extractCss=true --extractLicenses=true --namedChunks=true --optimization=true --aot` for a development build.

Build is located at the `dist` folder.

# Production Server

Before running the web app on your PC, go to `src/app/lib/env/env.ts`.
Make sure you are using `import { environment } from "src/environments/environment.prod";` on the top portion.

Run `ng build --prod=false --vendorChunk=true --commonChunk=true --extractCss=true --extractLicenses=true --namedChunks=true --optimization=true --aot` for a production build.

Build is located at the `dist` folder.
