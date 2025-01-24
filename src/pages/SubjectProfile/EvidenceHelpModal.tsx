import ReactECharts from 'echarts-for-react';
import { useRef, useState } from 'react';
import { SiGitbook } from 'react-icons/si';
import { Link } from 'react-router';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import AnimatedNodeCircles from '@/components/AnimatedNodeCircles';
import StepsPagination from '@/components/Pagination';

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

export function ConnectionsHelpContent() {
  return (
    <>
      <h3 className="font-semibold my-4">Connections</h3>
      <AnimatedNodeCircles />

      <p className="text-sm leading-loose">
        {`BrightID Connections are trusted relationships formed by scanning QR codes, with levels like "Just Met" or "Already Known." They expand your network, enhance authenticity, and unlock features like recovery or Aura interactions, securing your digital identity in a decentralized community.`}
      </p>
    </>
  );
}
export function ActitvityHelpContent() {
  return (
    <>
      <h3 className="font-semibold my-4">Activity</h3>
      <img
        className="min-w-[250px] cursor-pointer mx-auto my-3 transition-all duration-300 opacity-100 h-[134px] !w-full"
        src="/assets/images/onboarding/connected-to-card.svg"
        alt="step2"
      />
      <p className="text-sm leading-loose">
        {`The Activity tab displays users evaluated or connected by this user, showing their rating patterns and the behavior/scores of those profiles. Use it to analyze their interactions and rating consistency.`}
      </p>
    </>
  );
}

export function EvaluationsHelpContent() {
  return (
    <>
      <h3 className="font-semibold my-4">Evaluations</h3>
      <img
        className="min-w-[250px] my-4 cursor-pointer mx-auto transition-all duration-300 opacity-100 h-[134px] !translate-x-0"
        src="/assets/images/onboarding/evaluated-card.svg"
        alt="subject-card"
      />
      <p className="text-sm leading-loose">
        {`The Evaluations tab shows the user’s rating confidence, profiles they’ve evaluated, and their credibility as an evaluator. Use it to assess their reliability and impact on the network.`}
      </p>
    </>
  );
}

export function OverviewHelpContent() {
  return (
    <>
      <h3 className="font-semibold my-4">Overview</h3>
      <ReactECharts
        style={{ height: '110px' }}
        option={{
          xAxis: {
            type: 'category',
            axisLine: {
              show: true,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: 'value',
            show: false,
            min: -321935152.38969785,
            max: 321935152.38969785,
          },
          grid: {
            top: 15,
            bottom: 0,
            left: 0,
            right: 0,
          },
          series: [
            {
              color: '#ABCAAE',
              data: [
                {
                  value: 321935152.38969785,
                  label: 'Philip Silva 🔆 13.66%',
                  evaluator: 'xqmMHQMnBdakxs3sXXjy7qVqPoXmhhwOt4c_z1tSPwM',
                  itemStyle: {
                    color: '#72BF83',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 309471754.5828657,
                  label: '09w4...6IA 13.14%',
                  evaluator: '09w4r-qB7nfooRBN0_FmM9r5SwWfwpIn-x1rNTfE6IA',
                  itemStyle: {
                    color: '#5B9969',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 303890694.66510546,
                  label: 'AWtJ...B_Y 12.90%',
                  evaluator: 'AWtJ0wj7j1sFkZStsh6n3UvXsX3pGj9Oqgw2xMF9B_Y',
                  itemStyle: {
                    color: '#5B9969',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 274948401.76658356,
                  label: 'Ashraf 🔆 11.67%',
                  evaluator: 'v5mibmGr9W08lhCI1exZr4PLt4VV7s-nVoJXOVlN2kg',
                  itemStyle: {
                    color: '#72BF83',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 266010066.99996603,
                  label: 'OeNl...uFs 11.29%',
                  evaluator: 'OeNllgD2Q2K845Z_ANwah_9yTbJ5PFpvyY8zITkOuFs',
                  itemStyle: {
                    color: '#72BF83',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 177313455.21917915,
                  label: 'Adam Stallard 7.53%',
                  evaluator: 'AsjAK5gJ68SMYvGfCAuROsMrJQ0_83ZS92xy94LlfIA',
                  itemStyle: {
                    color: '#B4E6C0',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 129197221.53392188,
                  label: 'AdrP...NrQ 5.48%',
                  evaluator: 'AdrPoRA1-esbTrKwbT2mSqiMIjPkC_4rGA8SnGuqNrQ',
                  itemStyle: {
                    color: '#5B9969',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 121956441.11469027,
                  label: 'HxZf...cBM 5.18%',
                  evaluator: 'HxZfz3ipSp0rHsOhJQlievFqjV3DnU8BE6vhqNSecBM',
                  itemStyle: {
                    color: '#B4E6C0',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 97972480.94217792,
                  label: 'qc7a...XTo 4.16%',
                  evaluator: 'qc7amUeAsqD_GTNu6YPtHbJopmH7Lwhre2QKS2QAXTo',
                  itemStyle: {
                    color: '#5B9969',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 85713605.51158533,
                  label: 'Vladislav 3.64%',
                  evaluator: '-Fh5Fd6THVj8hNFZ-x11C_GWWHVG7U4o0XP1uTwEg38',
                  itemStyle: {
                    color: '#5B9969',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
                {
                  value: 69219409.09819698,
                  label: 'frVV...HN4 2.94%',
                  evaluator: 'frVVRCFkvHNjdAVcNs_ZzTd4Xz-rGTyPW1AeCrNsHN4',
                  itemStyle: {
                    color: '#5B9969',
                    borderRadius: [4, 4, 0, 0],
                  },
                },
              ],
              type: 'bar',
              barGap: '0',
              barMaxWidth: 30,
            },
          ],
        }}
      />
      <p className="text-sm leading-loose">
        {/* {`The Overview tab shows a user’s evaluation history, Calculated Score, and Evaluation Impact tiers (Low to Very High Confidence). It highlights recent activities, offering quick insight into their engagement and trustworthiness. Use it to assess credibility and impact at a glance.`} */}
        {`The Overview tab displays a user’s evaluation history, Calculated Score, and Evaluation Impact tiers. It highlights recent activities, offering quick insight into their engagement and trustworthiness for assessing credibility.`}
      </p>
    </>
  );
}

export default function EvidenceHelpModal() {
  const swiperRef = useRef<SwiperRef>(null);
  const [activePage, setActivePage] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActivePage(swiper.activeIndex);
  };

  return (
    <div className="leading-loose no-scrollbar text-base overflow-y-auto">
      <Link
        className="text-sm flex items-center gap-4"
        target="_blank"
        to="https://brightid.gitbook.io/aura/evidence/expected-connections"
      >
        <SiGitbook /> Gitbook
      </Link>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(page) => {
          handleSlideChange(page);
        }}
        ref={swiperRef}
        initialSlide={activePage}
      >
        <SwiperSlide>
          <OverviewHelpContent key={activePage} />
        </SwiperSlide>
        <SwiperSlide>
          <ConnectionsHelpContent key={activePage} />
        </SwiperSlide>
        <SwiperSlide>
          <ActitvityHelpContent key={activePage} />
        </SwiperSlide>
        <SwiperSlide>
          <EvaluationsHelpContent key={activePage} />
        </SwiperSlide>
      </Swiper>
      <StepsPagination
        activePage={activePage}
        pages={4}
        setPageNumber={(pageNumber) => {
          setActivePage(pageNumber);
          swiperRef.current?.swiper.slideTo(pageNumber);
        }}
      />
    </div>
  );
}
