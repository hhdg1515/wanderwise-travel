const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const list = document.getElementById('recommendations');
const status = document.getElementById('resultsStatus');
const title = document.getElementById('resultsTitle');
let travelData;

async function loadDestinations() {
  if (travelData) return travelData;
  const response = await fetch('./travel_recommendation_api.json');
  if (!response.ok) throw new Error(`Unable to load destination data (${response.status})`);
  travelData = await response.json();
  return travelData;
}

function getCategory(keyword) {
  const query = keyword.toLowerCase().trim();
  if (/beach|beaches/.test(query)) return 'beaches';
  if (/temple|temples/.test(query)) return 'temples';
  if (/countr|countries/.test(query)) return 'countries';
  return null;
}

function getMatches(data, category) {
  if (category === 'countries') {
    return data.countries.flatMap(country => country.cities.map(city => ({ ...city, label: country.name })));
  }
  return data[category].map(destination => ({ ...destination, label: category === 'beaches' ? 'BEACH ESCAPE' : 'CULTURAL HERITAGE' }));
}

function showMessage(heading, description) {
  list.replaceChildren();
  const article = document.createElement('article');
  article.className = 'empty';
  const h3 = document.createElement('h3');
  h3.textContent = heading;
  const p = document.createElement('p');
  p.textContent = description;
  article.append(h3, p);
  list.append(article);
}

function showCards(destinations) {
  list.replaceChildren();
  destinations.forEach(destination => {
    const card = document.createElement('article');
    card.className = 'destination-card';
    const img = document.createElement('img');
    img.src = destination.imageUrl;
    img.alt = destination.name;
    img.loading = 'lazy';
    const content = document.createElement('div');
    content.className = 'card-copy';
    const label = document.createElement('span');
    label.className = 'card-label';
    label.textContent = destination.label;
    const heading = document.createElement('h3');
    heading.textContent = destination.name;
    const description = document.createElement('p');
    description.textContent = destination.description;
    content.append(label, heading, description);
    card.append(img, content);
    list.append(card);
  });
}

async function searchDestinations(keyword) {
  const category = getCategory(keyword);
  if (!category) {
    title.textContent = 'No matches found';
    status.textContent = 'Use a destination category to get started.';
    showMessage('Try a different keyword', 'Search for beach, beaches, temple, temples, country, or countries.');
    return;
  }
  title.textContent = `${category[0].toUpperCase()}${category.slice(1)} to explore`;
  status.textContent = 'Finding recommendations...';
  try {
    const data = await loadDestinations();
    const matches = getMatches(data, category);
    showCards(matches);
    status.textContent = `${matches.length} recommendations found`;
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    status.textContent = 'Data unavailable';
    showMessage('Could not load destinations', 'Please open the site through a web server or GitHub Pages and try again.');
    console.error(error);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  searchDestinations(input.value);
});
clearButton.addEventListener('click', () => {
  input.value = '';
  title.textContent = 'Find your perfect escape';
  status.textContent = 'Try searching for “beach”, “temple”, or “country”.';
  showMessage('Where will you go next?', 'Enter a keyword above to see handpicked destinations, photos, and short descriptions.');
  input.focus();
});
const initialQuery = new URLSearchParams(location.search).get('q');
if (initialQuery) { input.value = initialQuery; searchDestinations(initialQuery); }
