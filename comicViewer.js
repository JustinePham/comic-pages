let comicData;
let currentChapterIndex = 1;
let currentPageIndex = 1;

// Load comic data
async function loadComicData() {
  const response = await fetch('https://justinepham.github.io/comic-pages//comicData.json', {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  comicData = await response.json();
  console.log(comicData)
  setupViewer();
}

// Initialize the viewer
function setupViewer() {
  const chapterSelect = document.getElementById("chapter-select");
  const pageSelect = document.getElementById("page-select");

  // Populate chapter dropdown
  comicData.chapters.forEach((chapter, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = chapter.title;
    chapterSelect.appendChild(option);
  });

  // Set event listeners
  document.getElementById("prev-page").addEventListener("click", prevPage);
  document.getElementById("next-page").addEventListener("click", nextPage);
  chapterSelect.addEventListener("change", (e) => loadChapter(e.target.value));
  pageSelect.addEventListener("change", (e) => loadPage(e.target.value));

  // Load the initial chapter and page
  loadChapter(0);
}

// Load selected chapter
function loadChapter(chapterIndex) {
  currentChapterIndex = parseInt(chapterIndex);
  currentPageIndex = 0;

  const chapter = comicData.chapters[currentChapterIndex];
  document.getElementById("chapter-title").innerText = chapter.title;

  // Populate page dropdown
  const pageSelect = document.getElementById("page-select");
  pageSelect.innerHTML = ""; // Clear existing options
  chapter.pages.forEach((page, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `Page ${page.page}`;
    pageSelect.appendChild(option);
  });

  // Load the first page of the selected chapter
  loadPage(0);
}

// Load selected page
function loadPage(pageIndex) {
  currentPageIndex = parseInt(pageIndex);
  const page = comicData.chapters[currentChapterIndex].pages[currentPageIndex];

  // Display the resized image
  const comicImage = document.getElementById("comic-image");
  resizeImage(page.url, 800, 600).then(resizedImageUrl => {
    comicImage.src = resizedImageUrl;
  });
// Update the page dropdown selection
  document.getElementById("page-select").value = currentPageIndex;
}

// Resize the image to a lower resolution using Canvas
async function resizeImage(url, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow cross-origin if images are hosted on another domain
    img.onload = () => {
      // Create a canvas element to resize the image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Draw the image onto the canvas with the specified dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to a base64 URL
      resolve(canvas.toDataURL("image/jpeg", 0.8)); // Use JPEG and 0.7 quality to reduce size
    };
    img.onerror = reject;
    img.src = url;
  });
}

function nextPage() {
  const chapter = comicData.chapters[currentChapterIndex];
  if (currentPageIndex < chapter.pages.length - 1) {
    loadPage(currentPageIndex + 1);
  }
}

function prevPage() {
  if (currentPageIndex > 0) {
    loadPage(currentPageIndex - 1);
  }
}

// Load comic data on startup
loadComicData();
