/// Wrap everything so it only runs after the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded. Initializing Easy Entertainment JS...");

  // ---- Data (mini database) ----
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
      type: "Outdoor",
      image:
        "https://images.pexels.com/photos/2048291/pexels-photo-2048291.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  // ---- Grab DOM elements safely ----
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

  // Check that we actually found the important elements
  console.log("Elements found:", {
    resultsContainer,
    filterForm,
    quickSearchForm,
    locationInput,
    typeSelect,
    maxPriceInput,
    availabilitySelect,
    heroLocationInput,
    heroTypeSelect,
    resultsCountBadge
  });

  if (!resultsContainer) {
    console.error("resultsContainer is missing from the HTML.");
  }

  // ---- Utility: year in footer ----
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ---- Rendering function ----
  function renderActivities(list) {
    if (!resultsContainer) return;

    resultsContainer.innerHTML = "";

    if (list.length === 0) {
      resultsContainer.innerHTML =
        '<div class="col-12 text-center text-muted py-4">No results found. Try changing your filters.</div>';
      if (resultsCountBadge) resultsCountBadge.textContent = "0 results";
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

    if (resultsCountBadge) {
      resultsCountBadge.textContent =
        list.length === 1 ? "1 result" : `${list.length} results`;
    }
  }

  // ---- Filtering logic ----
  function filterActivities(filters) {
    const {
      locationQuery = "",
      type = "all",
      maxPrice = 50,
      availability = "any"
    } = filters;

    console.log("Filtering with:", filters);

    const normalizedLocation = locationQuery.trim().toLowerCase();

    const filtered = activities.filter((activity) => {
      // price constraint
      if (activity.price > maxPrice) return false;

      // location
      if (
        normalizedLocation &&
        !activity.location.toLowerCase().includes(normalizedLocation)
      ) {
        return false;
      }

      // type
      if (type !== "all" && activity.type !== type) {
        return false;
      }

      // availability
      if (availability !== "any" && activity.availability !== availability) {
        return false;
      }

      return true;
    });

    renderActivities(filtered);
  }

  // ---- Initial render (show all) ----
  filterActivities({});

  // ---- Main filter form ----
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Main Filter form submitted");

      const filters = {
        locationQuery: locationInput ? locationInput.value : "",
        type: typeSelect ? typeSelect.value : "all",
        maxPrice: maxPriceInput
          ? Number(maxPriceInput.value) || 50
          : 50,
        availability: availabilitySelect
          ? availabilitySelect.value
          : "any"
      };

      filterActivities(filters);
    });
  } else {
    console.warn("filterForm not found; main filters will not work.");
  }

  // ---- Hero quick search form ----
  if (quickSearchForm) {
    quickSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Hero Quick Search form submitted");

      const heroLocation = heroLocationInput ? heroLocationInput.value : "";
      const heroType = heroTypeSelect ? heroTypeSelect.value : "all";

      // Optional: mirror into main filters so the UI stays in sync
      if (locationInput) locationInput.value = heroLocation;
      if (typeSelect) typeSelect.value = heroType;
      if (maxPriceInput) maxPriceInput.value = 50;
      if (availabilitySelect) availabilitySelect.value = "any";

      filterActivities({
        locationQuery: heroLocation,
        type: heroType,
        maxPrice: 50,
        availability: "any"
      });

      // Smooth scroll to the results section
      const exploreSection = document.getElementById("explore");
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  } else {
    console.warn("quickSearchForm not found; hero quick search will not work.");
  }
});

