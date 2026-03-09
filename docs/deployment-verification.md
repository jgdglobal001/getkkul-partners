# Deployment Verification Checklist

## 1. Local pre-deploy checks

Preferred commands:

```bash
npm run verify:core
npm run verify:deploy
```

- `verify:core` runs TypeScript, targeted lint, and the Next production build.
- `verify:deploy` is the standard deployment verification entry point.

## 2. Native Windows note

`@cloudflare/next-on-pages` is unreliable on native Windows in this repository.

- On native Windows, `verify:deploy` completes the local core checks and then stops.
- In that environment, treat the Cloudflare Pages build/deploy log as the authoritative Pages adapter verification.
- If a local Pages adapter build is required, run `npm run build:pages` under WSL or Linux/macOS.

## 3. Cloudflare build log pass criteria

After deployment, confirm all of the following in the build log:

1. `Success: Your site was deployed!`
2. `Compiled Worker successfully`
3. `Success: Assets published!`
4. Next route output contains:
   - `/api/auth/[...nextauth]`
   - `/api/business-registration`
   - `/api/verify-business`
5. Edge Function Routes contain the same three routes.
6. Function bundles are generated for:
   - `api/auth/[...nextauth].func.js`
   - `api/business-registration.func.js`
   - `api/verify-business.func.js`

## 4. Known non-blocking warnings

The following warnings are currently tracked but are not automatic deploy blockers by themselves:

- `Build environment variables: (none found)`
- `1 critical severity vulnerability`
- `@cloudflare/next-on-pages` deprecated warning
- `baseline-browser-mapping` outdated warning
- `Invalid prerender config for /dashboard/notices/[id]`

If one of the pass criteria in section 3 fails, treat the deployment as failed even if some of the warnings above are present.