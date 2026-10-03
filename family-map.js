const familyStops = {
  nakuru: {
    name: "Lake Nakuru National Park",
    region: "RIFT VALLEY / NATIONAL PARK",
    summary: "A compact safari stop known for lake scenery, birdlife and wildlife viewing. Good for a focused game-drive day.",
    activities: ["Family game drive", "Birdwatching", "Picnic at designated sites"],
    amenities: ["Lodges and camps in/near the park", "Picnic areas at designated sites", "Guided drives available"],
    tip: "Check the current lake and road conditions, park gates, picnic-site access and accommodation child policies before setting out.",
    x: 48, y: 29
  },
  mara: {
    name: "Maasai Mara National Reserve",
    region: "SOUTH-WEST / RESERVE",
    summary: "Big-sky wildlife country. A memorable safari for families who are comfortable with longer drives and early starts.",
    activities: ["Guided game drives", "Wildlife spotting", "Community-led cultural visits"],
    amenities: ["Family tent and lodge options vary", "Meals and transfers vary by camp", "Private guides can help tailor the pace"],
    tip: "Ask camps about minimum ages, drive lengths, child seats and seasonal access. Balloon flights have operator age and safety rules.",
    x: 38, y: 47
  },
  naivasha: {
    name: "Lake Naivasha & Hell’s Gate",
    region: "RIFT VALLEY / LAKE & OUTDOORS",
    summary: "A flexible lakeside base with options to stretch your legs, spot wildlife and spend time on the water with an approved operator.",
    activities: ["Guided nature walk or cycle at Hell’s Gate", "Boat trip with a licensed operator", "Birdwatching by the lake"],
    amenities: ["Family accommodation around Naivasha", "Picnic and rest stops vary by site", "Equipment and boat services are operator-dependent"],
    tip: "Check park rules, bicycle suitability, lake conditions and age/height limits with the activity operator before booking.",
    x: 53, y: 43
  },
  nairobi: {
    name: "Nairobi National Park",
    region: "NAIROBI / NATIONAL PARK",
    summary: "A surprisingly wild start or finish to a city stay, with wildlife viewing a short drive from Nairobi.",
    activities: ["Self-drive or guided game drive", "Wildlife and bird spotting", "Visit the Nairobi Safari Walk (check current opening)"],
    amenities: ["City hotels and family services nearby", "Designated picnic sites in the park", "Visitor facilities vary by entry point"],
    tip: "Allow time for traffic, verify current gate hours and fees, and check which facilities are open on your visit date.",
    x: 56, y: 51
  },
  amboseli: {
    name: "Amboseli National Park",
    region: "SOUTH / NATIONAL PARK",
    summary: "Open plains, wetlands and classic mountain views make this a rewarding place to slow down and watch wildlife.",
    activities: ["Guided game drive", "Elephant and bird spotting", "Sunrise landscape viewing"],
    amenities: ["Lodges and camps around the park", "Family rooms vary by property", "Picnic options at designated areas"],
    tip: "Check seasonal road conditions and ask your stay about family room capacity, drive timing and current park facilities.",
    x: 60, y: 68
  },
  "tsavo-west": {
    name: "Tsavo West National Park",
    region: "SOUTH-EAST / NATIONAL PARK",
    summary: "A varied landscape of hills, lava fields and springs. Plan a relaxed route: distances inside the park can take longer than they look.",
    activities: ["Wildlife game drive", "Mzima Springs visit (check access)", "Scenic stops and birdwatching"],
    amenities: ["Lodges and camps in and around the park", "Facilities differ by gate and property", "Guided drives available through operators"],
    tip: "Confirm access to specific sights, current road conditions and any age guidance for walking areas with park staff.",
    x: 72, y: 62
  },
  "tsavo-east": {
    name: "Tsavo East National Park",
    region: "SOUTH-EAST / NATIONAL PARK",
    summary: "A vast, open safari landscape. Pick one area to explore rather than trying to cover too much in one day.",
    activities: ["Game drive", "Wildlife and bird spotting", "Scenic lookout stops"],
    amenities: ["Lodges and camps around the park", "Picnic facilities at designated sites", "Services vary between park gates"],
    tip: "Plan fuel and drive time carefully. Check gate access, road status and accommodation facilities before travelling.",
    x: 80, y: 56
  },
  diani: {
    name: "Diani & the South Coast",
    region: "COAST / BEACH ESCAPE",
    summary: "A softer landing after a road trip: warm coast, easy beach time and optional ocean activities with local operators.",
    activities: ["Beach day and swimming where conditions are safe", "Snorkelling or boat trip with an operator", "Coastal food and village experiences"],
    amenities: ["Wide range of family accommodation", "Restaurants and shops nearby", "Pools and childcare depend on individual properties"],
    tip: "Check tides, swimming conditions, reef guidance and age limits for water activities. Choose operators who prioritise safety.",
    x: 86, y: 77
  }
};

