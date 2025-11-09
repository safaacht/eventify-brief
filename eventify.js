// Your app's data structure
let events = [];
let archive = [];

// ============================================
//      SCREEN SWITCHING
// ============================================

const sidebar = document.querySelectorAll('.sidebar__btn');
const screens = document.querySelectorAll(".screen");
const title = document.getElementById("page-title");
const subtitle = document.getElementById("page-subtitle");

let screenStatus  = [
    {action: "stats", title: "Statistics", subtitle: "Overview of your events"},
    {action: "add", title: "Add Event", subtitle: "Add a new event to your list"},
    {action: "list", title: "Events", subtitle: "See all your events"},
    {action: "archive", title: "Archive", subtitle: "Past events archive"}
];


function switchScreen(btn) {
    const target = btn.dataset.screen;

    //  Update screens visibility
    screens.forEach(screen => {
        screen.classList.toggle("is-visible", screen.dataset.screen === target);
    });

    //  Update sidebar active class
    sidebar.forEach(side => side.classList.remove("is-active"));
    btn.classList.add("is-active");

    //  Update title & subtitle using forEach
    screenStatus.forEach(item => {
        if (item.action === target) {
            title.textContent = item.title;
            subtitle.textContent = item.subtitle;
        }
    });
}

// Listen to sidebar button clicks
sidebar.forEach(btn => {
    btn.addEventListener("click", () => switchScreen(btn));
});

