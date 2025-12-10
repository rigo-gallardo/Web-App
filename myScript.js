// Sample entertainment data (all <= $50)
const activities = [
  {
    id: 1,
    name: "Downtown Indie Concert Night",
    location: "San Jose, CA 95112",
    description:
      "Live indie bands every Friday night in a cozy downtown venue. Standing room with a small lounge area.",
    daysHours: "Fri–Sat: 7:00 PM – 11:30 PM",
    price: 35,
    availability: "Available",
    type: "Concert",
    image:
      "https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Retro Arcade & Pinball",
    location: "Fremont, CA 94538",
    description:
      "Unlimited play on classic arcade machines and modern games. Great for groups and date nights.",
    daysHours: "Mon–Thu: 3 PM – 10 PM · Fri–Sun: 12 PM – 11 PM",
    price: 25,
    availability: "Available",
    type: "Arcade",
    image:
      "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Laugh Factory Open Mic",
    location: "Oakland, CA 94612",
    description:
      "Open mic comedy with a mix of new and experienced comedians. Expect some hits and some misses—but always laughs.",
    daysHours: "Wed–Thu: 8 PM – 10 PM",
    price: 15,
    availability: "Limited",
    type: "Comedy",
    image:
      "https://images.pexels.com/photos/2308863/pexels-photo-2308863.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "City Lights Art Museum",
    location: "San Francisco, CA 94102",
    description:
      "Modern and contemporary art museum with rotating exhibits and student discounts on Thursdays.",
    daysHours: "Tue–Sun: 10 AM – 6 PM",
    price: 18,
    availability: "Available",
    type: "Museum",
    image:
      "https://images.pexels.com/photos/208636/pexels-photo-208636.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    name: "Sunset Rooftop Yoga",
    location: "Hayward, CA 94544",
    description:
      "Relaxing rooftop yoga session with a sunset view, perfect for unwinding after a long week.",
    daysHours: "Sat–Sun: 6 PM – 7:15 PM",
    price: 20,
    availability: "Limited",
    type: "Outdoor",
    image:
      "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Escape Room: Tech Heist",
    location: "Santa Clara, CA 95050",
    description:
      "Team up with friends to pull off a high-tech heist in this immersive puzzle-based escape room.",
    daysHours: "Fri–Sun: 12 PM – 10 PM",
    price: 40,
    availability: "Available",
    type: "Outdoor", // you can change type categories if you like
    image:
      "https://images.pexels.com/photos/2048291/pexels-photo-2048291.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

// DOM elements
const resultsContainer = document.getElementById("resultsContainer");
const filterForm = document.getElementById("filterForm");
const quickSearchForm = document.getElementById("quickSearchForm");
const locationInput = document.getElementById("locationInput");
const typeSelect = document.getElementById("typeSelect");
const maxPriceInput = document.getElementById("maxPriceInput");
const availabilitySelect = document.getElementById("availabilitySelect");
const heroLocationInput = document.getElementById("heroLocationInput");
const heroTypeSelect = document.getElementById("heroTypeSelect");
const resultsCountBadge = document.getElementById("resultsCountBadge");
const yearSpan = document.getElementById("yearSpan");

// Utility: update year in footer
yearSpan.textContent = new Date().getFullYear();

// Render cards to the page
function renderActivities(list) {
  resultsContainer.innerHTML = "";

  if (list.length === 0) {
    resultsContainer.innerHTML =
      '<div class="col-12 text-center text-muted py-4">No results found. Try changing your filters.</div>';
    resultsCountBadge.textContent = "0 results";
    return;
  }

  list.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4";

    const availabilityClass =
      item.availability === "Available"
        ? "badge-availability-available"
        : "badge-availability-limited";

    col.innerHTML = `
      <div class="card ent-card h-100 shadow-sm">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="card-img-top ent-img"
        />
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${item.name}</h5>
            <span class="badge ${availabilityClass} ms-2">
              ${item.availability}
            </span>
          </div>
          <p class="text-muted small mb-1">${item.location}</p>
          <span class="badge text-bg-secondary mb-2">${item.type}</span>
          <p class="card-text small flex-grow-1">
            ${item.description}
          </p>
          <ul class="list-unstyled small mb-2">
            <li><strong>Price:</strong> $${item.price.toFixed(2)}</li>
            <li><strong>Days/Hours:</strong> ${item.daysHours}</li>
          </ul>
          <button class="btn btn-outline-primary btn-sm mt-auto" disabled>
            Book (demo only)
          </button>
        </div>
      </div>
    `;

    resultsContainer.appendChild(col);
  });

  resultsCountBadge.textContent =
    list.length === 1 ? "1 result" : `${list.length} results`;
}

// Filtering function
function filterActivities(filters) {
  const {
    locationQuery = "",
    type = "all",
    maxPrice = 50,
    availability = "any"
  } = filters;

  const normalizedLocation = locationQuery.trim().toLowerCase();

  const filtered = activities.filter((activity) => {
    // price constraint: must be <= maxPrice
    if (activity.price > maxPrice) return false;

    // location match (substring check)
    if (
      normalizedLocation &&
      !activity.location.toLowerCase().includes(normalizedLocation)
    ) {
      return false;
    }

    // type match
    if (type !== "all" && activity.type !== type) {
      return false;
    }

    // availability match
    if (availability !== "any" && activity.availability !== availability) {
      return false;
    }

    return true;
  });

  renderActivities(filtered);
}

// Initial render (show all under $50)
filterActivities({});

// Handle main filter form
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const filters = {
    locationQuery: locationInput.value,
    type: typeSelect.value,
    maxPrice: Number(maxPriceInput.value) || 50,
    availability: availabilitySelect.value
  };

  filterActivities(filters);
});

// Handle quick search form in hero
quickSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Copy hero filters into main filter inputs for consistency
  locationInput.value = heroLocationInput.value;
  typeSelect.value = heroTypeSelect.value;
  maxPriceInput.value = 50; // app constraint: always $50 or less
  availabilitySelect.value = "any";

  filterActivities({
    locationQuery: heroLocationInput.value,
    type: heroTypeSelect.value,
    maxPrice: 50,
    availability: "any"
  });

  // Scroll smoothly to explore section
  const exploreSection = document.getElementById("explore");
  if (exploreSection) {
    exploreSection.scrollIntoView({ behavior: "smooth" });
  }
});
