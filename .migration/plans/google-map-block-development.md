# Google Map Block Development Plan

## Summary

Create a new `blocks/google-map/` block that renders an interactive Google Map. The block reads an authorable address or latitude/longitude coordinates from the authored table, retrieves the Google Maps API key from the site's placeholders sheet (`/placeholders.json`), and lazy-loads the Google Maps JavaScript API via IntersectionObserver to preserve Lighthouse performance scores.

## Project Context

**Key findings from codebase analysis:**
- `fetchPlaceholders` is **NOT** exported from this project's `aem.js` — a custom fetch to `/placeholders.json` is needed
- `loadScript` IS available from `aem.js` — can use for dynamic script loading
- `readBlockConfig` IS available — useful for key/value block patterns
- No existing google-map or embed block in the project

## Content Model Design

### Block Type
**Configuration** — Key/value pairs that control the map display behavior.

### Authored Table Structure (DA.live)

| Google Map |
|------------|
| address | 123 Main Street, New York, NY 10001 |

**OR (latitude/longitude):**

| Google Map |
|------------|
| latitude | 40.7128 |
| longitude | -74.0060 |
| zoom | 15 |

### Configuration Keys

| Key | Required | Description | Default |
|-----|----------|-------------|---------|
| `address` | Yes (if no lat/lng) | Street address to geocode and display | — |
| `latitude` | Yes (if no address) | Latitude coordinate | — |
| `longitude` | Yes (if no address) | Longitude coordinate | — |
| `zoom` | No | Map zoom level (1-20) | `14` |

### Placeholders Sheet Requirement

The site's `/placeholders.json` must include a row:

| Key | Value |
|-----|-------|
| googlemapsapikey | `AIza...your-key-here` |

## Proposed Implementation

### `google-map.js`

Key logic:
1. Import `readBlockConfig` and `loadScript` from `aem.js`
2. Read block config (address, latitude, longitude, zoom)
3. Create a placeholder container div for the map
4. Set up IntersectionObserver on the container
5. When block enters viewport:
   - Fetch `/placeholders.json` to get `googlemapsapikey`
   - Load Google Maps JS API via `loadScript` with the key
   - Initialize map with either lat/lng directly or geocode the address
6. Handle errors gracefully (missing API key, invalid address)

```js
import { readBlockConfig, loadScript } from '../../scripts/aem.js';

async function fetchPlaceholders() {
  const resp = await fetch('/placeholders.json');
  const json = await resp.json();
  const placeholders = {};
  json.data.forEach((row) => { placeholders[row.Key] = row.Value; });
  return placeholders;
}

export default function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  const mapContainer = document.createElement('div');
  mapContainer.className = 'google-map-container';
  block.append(mapContainer);

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      const placeholders = await fetchPlaceholders();
      const apiKey = placeholders.googlemapsapikey;
      if (!apiKey) return;
      await loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`);
      // Initialize map with config (address or lat/lng)
    }
  });
  observer.observe(mapContainer);
}
```

### `google-map.css`

Key properties:
- Block container: full width, `min-height: 400px` (prevents CLS)
- Map container: `width: 100%`, `height: 400px`, `border-radius: 8px`
- Responsive: height adjusts on mobile (300px)
- Loading placeholder with light grey background before map loads

### Placeholders Fetch Strategy

Since `fetchPlaceholders` is not in this project's `aem.js`, the block includes a local utility function that:
1. Fetches `/placeholders.json` (standard EDS placeholders sheet)
2. Parses the `data` array into a key/value object
3. Returns the `googlemapsapikey` value

This is lazy-loaded inside the IntersectionObserver callback, so it never fires unless the map is about to become visible.

## Performance Optimizations

| Technique | Benefit |
|-----------|---------|
| IntersectionObserver lazy-load | Google Maps API (~200KB) only loads when block is near viewport |
| `min-height` on container | Prevents Cumulative Layout Shift (CLS) |
| No eager script loading | Zero impact on LCP and FCP |
| Placeholder background | Visual affordance while map loads |
| API key from placeholders | No hardcoded secrets in codebase |

## Files to Create

| File | Action |
|------|--------|
| `blocks/google-map/google-map.js` | Create new |
| `blocks/google-map/google-map.css` | Create new |

## Checklist

- [ ] Create directory `blocks/google-map/`
- [ ] Write `google-map.js` — readBlockConfig, IntersectionObserver lazy-load, placeholders fetch, Google Maps API initialization with geocoding fallback
- [ ] Write `google-map.css` — min-height for CLS prevention, responsive map container, border-radius, loading state
- [ ] Run ESLint on `google-map.js` — verify no errors
- [ ] Run Stylelint on `google-map.css` — verify no errors
- [ ] Verify JS syntax with `node --check`
- [ ] Generate sample authored plain HTML content

## Edge Cases & Error Handling

- **Missing API key:** Block shows a "Map unavailable" message instead of crashing
- **Invalid address:** Geocoding failure shows address text as fallback
- **No coordinates AND no address:** Block renders empty with a gentle error message
- **Offline/blocked API:** Container maintains its reserved height, shows placeholder

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
