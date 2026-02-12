# Requirements
## 👥 1. Project Stakeholders
| Role | Responsibility |
| :--- | :--- |
| **Players** | Primary users & playtesters |
| **Development** | **Coder:** Logic & Architecture <br> **UI Designer:** Interface & Flow |
| **Creative** | **Artwork Designer:** Bespoke visual assets |
| **Quality Control** | **Tester:** Bug tracking <br> **Report Writer:** Academic documentation |
| **Evaluation** | **Teachers:** Project grading & assessment |

---

## 🏆 2. Project Epics
*High-level goals categorized by project priority.*

### 🎯 Engagement & Difficulty
* **Retention:** Volunteers play for **≥ 5 minutes** without external prompting.
* **Balanced Challenge:** Achievement of a **50% success rate** for Level 2 among new players.
* **Mechanical Innovation:** Implementation of **2+ unique functionalities** beyond the base Kirby/Cuphead movesets.

### 🎨 Artistic Integrity & UX
* **Bespoke Visuals:** 100% original artwork with a consistent style guide.
    * ⚠️ *Constraint: Zero tolerance for AI-generated or downloaded assets.*
* **Intuitive Navigation:** Menus and settings must be navigable without instructions.
* **Signposting:** Clear visual cues to guide players through the level environment.

### ⚙️ Technical Core
* **Precision Physics:** Stable platforming with accurate collision detection and jump mechanics.
* **Economy & Growth:** * Working **Currency System** for upgrades.
    * **Ability-Merging System** for skill integration with allies.

---

## 📝 3. User Stories
*Functional requirements mapped to specific project roles.*

### 🖌️ Design & Art
* **As an Art Designer**, I want to create a **unified style guide**, so that the game feels visually coherent across all levels.
* **As a UI Designer**, I want to design **dynamic buttons and signs**, so that players feel guided through the experience.

### 💻 Engineering & QA
* **As a Coder**, I want to implement **in-game help overlays**, so that players spend less time frustrated and more time playing.
* **As a Coder**, I want to maintain a **well-commented codebase**, so that my teammates can understand my logic asynchronously.
* **As a Tester**, I want to perform **edge-case testing on physics**, so that the character never clips through the floor or gets stuck.

### 📖 Communication
* **As a Report Writer**, I want to draft a **comprehensive instruction manual**, so that players and teachers can immediately understand the game rules.

---

## 🏁 4. Acceptance Criteria
*Defining the "Definition of Done" through measurable Given-When-Then scenarios.*

### 📂 Onboarding & Documentation
| Scenario | Requirement Path |
| :--- | :--- |
| **Concept Clarity** | **Given** a teacher opens the game description, <br> **When** they read the first paragraph, <br> **Then** they should immediately understand the core concept and objective. |
| **User Autonomy** | **Given** a new player has never seen the game, <br> **When** they read the instruction sheet without help, <br> **Then** they should be able to complete a full round correctly. |
| **Test Coverage** | **Given** first-time testers, <br> **When** playing the game, <br> **Then** they should be able to identify all functionalities via in-game instructions to test them thoroughly. |

### 🎮 Gameplay & Interaction
| Scenario | Requirement Path |
| :--- | :--- |
| **First-Time User Experience** | **Given** a new player opens the game for the first time, <br> **When** they read the description and interact with the interface, <br> **Then** they should clearly understand the core objective, identify key controls, and complete a full round without assistance.
| **Real-Time Feedback & Performance** | **Given** a new player plays the game for the first time, <br> **When** they make any move in the game, <br> **Then** they should receive **immediate and clear feedback** to prevent consecutive invalid moves and experience **smooth performance** that encourages replayability.

---

## 💡 5. Reflection

Through defining our epics, user stories, and acceptance criteria, our team developed a clearer understanding of how high-level vision translates into practical and testable requirements. 

Initially, our ideas about making the game “fun” or “engaging” were vague. By writing **epics**, we learned to express these ambitions in measurable ways, such as requiring volunteers to play for at least five minutes or ensuring that at least 50% of players can pass Level 2. This helped us transform abstract goals into observable outcomes.

Writing **user stories** allowed us to view the project from multiple perspectives, including art designers, coders, testers, UI designers, and report writers. This process highlighted the importance of collaboration and clarified each member’s responsibilities. It also showed us that technical quality is as important as user experience and visual consistency.

Developing **acceptance criteria** further strengthened our understanding of clarity and accountability. Using the **Given–When–Then** format forced us to define what success looks like in concrete terms. Instead of assuming something “works,” we specified how it should be tested, who it is for, and what outcome is expected. This improved communication within the team and reduced ambiguity.



> ### **Core Conclusion**
> Overall, we learned that **epics** define direction, **user stories** define perspective and purpose, and **acceptance criteria** define measurable success. Together, they ensure that our game is not only functional, but also enjoyable, intuitive, and aligned with its intended context and audience.