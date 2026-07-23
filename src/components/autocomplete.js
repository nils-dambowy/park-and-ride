import { nominatimApi } from '../services/api/nominatimApi.js';

export function setupAutocomplete(inputEl, resultsContainerEl, onSelectLocation) {
  if (!inputEl || !resultsContainerEl) return;

  let debounceTimer = null;

  inputEl.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = inputEl.value;

    if (query.trim().length < 2) {
      resultsContainerEl.innerHTML = '';
      resultsContainerEl.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      const results = await nominatimApi.searchLocations(query);
      
      if (results.length === 0) {
        resultsContainerEl.style.display = 'none';
        return;
      }

      resultsContainerEl.innerHTML = results.map(r => `
        <div class="autocomplete-item" data-lat="${r.lat}" data-lng="${r.lng}" data-name="${r.displayName.replace(/"/g, '&quot;')}">
          📍 <b>${r.shortName}</b> <span class="text-muted">(${r.displayName})</span>
        </div>
      `).join('');

      resultsContainerEl.style.display = 'block';

      // Bind click
      resultsContainerEl.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const lat = parseFloat(item.getAttribute('data-lat'));
          const lng = parseFloat(item.getAttribute('data-lng'));
          const name = item.getAttribute('data-name');
          
          inputEl.value = name;
          resultsContainerEl.style.display = 'none';

          if (onSelectLocation) {
            onSelectLocation({ name, coords: { lat, lng } });
          }
        });
      });
    }, 300);
  });

  // Hide on click outside
  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !resultsContainerEl.contains(e.target)) {
      resultsContainerEl.style.display = 'none';
    }
  });
}
