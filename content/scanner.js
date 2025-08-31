(function () {
  function autoScroll(callback) {
    let totalHeight = 0;
    const distance = 500;
    const timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
      if (totalHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        callback();
      }
    }, 200);
  }

  function extractData() {
    const data = {
      article: {
        headline: document.querySelector("h1")?.innerText || "",
        description: document.querySelector("meta[name='description']")?.content || "",
        author: document.querySelector("[rel='author']")?.innerText || "",
        datePublished: document.querySelector("time")?.getAttribute("datetime") || ""
      },
      breadcrumb: Array.from(document.querySelectorAll("nav[aria-label='breadcrumb'] li, .breadcrumb li"))
        .map((el, i) => ({ position: i + 1, name: el.innerText.trim(), item: el.querySelector("a")?.href || "" })),
      faq: Array.from(document.querySelectorAll("details")).map(d => ({
        question: d.querySelector("summary")?.innerText || "",
        answer: d.innerText.replace(d.querySelector("summary")?.innerText || "", "").trim()
      })),
      localBusiness: {
        name: document.querySelector("h1")?.innerText || "",
        address: document.querySelector("address")?.innerText || "",
        phone: document.querySelector("a[href^='tel:']")?.innerText || "",
        website: location.href
      },
      organization: {
        name: document.querySelector("meta[property='og:site_name']")?.content || document.title,
        url: location.origin,
        logo: document.querySelector("img[alt*='logo' i]")?.src || ""
      },
      profile: {
        name: document.querySelector("h1")?.innerText || "",
        jobTitle: document.querySelector("[itemprop='jobTitle']")?.innerText || "",
        image: document.querySelector("img")?.src || ""
      }
    };
    return data;
  }

  autoScroll(() => {
    window.__SCHEMA_CRAFT_DATA__ = extractData();

  });
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanPage') {
      sendResponse({ data: window.__SCHEMA_CRAFT_DATA__ || extractData() });
    }
  });
})();
