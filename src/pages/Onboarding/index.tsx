import { SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT } from 'constants/index';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store/hooks';
import { setPlayerOnboardingScreenShown } from 'store/profile';
import { RoutePath } from 'types/router';

import { MoveX, Scale } from '../../animations';
import FirstStep from './components/firstStep';
import FourthStep from './components/fourthStep';
import SecondStep from './components/secondStep';
import ThirdStep from './components/thirdStep';

const Onboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const stepNumber = Number(searchParams.get('step'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!stepNumber)
      setSearchParams({
        step: '1',
      });
  }, [setSearchParams, stepNumber]);

  const [side, setSide] = useState(300);

  const dispatch = useDispatch();

  return (
    <div
      className="page page__splash !pt-[30px] !px-[22px] pb-4 flex flex-col"
      data-testid="subjects-evaluation-onboarding-guide"
    >
      <section
        className="content"
        data-testid={`subjects-evaluation-onboarding-guide-step-${stepNumber}`}
      >
        <AnimatePresence mode="wait">
          {stepNumber === 1 ? (
            <MoveX opacity={1} x={side} key={1}>
              <FirstStep />
            </MoveX>
          ) : stepNumber === 2 ? (
            <MoveX opacity={1} x={side} key={2}>
              <SecondStep />
            </MoveX>
          ) : stepNumber === 3 ? (
            <MoveX opacity={1} x={side} key={3}>
              <ThirdStep />
            </MoveX>
          ) : (
            <MoveX opacity={1} x={side} key={4}>
              <FourthStep />
            </MoveX>
          )}
        </AnimatePresence>
      </section>

      <section className="actions px-5 flex justify-between items-center w-full min-h-[56px] mb-24 mt-auto text-center">
        <div className="step-anotators flex gap-2">
          <span
            onClick={() => {
              if (stepNumber > 1) setSide(-300);
              else setSide(300);
              setTimeout(() => {
                setSearchParams({ step: '1' });
              }, 100);
            }}
            className={`transition-all w-2.5 h-2.5 rounded-full cursor-pointer bg-white ${
              stepNumber === 1 && '!w-10 !bg-pastel-purple'
            }`}
          ></span>
          <span
            onClick={() => {
              if (stepNumber > 2) setSide(-300);
              else setSide(300);
              setTimeout(() => {
                setSearchParams({ step: '2' });
              }, 100);
            }}
            className={`transition-all w-2.5 h-2.5 rounded-full cursor-pointer bg-white ${
              stepNumber === 2 && '!w-10 !bg-pastel-purple'
            }`}
          ></span>
          <span
            onClick={() => {
              if (stepNumber > 3) setSide(-300);
              else setSide(300);
              setTimeout(() => {
                setSearchParams({ step: '3' });
              }, 100);
            }}
            className={`transition-all w-2.5 h-2.5 rounded-full cursor-pointer bg-white ${
              stepNumber === 3 && '!w-10 !bg-pastel-purple'
            }`}
          ></span>
          <span
            data-testid={`subjects-evaluation-onboarding-guide-step-button-${4}`}
            onClick={() => {
              if (stepNumber > 4) setSide(-300);
              else setSide(300);
              setTimeout(() => {
                setSearchParams({ step: '4' });
              }, 100);
            }}
            className={`transition-all w-2.5 h-2.5 rounded-full cursor-pointer bg-white ${
              stepNumber === 4 && '!w-10 !bg-pastel-purple'
            }`}
          ></span>
        </div>
        <button
          onClick={() => {
            if (stepNumber < SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT) {
              setSide(300);
              setTimeout(() => {
                setSearchParams({ step: (stepNumber + 1).toString() });
              }, 100);
            }
          }}
          className={`bg-pastel-purple p-3 w-10 h-10 rounded-3xl transition-all duration-400 ${
            stepNumber === SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT &&
            '!rounded-xl !w-[165px] !h-14'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {stepNumber < SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT && (
              <Scale duration={0.3} delay={0} key={1}>
                <img
                  src="/assets/images/Shared/next-page.svg"
                  data-testid="subjects-evaluation-onboarding-guide-next-button"
                  className={`translate-x-[1px] w-4 h-4 opacity-1 transition-all`}
                  alt=""
                />
              </Scale>
            )}
            {stepNumber === SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT && (
              <Scale duration={0.3} delay={0} key={2}>
                <p
                  data-testid="subjects-evaluation-onboarding-guide-finish-button"
                  onClick={() => {
                    dispatch(setPlayerOnboardingScreenShown(true));
                    navigate(RoutePath.HOME);
                  }}
                  className={`font-semibold text-xl text-white transition-all opacity-1'`}
                >
                  Let&apos;s Start
                </p>
              </Scale>
            )}
          </AnimatePresence>
        </button>
      </section>
      <footer className="flex justify-between text-gray90 text-sm">
        <span className="flex gap-1">
          <p className="font-light">Version</p>
          <p className="">2.1</p>
        </span>
        <span className="flex gap-1">
          <p className="text-gray50">Powered by:</p>
          <p className="font-light">BrightID</p>
        </span>
      </footer>
    </div>
  );
};

export default Onboarding;
