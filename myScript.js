// ======================
// Easy Entertainment + Airtable integration
// ======================

// const AIRTABLE_TOKEN = "patgNAzw1vKO0Fkr1";
const AIRTABLE_TOKEN =
  "patCdUZGzfafb2IP8.ab0e3d2092768d760e68f7481e2d95d66fbad72fe593eb46e7a6d8c8e005e4a6";
const AIRTABLE_BASE_ID = "appd33EXntArOAdoG";
const AIRTABLE_TABLE_NAME = "Activities"; // EXACT table name

// This will hold activities loaded from Airtable
let activities = [];

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded – initializing Easy Entertainment…");

  // Grab DOM elements
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

  // Footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // --------------------
  // Render cards
  // --------------------
  function renderActivities(list) {
    if (!resultsContainer) return;

    resultsContainer.innerHTML = "";

    if (!list || list.length === 0) {
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
            <p class="text-muted small mb-1">${item.city} · ${item.address}</p>
            <span class="badge text-bg-secondary mb-2">${item.type}</span>
            <p class="card-text small flex-grow-1">
              ${item.description}
            </p>
            <ul class="list-unstyled small mb-2">
              <li><strong>Price:</strong> $${item.price.toFixed(2)}</li>
              <li><strong>Days/Hours:</strong> ${item.daysHours}</li>
            </ul>
            <a
              href="${item.url}"
              target="_blank"
              class="btn btn-outline-primary btn-sm mt-auto"
            >
              View Website
            </a>
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

  // --------------------
  // Filter logic
  // --------------------
  function filterActivities(filters) {
    const {
      locationQuery = "",
      type = "all",
      maxPrice = 50,
      availability = "any",
    } = filters;

    const normalizedLocation = locationQuery.trim().toLowerCase();

    const filtered = activities.filter((activity) => {
      // price
      if (activity.price > maxPrice) return false;

      // location / city / address search (ZIP, city name, etc.)
      const searchableLocation =
        `${activity.city} ${activity.address}`.toLowerCase();
      if (
        normalizedLocation &&
        !searchableLocation.includes(normalizedLocation)
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

  function populateLocationList(activities) {
    const locationList = document.getElementById("location-list");
    const heroLocationList = document.getElementById("hero-location-list");
    if (locationList || heroLocationList) {
      const uniqueLocations = new Set(
        activities.map((activity) => activity.city),
      );
      const uniqueLocationsArray = Array.from(uniqueLocations);
      console.log("Unique locations:", uniqueLocationsArray);
      uniqueLocationsArray.sort();
      if (heroLocationList) {
        heroLocationList.value = "";
        heroLocationList.innerHTML = uniqueLocationsArray
          .map((location) => `<option>${location}</option>`)
          .join("");
      }
      if (locationList) {
        locationList.value = "";
        locationList.innerHTML = uniqueLocationsArray
          .map((location) => `<option>${location}</option>`)
          .join("");
      }
    }
  }

  // --------------------
  // Load from Airtable
  // --------------------
  async function loadActivitiesFromAirtable() {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE_NAME,
    )}?maxRecords=100&view=Grid%20view`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error(
          "Error from Airtable:",
          response.status,
          response.statusText,
        );
        renderActivities([]);
        return;
      }

      const data = await response.json();
      console.log("Raw Airtable data:", data);

      // Map Airtable records → our app format
      activities = (data.records || []).map((record) => {
        const f = record.fields || {};
        return {
          id: record.id,
          name: f["Name"] || "Untitled",
          city: f["City"] || "",
          address: f["Address"] || "",
          description: f["Description"] || "",
          daysHours: f["Days & Hours"] || "",
          price: Number(f["Price"] || 0),
          availability: f["Availability"] || "Available",
          type: f["Type"] || "Other",
          url: f["Web-Site"] || "#",
          image:
            f["Image"] && Array.isArray(f["Image"]) && f["Image"][0]
              ? f["Image"][0].url
              : "https://via.placeholder.com/400x250?text=No+Image",
        };
      });

      console.log("Mapped activities:", activities);
      populateLocationList(activities);

      // Initial render
      filterActivities({});
    } catch (err) {
      console.error("Failed to load from Airtable:", err);
      renderActivities([]);
    }
  }

  // --------------------
  // Hook up forms
  // --------------------
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Main filter submitted");

      const filters = {
        locationQuery: locationInput ? locationInput.value : "",
        type: typeSelect ? typeSelect.value : "all",
        maxPrice: maxPriceInput ? Number(maxPriceInput.value) || 50 : 50,
        availability: availabilitySelect ? availabilitySelect.value : "any",
      };

      filterActivities(filters);
    });
  }

  if (quickSearchForm) {
    quickSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Hero quick search submitted");

      const heroLocation = heroLocationInput ? heroLocationInput.value : "";
      const heroType = heroTypeSelect ? heroTypeSelect.value : "all";

      // Mirror into main filters
      if (locationInput) locationInput.value = heroLocation;
      if (typeSelect) typeSelect.value = heroType;
      if (maxPriceInput) maxPriceInput.value = 50;
      if (availabilitySelect) availabilitySelect.value = "any";

      filterActivities({
        locationQuery: heroLocation,
        type: heroType,
        maxPrice: 50,
        availability: "any",
      });

      const exploreSection = document.getElementById("explore");
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Actually load data
  loadActivitiesFromAirtable();
});

// When the DOM is fully loaded, add event listeners to the navbar links
document.addEventListener("DOMContentLoaded", () => {
  // Get the navbar collapse element
  const navbarCollapse = document.querySelector(".navbar-collapse");

  // Get all navbar links including the navbar-brand
  const navbarLinks = document.querySelectorAll(".navbar a");

  // Add an event listener to each navbar link
  navbarLinks.forEach((navbarLink) =>
    navbarLink.addEventListener("click", (event) => {
      // When a navbar link is clicked, remove the "show" class from the navbar collapse element
      navbarCollapse.classList.remove("show");
      // Remove the "active" class from all navbar links
      navbarLinks.forEach((navbarLink) => {
        navbarLink.classList.remove("active");
      });
      // Add the "active" class to the clicked navbar link
      event.target.classList.add("active");
      // Stop the event from propagating to Bootstrap event handlers
      event.stopPropagation();
    }),
  );

  // Add an event listener to the navbar toggle button to handle the click event
  document
    .querySelector(".navbar-toggler")
    .addEventListener("click", (event) => {
      // When the navbar toggle button is clicked, add the "show" class to the navbar collapse element
      navbarCollapse.classList.toggle("show");
      // Stop the event from propagating to the body event handler
      event.stopPropagation();
    });

  // Add an event listener to the body to handle the click event
  document.body.addEventListener("click", () => {
    // When the body is clicked, remove the "show" class from the navbar collapse element
    navbarCollapse.classList.remove("show");
  });
});