document.querySelector(".family-hero-image").style.setProperty(
  "--card-image",
  `url("${window.TRAVEL_PLUG_IMAGES.hero}")`
);
document.querySelector(".family-cta-image").style.setProperty(
  "--card-image",
  `url("${window.TRAVEL_PLUG_IMAGES.closing}")`
);

const familyMenu = document.querySelector(".main-nav");
const familyMenuToggle = document.querySelector(".menu-toggle");
familyMenuToggle.addEventListener("click", () => {
  const expanded = familyMenuToggle.getAttribute("aria-expanded") === "true";
  familyMenuToggle.setAttribute("aria-expanded", String(!expanded));
  familyMenuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  familyMenu.classList.toggle("open", !expanded);
});
familyMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    familyMenu.classList.remove("open");
    familyMenuToggle.setAttribute("aria-expanded", "false");
    familyMenuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const familyMap = document.querySelector(".family-map-canvas");
const familyPopover = document.querySelector(".family-map-popover");
const familyPinButtons = [...document.querySelectorAll(".family-pin")];
function renderList(selector, items) {
  const list = document.querySelector(selector);
  list.replaceChildren(...items.map((item) => {
    const row = document.createElement("li");
    row.textContent = item;
    return row;
  }));
}
function selectFamilyStop(button) {
  const stop = familyStops[button.dataset.stop];
  familyPinButtons.forEach((pin) => {
    const selected = pin === button;
    pin.classList.toggle("selected", selected);
    pin.setAttribute("aria-pressed", String(selected));
  });
  document.querySelector(".family-popover-kicker").textContent = stop.region;
  document.querySelector("#family-popover-title").textContent = stop.name;
  document.querySelector(".family-popover-summary").textContent = stop.summary;
  renderList(".family-activities", stop.activities);
  renderList(".family-amenities", stop.amenities);
  document.querySelector(".family-popover-tip").textContent = `ROAD NOTE — ${stop.tip}`;

  familyPopover.hidden = false;
  const mapRect = familyMap.getBoundingClientRect();
  const pinRect = button.getBoundingClientRect();
  const pinX = pinRect.left + pinRect.width / 2 - mapRect.left;
  const pinY = pinRect.top + pinRect.height / 2 - mapRect.top;
  const horizontalInset = familyPopover.offsetWidth / 2 + 8;
  const verticalInset = familyPopover.offsetHeight + 36;
  const popupX = Math.min(mapRect.width - horizontalInset, Math.max(horizontalInset, pinX));
  const popupY = Math.min(mapRect.height - verticalInset, Math.max(10, pinY));
  familyPopover.style.left = `${popupX / mapRect.width * 100}%`;
  familyPopover.style.top = `${popupY / mapRect.height * 100}%`;
}
familyPinButtons.forEach((button, index) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("selected")));
  button.addEventListener("click", () => selectFamilyStop(button));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    familyPinButtons[(index + direction + familyPinButtons.length) % familyPinButtons.length].focus();
  });
});
document.querySelector(".family-popover-close").addEventListener("click", () => {
  familyPopover.hidden = true;
  familyPinButtons.find((pin) => pin.classList.contains("selected"))?.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") familyPopover.hidden = true;
});
window.addEventListener("resize", () => {
  if (familyPopover.hidden) return;
  const selectedPin = familyPinButtons.find((pin) => pin.classList.contains("selected"));
  if (selectedPin) selectFamilyStop(selectedPin);
});

window.onYouTubeIframeAPIReady = () => {
  const poster = document.querySelector(".family-hero-video-poster");
  new YT.Player("family-hero-player", {
    videoId: "osfiNAqiiDg",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      modestbranding: 1,
      mute: 1,
      playsinline: 1,
      playlist: "osfiNAqiiDg",
      rel: 0
    },
    events: {
      onReady: (event) => {
        event.target.mute();
        event.target.playVideo();
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          poster.classList.add("is-playing");
        }
        if (event.data === YT.PlayerState.ENDED) {
          event.target.playVideo();
        }
      },
      onError: () => {
        poster.classList.remove("is-playing");
      }
    }
  });
};
