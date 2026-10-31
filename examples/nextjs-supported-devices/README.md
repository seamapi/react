# Supported devices in Next.js

This App Router example renders the catalog into the page HTML. React then hydrates the same component for search, capability filters, and galleries. It uses the native React entry point rather than an iframe or custom element.

Requires Node.js 20.9 or newer and `@seamapi/react` 5.4.0 or newer.

## Run

Install this example's dependencies from this directory:

```sh
npm install
```

Create `.env.local` with an Ecosystem embed key whose allowed origins include the URL where you run the page:

```dotenv
NEXT_PUBLIC_ECOSYSTEM_EMBED_KEY=eco_live_your_embed_key
ECOSYSTEM_PAGE_ORIGIN=http://localhost:3000
```

An embed key is public browser configuration, not a Seam secret API key. The loader sends the configured page origin to Ecosystem for allowlist validation. Use a deployment-specific origin and a key that allows it for production and previews.

Run the development server:

```sh
npm run dev
```

Open `http://localhost:3000`. To inspect the production rendering and caching behavior:

```sh
npm run build
npm start
```

The page scopes both the server loader and component to August Access smart locks. Change `filters` in `app/page.jsx` to inspect another manufacturer or provider. Keep the loader and rendered component's filters, embed key, and endpoint identical.

## Rendering and freshness

`prefetchSupportedDevices` resolves embed-key scope and exclusions, fetches every device page, and loads the provider, manufacturer, and linked accessory records needed for the initial view. Each call uses a separate query cache and throws on failed reads or incomplete pagination. Excluded devices and providers are removed before serializing the state.

`EcosystemProvider` accepts that serializable state through `dehydratedState`. Next.js pre-renders the existing component with it; no separate static catalog needs to be maintained. Native device disclosures and links work without JavaScript. Search, filters, and photo interactions activate after hydration. For an unscoped catalog, the existing five-model preview per manufacturer still applies; showing the remaining models requires JavaScript.

`app/layout.jsx` imports the package CSS before rendering. CSS injection is disabled on the provider because the stylesheet is already present. This example uses the application's font rather than injecting a font after load.

The page and server fetches revalidate hourly. New renders use the refreshed Ecosystem responses; already hydrated queries become eligible for background refresh after one minute. Adjust the Next.js fetch/revalidation settings for your application. Cache Components applications should use their corresponding cache APIs instead of this example's route-segment setting. When caching complete loader results, include the endpoint, key, page origin, and filters in the cache identity, and bound the lifetime to the acceptable delay for key revocations and exclusion changes.

For local acceptance testing, `NEXT_PUBLIC_ECOSYSTEM_ENDPOINT` can point at an absolute fake Ecosystem URL accessible to both the Next.js server and browser. Keep test fixtures and real embed keys separate.

## Verify

1. Inspect the HTTP response or View Source: device names, model numbers, capability tables, requirement text, and accessory links should be HTML elements, not only serialized JSON.
2. Disable JavaScript, reload, and expand a device. Hardware and provider details should remain readable.
3. Enable JavaScript and reload. Search and multi-capability filtering should work without hydration errors or an initial empty/loading replacement.

This example does not change the hosted iframe embed. Rendering the iframe application on a server would not inline its device content into the parent documentation page.
