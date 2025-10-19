# 🌿 EcoVoyage

**EcoVoyage** is a smart, eco-friendly travel planner web application designed to help users plan sustainable trips efficiently.  
Built using **HTML, CSS, JavaScript, and Java**, it allows travelers to choose destinations, select cuisines, hotels, travel classes, and calculate total trip costs — all with an interactive and user-friendly interface.

---

## ✨ Features

✅ **User Login System**  
- Collects full name, phone number, and email before planning a trip.  
- Displays trip summary personalized for each user.  

✅ **Destination Selection**  
- Choose from beautiful cities such as **Paris, Tokyo, London, Seoul, Mexico, Hong Kong, and Kerala**.  
- Each city displays unique attractions and images.  

✅ **Smart Trip Calculation**  
- Calculates total cost based on hotel, cuisine, travel class, days, and number of travelers.  
- Shows a complete **cost breakdown** for transparency.  

✅ **Responsive Design**  
- Works smoothly on desktops and mobile devices.  

✅ **Personalized Thank You Page**  
- After calculation, shows a “Thank You” message with traveler details and trip summary.  

---

## 🧠 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Webpage structure |
| **CSS3** | Styling and layout |
| **JavaScript (Vanilla JS)** | Frontend interactivity |
| **Java** | Backend server for static files |
| **Localhost** | Run the project locally on your system |

---
🗂️ Folder Structure

EcoVoyage/
├── src/
│ ├── Ecovoyage.java # Java backend server
│ ├── Ecovoyage$CalculatePlan.class
│ └── Ecovoyage$StaticFileHandler.class
│
├── web/
│ ├── index.html # Main website
│ ├── script.js # JS logic for frontend
│ ├── style.css # Styling for the interface
│ └── images/ # City images
│ ├── paris.jpg
│ ├── tokyo.jpg
│ ├── london.jpg
│ ├── seoul.jpg
│ ├── mexico.jpg
│ ├── hongkong.jpg
│ └── kerala.jpg

---

## 🚀 How to Run Locally

1. Open terminal and navigate to the project folder:
   ```bash
   cd EcoVoyage/src
2. Compile the Java backend:
   javac Ecovoyage.java
3. Run the server:
   java -cp . Ecovoyage
4. Open your browser and go to:
   http://localhost:8080
5. The EcoVoyage homepage will appear:
   Login using your name, phone, and email → plan your trip → and get a detailed cost summary with a thank-you screen.
👩‍💻 Author

Malini S
GitHub: malini337

Project Repository: EcoVoyage

