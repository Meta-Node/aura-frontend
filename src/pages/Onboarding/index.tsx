// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT } from 'constants/index';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store/hooks';
import { setPlayerOnboardingScreenShown } from 'store/profile';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { RoutePath } from 'types/router';

import FirstStep from './components/firstStep';
import FourthStep from './components/fourthStep';
import SecondStep from './components/secondStep';
import ThirdStep from './components/thirdStep';

const Onboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const stepNumber = Number(searchParams.get('step')) || 1;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!stepNumber) {
      setSearchParams({ step: '1' });
    }
  }, [setSearchParams, stepNumber]);

  const handleSlideChange = (swiper: any) => {
    setSearchParams({ step: (swiper.activeIndex + 1).toString() });
  };

  const handleFinish = () => {
    dispatch(setPlayerOnboardingScreenShown(true));
    navigate(RoutePath.HOME);
  };

  return (
    <div
      className="page page__splash !pt-[30px] !px-[22px] pb-4 flex flex-col"
      data-testid="subjects-evaluation-onboarding-guide"
    >
      <section
        className="content"
        data-testid={`subjects-evaluation-onboarding-guide-step-${stepNumber}`}
      >
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          initialSlide={stepNumber - 1}
        >
          <SwiperSlide>
            <FirstStep />
          </SwiperSlide>
          <SwiperSlide>
            <SecondStep />
          </SwiperSlide>
          <SwiperSlide>
            <ThirdStep />
          </SwiperSlide>
          <SwiperSlide>
            <FourthStep />
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="actions px-5 flex justify-between items-center w-full min-h-[56px] mb-24 mt-auto text-center">
        <div className="step-anotators flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              onClick={() => setSearchParams({ step: step.toString() })}
              className={`transition-all w-2.5 h-2.5 rounded-full cursor-pointer bg-white ${
                stepNumber === step && '!w-10 !bg-pastel-purple'
              }`}
            ></span>
          ))}
        </div>
        <button
          onClick={() => {
            if (stepNumber < SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT) {
              setSearchParams({ step: (stepNumber + 1).toString() });
            } else {
              handleFinish();
            }
          }}
          className={`bg-pastel-purple p-3 w-10 h-10 rounded-3xl transition-all duration-400 ${
            stepNumber === SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT &&
            '!rounded-xl !w-[165px] !h-14'
          }`}
        >
          {stepNumber < SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT ? (
            <img
              src="/assets/images/Shared/next-page.svg"
              data-testid="subjects-evaluation-onboarding-guide-next-button"
              className="translate-x-[1px] w-4 h-4 opacity-1 transition-all"
              alt=""
            />
          ) : (
            <p
              data-testid="subjects-evaluation-onboarding-guide-finish-button"
              className="font-semibold text-xl text-white transition-all opacity-1"
            >
              Let&apos;s Start
            </p>
          )}
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
