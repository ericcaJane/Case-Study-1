import React from "react";
import "./main.css"; // Import your custom CSS

const places = [
  {
    name: "Luinab",
    location: "Situated at approximately 8.2472, 124.2681, in the island of Mindanao. Elevation at these coordinates is estimated at 10.5 meters or 34.4 feet above mean sea level.",
    image: "/gps.png", // Replace with actual image path
    isCenter: true, // Mark as center card
  },
  {
    name: "Luinab Barangay Hall",
    location: "67W9+R4Q, Iligan City, Lanao del Norte",
    page: " https://www.facebook.com/p/Barangay-Luinab-61554099527974/",
    phone: "(063) 225 0765",
    hours: "Monday to Friday 8am to 5pm",
    image: "/hall.jpg",
  },
  {
    name: "Barangay Luinab Health Center",
    location: "Purok 2A, Luinab, Iligan City, Philippines",
    page: "https://www.facebook.com/p/Barangay-Luinab-Health-Center-100067640439421/",
    hours: "Monday to Friday 8am to 5pm",
    image: "/health.jpg",
  },
  {
    name: "Luinab Elementary School",
    location: "67V9+532, Iligan City, Lanao del Norte, Philippines",
    page: "https://www.facebook.com/luinab.es/",
    phone: "(063) 223 7916",
    hours: "Monday to Friday 6am to 5pm",
    image: "/luinab.jpg",
  },
 
  {
    name: "Monte De Amore",
    location: "Purok 6, Upper, Iligan City, Lanao del Norte",
    page: "https://www.facebook.com/MonteDeAmore",
    phone: "0953 086 3130",
    hours: "Monday to Sunday 8am to 9pm",
    image: "/monte.jpg",
  },
  {
    name: "Hidden Gem Resort",
    location:
      "Brgy, Near Luinab Elementary School, Purok 3, Iligan City, 9200 Lanao del Norte",
    page: "https://www.facebook.com/profile.php?id=100077931204137",
    phone: "0917 117 2276",
    hours: "Monday to Sunday 6am to 7pm",
    image: "/gem.jpg",
  },
];

function WelcomePage() {
  return (
    <div className="welcome-page">
      <h1 className="welcome-title">Welcome to Barangay Management System</h1>

      {/* Luinab Center Card */}
      <div className="center-card">
        <div className="card">
          <img src={places[0].image} alt="Luinab GPS" />
          <div className="card-content">
            <h2 className="card-title">{places[0].name}</h2>
            <p className="card-text">{places[0].location}</p>
          </div>
        </div>
      </div>

      {/* Other Places in 2x2 Grid */}
      <div className="card-grid">
        {places.slice(1).map((place, index) => (
          <div key={index} className="card">
            <img src={place.image} alt={place.name} />
            <div className="card-content">
              <h2 className="card-title">{place.name}</h2>
              <p className="card-text">{place.location}</p>
              {place.phone && <p className="card-text">📞 {place.phone}</p>}
              <p className="card-text">🕒 {place.hours}</p>

              {place.page && (
                <p className="card-text">
                  <a href={place.page} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    Visit Facebook Page
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WelcomePage;
