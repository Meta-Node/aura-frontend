const ProgressBar = ({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) => {
  return (
    <div
      className={`bg-[#D9D9D9] rounded-xl h-[14px] flex overflow-hidden ${className}`}
    >
      <div
        className={`bg-pastel-purple h-full rounded-xl !w-[${Math.min(
          progress,
          100,
        ).toString()}%]`}
      ></div>
    </div>
  );
};

export default ProgressBar;
