let feedItems = [];       // Array to store all feed items
//let currentItemIndex = 0; // Tracks how many items have been loaded
//const itemsPerPage = 10;  // Number of items to load per batch

// --- Feed Pagination Code ---

// Global variable to track the current feed page
let currentPage = 1;

function fetchFeedPage(page) {
  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Loading...";
  }

  // Use Thing Proxy as a CORS proxy
  const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
  let originalFeedUrl = 'https://www.whitehouse.gov/presidential-actions/feed/';
  
  if (page > 1) {
    originalFeedUrl += '?paged=' + page;
  }
  
  const feedUrl = proxyUrl + originalFeedUrl;
  
  fetch(feedUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(str => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "text/xml");
      
      const items = xmlDoc.querySelectorAll("item");
      console.log("Fetched page", page, "with", items.length, "items");
      
      const tableBody = document.getElementById("table-body");
      if (!tableBody) {
        throw new Error("Table body element not found!");
      }
      
      items.forEach(item => {
        const title = item.querySelector("title")?.textContent || "No Title";
        const pubDate = item.querySelector("pubDate")?.textContent || "No Date";
        const link = item.querySelector("link")?.textContent || "#";
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><a href="${link}" target="_blank" class="feed-title">${title}</a></td>
          <td>${pubDate}</td>
        `;
        
        tableBody.appendChild(tr);
      });
      
      if (items.length < 10) {
        if (loadMoreBtn) {
          loadMoreBtn.style.display = "none";
        }
        console.log("No more items available; hiding Load More button.");
      } else if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
      }
    })
    .catch(error => {
      console.error("Error fetching feed:", error);
      const tableBody = document.getElementById("table-body");
      if (tableBody) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td colspan="3" class="error-message">
            Error loading feed. Please try again later.
          </td>
        `;
        tableBody.appendChild(tr);
      }
      if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Try Again";
      }
    });
}

function loadMore() {
  currentPage++;
  fetchFeedPage(currentPage);
}

// Wait for DOM to be fully loaded before attaching events
document.addEventListener('DOMContentLoaded', function() {
  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMore);
  }

  // Fetch the first page of the feed
  fetchFeedPage(currentPage);
});

// Remove or comment out the unused functions and variables
// Removing: loadNextItems(), fetchFeed() call, and unused variables