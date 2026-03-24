🩺 MedCare+
AI-Driven Solution for Drug Interaction and Overdose Prevention
📌 Overview

MedCare+ is an intelligent mobile healthcare application designed to enhance medication safety and improve user awareness. The system assists users in identifying harmful drug interactions, understanding safe dosage limits, and accessing reliable medicine information.

The application integrates multiple safety-focused features into a single platform, enabling users to make informed decisions regarding medication usage. It is especially beneficial for individuals undergoing multiple treatments and for those with limited access to immediate medical guidance.

🎯 Objectives
Ensure safe medication usage through interaction analysis
Prevent overdose by providing safety limits
Improve awareness about medicines and their effects
Provide accessible healthcare support through consultation
Develop a user-friendly and scalable mobile solution
🚀 Key Features
💊 Drug Interaction Analysis
Drug–Drug Interaction Detection
Drug–Disease Compatibility Check
Food–Drug Interaction Analysis
⚠️ Overdose Safety Checker
Displays maximum safe dosage limits
Provides recommended time intervals between doses
Generates safety warnings
📖 Medicine Information System
Provides uses, side effects, and precautions
Displays structured and easy-to-understand information
👨‍⚕️ Doctor Consultation
Scheduled doctor availability
Direct consultation via WhatsApp video call
🛠️ Technology Stack
📱 Frontend
React Native (TypeScript)
⚙️ Backend
FastAPI (Python)
Uvicorn (ASGI Server)
🗄️ Data Sources
Kaggle
DrugBank
OpenFDA
🧪 Development Tools
Jupyter Notebook
Visual Studio Code
🧩 System Architecture

The system follows a layered architecture:

Frontend Layer: Handles user interaction and input
API Layer: Manages communication between frontend and backend
Backend Layer: Performs interaction analysis and safety evaluation
Database Layer: Stores structured medical datasets
🔄 Workflow
User enters medicine or related details
Data is sent to backend via API
Backend processes input using datasets
System performs interaction and safety analysis
Results are displayed in a structured format
Optional doctor consultation is available
📸 Application Screenshots

(Add your screenshots here)

![Screen 1](screens/screen1.png)
![Screen 2](screens/screen2.png)
![Screen 3](screens/screen3.png)
![Screen 4](screens/screen4.png)
⚙️ Installation & Setup
🔹 Clone Repository
git clone https://github.com/your-username/medcare-plus.git
cd medcare-plus
🔹 Install Dependencies
npm install
🔹 Run Frontend
npx expo start
🔹 Run Backend
uvicorn main:app --reload
🔐 Key Highlights
✔ Focuses on safety, not prescription
✔ Uses rule-based medical logic for accuracy
✔ Simple and intuitive user interface
✔ Modular and scalable system design
🔮 Future Enhancements
AI-based personalized recommendations
Offline support for interaction analysis
Multi-language support
Advanced user health profile management
