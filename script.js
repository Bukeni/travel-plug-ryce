const journeys = {
  "down-south": {
    title: "Down South.",
    kicker: "JOURNEY 01 / NAIROBI TO THE COAST",
    route: "NAIROBI → DONGO KUNDU → DIANI → MOMBASA → WATAMU",
    description: "750 kilometres between city noise and salt air. We rolled out before the sun, made a wrong turn before lunch, and found the coast the way you should: slowly. Some stretches were smooth, some were pure patience. The roadside stops made the miles.",
    distance: "750 KM", date: "AUGUST 2025", vehicle: "THE TRUSTY BIKE",
    image: "journey:down-south"
  },
  "into-the-wild": {
    title: "Into the Wild.",
    kicker: "JOURNEY 02 / REMOTE ROADS",
    route: "NAIROBI → THE BACK ROADS → SOMEWHERE QUIET",
    description: "The plan was to find a quiet road and follow it. Then the tarmac ran out, the phone lost signal and the landscape got very, very big. We aired down, asked for directions twice, and made it just before the light went.",
    distance: "430 KM", date: "SEPTEMBER 2025", vehicle: "4×4 / HIGH CLEARANCE",
    image: "journey:into-the-wild"
  },
  "mountain-routes": {
    title: "The Mountain Routes.",
    kicker: "JOURNEY 03 / CHYULU HILLS",
    route: "AMBOSELI ROAD → CHYULU HILLS → THE GREEN EDGE",
    description: "The air changed before the view did. We traded a clean road for red earth, got dust in every zip, and came over the rise to a stretch of green we hadn't earned on any itinerary. Bring layers, take your time, ask before crossing community land.",
    distance: "218 KM", date: "OCTOBER 2025", vehicle: "BIKE / GRAVEL TYRES",
    image: "journey:mountain-routes"
  },
  "coastal-stories": {
    title: "Coastal Stories.",
    kicker: "JOURNEY 04 / THE COAST",
    route: "DIANI → GAZI → MOMBASA → WATAMU",
    description: "We stopped for fresh madafu, stayed longer than planned, and let the coast set the pace. The best bits weren't the postcard beach; they were the food smoke at dusk, the boat ride that took its time and the people who made a stranger feel welcome.",
    distance: "310 KM", date: "AUGUST 2025", vehicle: "THE TRUSTY BIKE",
    image: "journey:coastal-stories"
  },
  samburu: {
    title: "Samburu & Beyond.",
    kicker: "JOURNEY 05 / NORTHERN FRONTIER",
    route: "NANYUKI → ISIOLO → SAMBURU",
    description: "North of the familiar, the country opens up. This trip was about slowing down, listening more than talking and remembering that a place isn't a backdrop. Go with a local guide, give wildlife room and leave nothing behind.",
    distance: "360 KM", date: "COMING INTO FOCUS", vehicle: "4×4 / WITH A LOCAL GUIDE",
    image: "journey:samburu"
  },
  "roads-less-travelled": {
    title: "The Roads Less Travelled.",
    kicker: "JOURNEY 06 / THE UNPLANNED",
    route: "NO FIXED ROUTE → JUST KEEP AN EYE ON THE FUEL",
    description: "These are the turns without a neat ending. The road gets rough, the plan changes, someone offers directions and suddenly the unplanned stop is the story. Always check conditions with people who live there before setting off.",
    distance: "IT DEPENDS", date: "ALWAYS IN PROGRESS", vehicle: "WHATEVER GETS YOU THERE",
    image: "journey:roads-less-travelled"
  }
};

