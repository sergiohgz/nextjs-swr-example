## Next.js + SWR example

Example using SWR in Next.js for SSR and client side request with minimal revalidation 

### _app.tsx

Configure SWR revalidation options

```typescript
revalidateIfStale: true, // perform revalidate when shallow navigation
revalidateOnFocus: false, // do not request for data when focus tab
revalidateOnMount: false, // trust server data is up to date and do not refetch
revalidateOnReconnect: false, // do not refresh a failed request
```
