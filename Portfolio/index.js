

/* Fade in on scroll */
const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show")
        }
    })

})
const hiddenElements = document.querySelectorAll(".hiddenScroll")
hiddenElements.forEach((el) => observer.observe(el))



const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            window.addEventListener('scroll', function() {
                const scrollPos = window.scrollY || window.pageYOffset;
                const targetRect = entry.target.getBoundingClientRect();
                const amplitude = targetRect.width / 2;   
              
                displacement += amplitude * (scrollPos - prevScrollPos) / window.innerWidth;
                displacement = Math.max(Math.min(displacement, amplitude), -amplitude);

                entry.target.style.transform = `translateX(${displacement}px)`;
              
                prevScrollPos = scrollPos;
              });

        }

    })
})
const elements = document.querySelectorAll(".moving-title")
elements.forEach((el) => scrollObserver.observe(el))
let prevScrollPos = window.scrollY || window.pageYOffset;
let displacement = 0;




/* Open and close the menu */
document.getElementById("closeButton").addEventListener("click", toggleMenu)
function toggleMenu() {
    var container = document.getElementById("outer");
    var grid_container = document.getElementById("grid-container")
    var navbar = document.getElementById("nav-bar")
    var closeButton = document.getElementById("closeButton")

    container.classList.toggle("down");
    grid_container.classList.toggle("hidden")
    grid_container.classList.toggle("visible")
    navbar.classList.toggle("navbar-on")
    navbar.classList.toggle("navbar-off")
    closeButton.classList.toggle("navbar-on")
    closeButton.classList.toggle("navbar-off")
}


/* Click through projects */
const box_elements = document.querySelectorAll(".box")
box_elements.forEach((el) => el.addEventListener("click", function() {
    handleNavigation(el.classList[1])
}))

var slideIndex = 0; 
function handleNavigation( className ) {

    if ( className === "box-left" ) {
        slideIndex -= 1
    } else {
        slideIndex += 1
    }
    let index = (Math.abs(slideIndex) % projectDescriptions.length)
    setSlide(index)
}


function setSlide(index) {
    let project_dom = document.getElementById("project-description");
    let image_dom = document.getElementById("project-img");
    project_dom.children[0].innerHTML = projectDescriptions[index].name;
    project_dom.children[1].innerHTML = projectDescriptions[index].languages;
    project_dom.children[2].innerHTML = projectDescriptions[index].description;
    image_dom.src = projectDescriptions[index].image;

    // Remove the "active" class if it exists
    if (project_dom.classList.contains("active")) {
        project_dom.classList.remove("active");
        image_dom.classList.remove("active")
        
        // Use setTimeout to ensure the class is removed before it's added again
        setTimeout(() => {
            project_dom.classList.add("active");
            image_dom.classList.add("active")
        }, 0);
    } else {
        project_dom.classList.add("active");
        image_dom.classList.add("active")
    }
}

const projectDescriptions = [
    {
        name: "Delta Zeta Chapter Website", 
        languages: "MERN Stack", 
        description: "My most recent project that helped me learn \
                    about the frontend and backend well. The website allows non-members \
                    to see the home page and the calendar events. The dashboard is a \
                    simple backend CRUD system that allows the members of the Sigma Chi \
                    Chapter with the ability to edit frontend calendar events and users \
                    allowed in the system through MongoDB.",
        image: "./images/deltaZeta.png"
    },

    {
        name: "Chatroom App", 
        languages: "React / Socket.io / JS / HTML / CSS", 
        description: "The Chatroom App was my first ever React project. \
                    The main design of the website is derived from Internet \
                    Relay Chat (IRC) design. First though, the user must enter \
                    their name and room they want to join, which then triggers \
                    Socket.io to move the user to a room where they can \
                    communicate with their friends! I chose not to deploy \
                    this, simply because I didn't want to deal with the network \
                    layer security issues in a language that I was new to.", 
        image: "./images/chatroom.png"
    },

    {
        name: "Pathfinding", 
        languages: "Python", 
        description: "My final project for CS-351 Algorithms course where I implemented a visualization of A* and Dijkstra's algorithm. The visualization part was learned through TechWithTim, although, the purpose of the project was not purely about the visualization whereas it was more focused on learning how the algorithm thinks.",
        image: "./images/pathfinding.png"
    },

    {
        name: "Weather App", 
        languages: "HTML / CSS / JS / OpenWeatherMapAPI", 
        description: "My final project for CS-270 Web Development. This project is one of my favorites that I have ever developed because it felt like the first time that I was able to step out of simple syntax learning within a language and actually apply it to something fun. I used the openweathermap API to gather information about a given city that is entered by the user. The user is then able to learn about the previous and next four days of weather (in F or C).",
        image: "./images/weather.png"
    },

    {
        name: "User Management CRUD", 
        languages: "PostgreSQL / Express / React / NodeJS (PERN)", 
        description: "This was a short yet necessary projects that taught me how to interact between the frontend and backend. I used PostgreSQL as the database system (locally) to create the project, although, when I later implemented the same User Management system into my Delta Zeta Project, I adjusted everything that was postgreSQL onto MongoDB Atlas.",
        image: "./images/userManagement.png"
    },

]