const places = {
  "sheldrick-falls": {
    title: "The falls, a little further up.",
    category: "HIDDEN WATERFALLS / SOUTHERN KENYA",
    description: "A green, damp detour where the sound reaches you before the water does. The path can be slippery and the flow changes with the season — ask locally about conditions before you set off.",
    time: "After the rains, when the falls are flowing", access: "Local directions and a short walk; check access first",
    note: "I nearly turned around at the muddy bit. Very glad I didn't — but shoes with grip are not optional."
  },
  gazi: {
    title: "Gazi, before the crowds.",
    category: "SECRET BEACHES / SOUTH COAST",
    description: "A quieter stretch of coast where mangroves and sea life share the shoreline. Keep it low-key, use a local guide where appropriate and take every bit of rubbish back with you.",
    time: "Early morning or late afternoon", access: "Reachable from the south coast; ask locally about tides and access",
    note: "The tide decides the day here. I learnt that after standing around with a camera and no plan."
  },
  chyulu: {
    title: "Chyulu, in no hurry.",
    category: "MOUNTAIN ESCAPES / SOUTHERN KENYA",
    description: "A volcanic landscape of rolling green, dark forest and big skies. Conditions shift quickly; access can be seasonal and some routes cross community or conservancy land.",
    time: "Dry months for easier routes; confirm current conditions", access: "Use a local guide and confirm entry permissions",
    note: "The hills don't need a filter. They do need you to slow down and tread lightly."
  },
  magadi: {
    title: "The long way to Magadi.",
    category: "OFF-ROAD ROUTES / SOUTHERN KENYA",
    description: "A proper red-dust run through open country. The route can be rough and remote, and conditions after rain can change fast. Carry water, fuel and a way to communicate.",
    time: "Dry season; avoid attempting remote sections after heavy rain", access: "High-clearance vehicle recommended; check road status locally",
    note: "We underestimated how long the last stretch would take. Extra water is a better souvenir than a rushed arrival."
  },
  "old-town": {
    title: "Follow the smoke.",
    category: "LOCAL FOOD / COAST",
    description: "The best meal is often the one you didn't search for. Ask where the locals eat, order what's coming off the grill and take time to learn the name of what you're eating.",
    time: "Evenings, when the grills come out", access: "Walk the neighbourhood and ask before photographing people",
    note: "Mishkaki, fresh juice and no hurry. I forgot to take a photo. That's how you know."
  },
  loitoktok: {
    title: "Wake up somewhere wild.",
    category: "UNIQUE STAYS / LOITOKTOK",
    description: "A quiet base near the mountain routes, best experienced with hosts who know the land. Stay on established paths, respect community rules and confirm what's open before you travel.",
    time: "Clear mornings for the mountain views", access: "Book with local hosts and confirm road conditions",
    note: "Some places are better without a signal. Tell someone your plans before you lose yours."
  }
};

const locations = {
  nairobi: { name: "Nairobi", type: "CITY / STARTING POINT", coordinates: "01° 17' S   36° 49' E", story: "Every good story starts somewhere. Mine usually starts here, with a full tank, an overpacked bag, and a plan that won't survive the first stop.", trip: "Down South — Day 01", photo: "map:nairobi", count: "01 / 06" },
  chyulu: { name: "Chyulu Hills", type: "MOUNTAIN / HIGH GROUND", coordinates: "02° 27' S   37° 51' E", story: "Black lava, soft green hills and a road that asks you to take it slow. Conditions and access change — get local guidance before you go.", trip: "The Mountain Routes", photo: "map:chyulu", count: "02 / 06" },
  diani: { name: "Diani", type: "COAST / SALT AIR", coordinates: "04° 17' S   39° 35' E", story: "The exhale after the long ride south. Warm water, roadside fruit and an easy reminder that the best itinerary leaves room to stay another day.", trip: "Down South — Day 03", photo: "map:diani", count: "03 / 06" },
  watamu: { name: "Watamu", type: "COAST / SLOW MILES", coordinates: "03° 21' S   40° 01' E", story: "The road keeps going north and the coast changes character. Stay curious, respect the reef and make time for the people who call this place home.", trip: "Coastal Stories", photo: "map:watamu", count: "04 / 06" },
  samburu: { name: "Samburu", type: "WILDERNESS / NORTHERN FRONTIER", coordinates: "00° 31' N   37° 31' E", story: "Big skies, dry country and a different rhythm. Go with a local guide, keep a respectful distance from wildlife and remember you are a guest here.", trip: "Samburu & Beyond", photo: "map:samburu", count: "05 / 06" },
  magadi: { name: "Magadi Road", type: "ROAD TRIP / RED EARTH", coordinates: "01° 54' S   36° 17' E", story: "A route that can be beautiful, rough and much longer than your map suggests. Check the weather, ask about current conditions and carry more water than you think.", trip: "The Roads Less Travelled", photo: "map:magadi", count: "06 / 06" }
};

const imageGroups = {
  journey: window.TRAVEL_PLUG_IMAGES.journeys,
  hidden: window.TRAVEL_PLUG_IMAGES.hiddenKenya,
  map: window.TRAVEL_PLUG_IMAGES.map,
  story: window.TRAVEL_PLUG_IMAGES.stories,
  instagram: window.TRAVEL_PLUG_IMAGES.instagram,
  experience: window.TRAVEL_PLUG_IMAGES.experiences
};
function imageUrl(key) {
  const [group, name] = key.split(":");
  const url = name ? imageGroups[group]?.[name] : window.TRAVEL_PLUG_IMAGES[key];
  if (!url) throw new Error(`No image configured for "${key}" in site-images.js`);
  return url;
}
document.querySelectorAll("[data-image-key]").forEach((element) => {
  element.style.setProperty("--card-image", `url("${imageUrl(element.dataset.imageKey)}")`);
});

const storyDialog = document.querySelector(".story-modal");
const placeDialog = document.querySelector(".place-modal");
function showDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}
function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

