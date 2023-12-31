export const ToggleInput = ({
  option1,
  option2,
  isChecked,
  setIsChecked,
}: {
  option1: string;
  option2: string;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}) => {
  return (
    <div className="px-1.5 py-1.5 w-full min-h-[48px] rounded-lg bg-white-90-card">
      <div className={'flex flex-wrap relative h-full'}>
        <p
          className={`background bg-pastel-purple absolute w-1/2 top-0 bottom-0 rounded-md transition-all duration-300 ease-in-out ${
            isChecked ? 'left-0 right-1/2' : 'right-0 left-1/2'
          }`}
        ></p>
        <p
          className={`bg-transparent absolute cursor-pointer w-1/2 h-full flex items-center justify-center left-0 top-1/2 -translate-y-1/2 font-medium transition-all duration-300 ease-in-out ${
            isChecked ? 'text-black' : 'text-black'
          }`}
          onClick={() => setIsChecked(true)}
          data-testid="table-view-switch-option-one"
        >
          {option1}
        </p>
        <p
          className={`bg-transparent absolute cursor-pointer flex justify-center items-center w-1/2 h-full right-0 top-1/2 -translate-y-1/2 font-medium transition-all duration-300 ease-in-out ${
            isChecked ? 'text-black' : 'text-black'
          }`}
          onClick={() => setIsChecked(false)}
          data-testid="table-view-switch-option-two"
        >
          {option2}
        </p>
      </div>
    </div>
  );
};
