import AnimatedNodeCircles from '@/components/AnimatedNodeCircles';

// export const textContent = `The **Evidence** section provides a comprehensive view of user activities, their evaluations, and how others perceive them. It helps users gauge the credibility and performance of other evaluators while offering transparency into evaluation data.

// ---

// #### **Main Sections:**

// 1. **Overview**
//    This tab gives you a summary of the user's overall impact and their evaluation history:
//    - **Evaluations:** See how many evaluations the user has performed (positive vs. negative).
//    - **Calculated Score:** Displays the user's cumulative score based on evaluations received.
//    - **Evaluation Impact:** A graphical representation of the user's influence, broken down into levels of confidence (e.g., Low, Medium, High).
//    - **Recent Activities:** Shows the user's latest interactions and activities, providing a quick glance at their recent performance.

//    Use the **Overview** to quickly understand a user's impact and how others have rated them.

// ---

// 2. **Connections/Activity**
//    This tab shows the **users evaluated or connected by this user**, providing insight into their interactions:
//    - **Users Evaluated:** View a list of profiles this user has rated.
//    - **Behavior and Score:** See the overall behavior and scores of these profiles, helping you understand the user's rating patterns.
//    - **Connections:** Understand the relationships and interactions between users.

//    Use the **Connections/Activity** tab to dive deeper into the user's interactions and how their ratings align with others.

// ---

// 3. **Evaluations**
//    This tab focuses on the **details of the evaluations** performed by the user:
//    - **Confidence Levels:** Displays how confidently the user rated other profiles (e.g., Low, Medium, High Confidence).
//    - **Profiles Evaluated:** Provides a list of users rated by this evaluator, along with their scores and performance.
//    - **Evaluator Credibility:** Evaluate how effective and reliable this user is as an evaluator, based on their ratings and confidence levels.

//    Use the **Evaluations** tab to assess the credibility and performance of the user as an evaluator.

// ---

// #### **How to Use This Section:**
// - **As a Viewer:**
//   - Get an overall sense of a user's impact through the **Overview** tab.
//   - Understand their interactions with others via the **Connections/Activity** tab.
//   - Assess their evaluation skills and confidence in the **Evaluations** tab.

// - **As a User Being Evaluated:**
//   - Review your **Overview** to see how others perceive you.
//   - Check your connections to identify patterns in your evaluations.
//   - Analyze the **Evaluations** tab to improve your credibility and evaluation performance.

// This section empowers users to transparently view and evaluate performance while fostering accountability and trust in the system.
// `;

export default function EvidenceHelpModal() {
  return (
    <div className="leading-loose no-scrollbar text-base max-h-96 overflow-y-auto">
      <h3 className="font-semibold my-4">Connections</h3>
      <AnimatedNodeCircles />

      <p className="mt-5 text-sm leading-loose">
        {`BrightID Connections are trusted relationships built by scanning QR
        codes with users you meet or know, establishing verification levels like
        "Just Met" or "Already Known." These connections expand your network,
        enhance authenticity, and unlock features such as recovery or Aura-based
        interactions. Each level reflects your real-world trust, securing your
        digital identity through a decentralized community.`}
      </p>
    </div>
  );
}