document.querySelectorAll("[data-journey]").forEach((card) => {
  card.addEventListener("click", () => {
    const trip = journeys[card.dataset.journey];
    document.querySelector(".modal-hero").style.setProperty("--modal-image", `url("${imageUrl(trip.image)}")`);
    document.querySelector("#modal-kicker").textContent = trip.kicker;
    document.querySelector("#modal-title").textContent = trip.title;
    document.querySelector("#modal-route").textContent = trip.route;
    document.querySelector("#modal-description").textContent = trip.description;
    document.querySelector("#modal-distance").textContent = trip.distance;
    document.querySelector("#modal-date").textContent = trip.date;
    document.querySelector("#modal-vehicle").textContent = trip.vehicle;
    showDialog(storyDialog);
  });
});

document.querySelectorAll("[data-place]").forEach((card) => {
  card.addEventListener("click", () => {
    const place = places[card.dataset.place];
    document.querySelector(".place-modal-image").style.setProperty("--modal-image", `url("${imageUrl(card.dataset.imageKey)}")`);
    document.querySelector("#place-kicker").textContent = place.category;
    document.querySelector("#place-title").textContent = place.title;
    document.querySelector("#place-description").textContent = place.description;
    document.querySelector("#place-time").textContent = place.time;
    document.querySelector("#place-access").textContent = place.access;
    document.querySelector("#place-note").textContent = `RYCE'S NOTE — “${place.note}”`;
    showDialog(placeDialog);
  });
});

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")));
});
document.querySelectorAll(".modal-done").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")));
});
[storyDialog, placeDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
});

const mapData = {
  nairobi: { type: "CITY / STARTING POINT", title: "Nairobi", story: locations.nairobi.story, coords: locations.nairobi.coordinates, trip: locations.nairobi.trip, photo: locations.nairobi.photo },
  chyulu: { type: "MOUNTAIN / HIGH GROUND", title: "Chyulu Hills", story: locations.chyulu.story, coords: locations.chyulu.coordinates, trip: locations.chyulu.trip, photo: locations.chyulu.photo },
  diani: { type: "COAST / SALT AIR", title: "Diani", story: locations.diani.story, coords: locations.diani.coordinates, trip: locations.diani.trip, photo: locations.diani.photo },
  watamu: { type: "COAST / SLOW MILES", title: "Watamu", story: locations.watamu.story, coords: locations.watamu.coordinates, trip: locations.watamu.trip, photo: locations.watamu.photo },
  samburu: { type: "WILDERNESS / NORTHERN FRONTIER", title: "Samburu", story: locations.samburu.story, coords: locations.samburu.coordinates, trip: locations.samburu.trip, photo: locations.samburu.photo },
  magadi: { type: "ROAD TRIP / RED EARTH", title: "Magadi Road", story: locations.magadi.story, coords: locations.magadi.coordinates, trip: locations.magadi.trip, photo: locations.magadi.photo }
};
document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    const location = mapData[pin.dataset.location];
    document.querySelectorAll(".map-pin").forEach((item) => item.classList.toggle("selected", item === pin));
    document.querySelector(".map-type").innerHTML = `<span>●</span> ${location.type}`;
    document.querySelector(".map-detail h3").textContent = `${location.title}.`;
    document.querySelector(".map-story").textContent = location.story;
    document.querySelector(".map-coords").textContent = location.coords;
    document.querySelector(".map-preview strong").textContent = location.trip;
    document.querySelector(".map-preview-image").style.setProperty("--card-image", `url("${imageUrl(location.photo)}")`);
    document.querySelector(".map-count").textContent = locations[pin.dataset.location].count;
  });
});

const journeyTrack = document.querySelector(".journey-track");
document.querySelectorAll(".track-arrow").forEach((button) => {
  button.addEventListener("click", () => journeyTrack.scrollBy({ left: Number(button.dataset.scroll) * journeyTrack.clientWidth * .72, behavior: "smooth" }));
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("open", !expanded);
});
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const regionFilter = document.querySelector("#region-filter");
const typeFilter = document.querySelector("#type-filter");
const distanceFilter = document.querySelector("#distance-filter");
const experienceCards = [...document.querySelectorAll(".experience-card")];
function filterExperiences() {
  let visible = 0;
  experienceCards.forEach((card) => {
    const matches = (regionFilter.value === "all" || card.dataset.region === regionFilter.value)
      && (typeFilter.value === "all" || card.dataset.type === typeFilter.value)
      && (distanceFilter.value === "all" || card.dataset.distance === distanceFilter.value);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  document.querySelector(".no-experiences").hidden = visible !== 0;
}
[regionFilter, typeFilter, distanceFilter].forEach((filter) => filter.addEventListener("change", filterExperiences));

const instagramSection = document.querySelector(".instagram-section");
const instagramPause = document.querySelector(".instagram-pause");
instagramPause.addEventListener("click", () => {
  const paused = instagramPause.getAttribute("aria-pressed") === "true";
  instagramPause.setAttribute("aria-pressed", String(!paused));
  instagramSection.classList.toggle("is-paused", !paused);
  instagramPause.innerHTML = paused ? "PAUSE LOOP <span>Ⅱ</span>" : "PLAY LOOP <span>▶</span>";
});
