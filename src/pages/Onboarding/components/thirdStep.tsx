import { FadeIn, MoveUpIn, Scale } from '../../../animations';

const ThirdStep = () => {
  return (
    <>
      <span className="flex items-start gap-4 mb-3 pl-5 pr-12">
        <p className="text-white text-5xl font-black">3</p>
        <p className="text-pastel-purple text-3xl font-black">
          Evaluate <br />
          the Subject
        </p>
      </span>
      <p className="text-white font-medium text-lg pl-5 pr-20 mb-20">
        Once you feel you have enough information to evaluate, tell us what you
        what you think about the subject and how confident are you about your
        answer
      </p>

      <section className="relative flex items-center justify-center w-fit mx-auto mb-3">
        <MoveUpIn
          delay={0.2}
          duration={0.3}
          y={10}
          y_end={'-120%'}
          className="absolute top-0 left-0 -translate-x-1/3"
        >
          <img src="/assets/images/onboarding/like.svg" alt="step3" />
        </MoveUpIn>
        <Scale delay={0.1} duration={0.3} scale={0.7}>
          <img
            src="/assets/images/onboarding/profile-card.svg"
            alt="step3"
            className=""
          />
        </Scale>
        <MoveUpIn
          delay={0.2}
          duration={0.3}
          y={-10}
          className="absolute bottom-0 right-0 translate-x-1/3"
          y_end={'120%'}
        >
          <img src="/assets/images/onboarding/dislike.svg" alt="step3" />
        </MoveUpIn>
      </section>

      <FadeIn
        duration={0.3}
        delay={0.4}
        className="flex gap-1.5 w-full justify-center pr-12"
      >
        <p className="text-white font-medium text-lg mt-5">I have</p>
        <div className="flex flex-col items-center justify-center">
          <p className="text-pastel-purple font-black text-[15px] opacity-50 -mb-0.5">
            Low
          </p>
          <p className="text-pastel-purple font-black text-lg">Medium</p>
          <p className="text-pastel-purple font-black text-sm opacity-50 mb-0.5">
            High
          </p>
          <p className="text-pastel-purple font-black text-xs opacity-30">
            Very High
          </p>
        </div>
        <p className="text-white font-medium text-lg mt-5">confidence</p>
      </FadeIn>
    </>
  );
};

export default ThirdStep;
