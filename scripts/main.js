let feedItems = [];       // Array to store all feed items
//let currentItemIndex = 0; // Tracks how many items have been loaded
//const itemsPerPage = 10;  // Number of items to load per batch

// --- Feed Pagination Code ---

// Global variable to track the current feed page
let currentPage = 1;

function fetchFeedPage(page) {
  const loadMoreBtn = document.getElementById("load-more");
  const tableBody = document.getElementById("table-body");
  
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Loading...";
  }

  // Clear error messages when loading new page
  if (tableBody) {
    const errorRows = tableBody.querySelectorAll('.error-message');
    errorRows.forEach(row => row.remove());
  }

  // Add loading indicator only for first page
  if (tableBody && page === 1) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="2" class="loading-message">
          Loading feed...
        </td>
      </tr>
    `;
  }
  
  // Build the original feed URL with pagination support.
  let originalFeedUrl = 'https://www.whitehouse.gov/presidential-actions/feed/';
  if (page > 1) {
    originalFeedUrl += '?paged=' + page;
  }
  
  // Update the proxy URL to point to your Vercel serverless function.
  // Replace "your-project-name" with your actual Vercel project domain.
  const proxyUrl = 'https://presidential-actions-cwgxcpufg-mharcenes-projects.vercel.app/api/cors?url=';
  const feedUrl = proxyUrl + encodeURIComponent(originalFeedUrl);
  
  fetch(feedUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      return response.text();
    })
    .then(str => {
      // Add XML parsing error check
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "text/xml");
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML feed format');
      }
      
      const items = xmlDoc.querySelectorAll("item");
      console.log("Fetched page", page, "with", items.length, "items");
      
      if (!tableBody) {
        throw new Error("Table body element not found!");
      }
      
      items.forEach(item => {
        const title = item.querySelector("title")?.textContent || "No Title";
        const rawDate = item.querySelector("pubDate")?.textContent;
        const pubDate = rawDate ? new Date(rawDate).toLocaleDateString() : "No Date";
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
      if (tableBody) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td colspan="2" class="error-message">
            Error loading feed: ${error.message}
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