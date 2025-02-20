import Tooltip from 'components/Shared/Tooltip';
import { FaLock } from 'react-icons/fa';

export const ToggleInput = ({
  option1,
  option2,
  isChecked,
  setIsChecked,
  option2Disabled = false,
  disabledHelpText = '',
  tooltipFirstTab,
  tooltipSecondTab,
}: {
  option1: string;
  option2: string;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
  option2Disabled?: boolean;
  disabledHelpText?: string;
  tooltipFirstTab?: string;
  tooltipSecondTab?: string;
}) => {
  return (
    <div className="px-1.5 py-1.5 w-full min-h-[52px] rounded-lg bg-card/90 dark:bg-dark-primary">
      <div className="flex flex-wrap relative h-10 overflow-hidden">
        {/* Background Toggle Effect */}
        <p
          className={`bg-button-primary dark:bg-stone-300 absolute w-1/2 top-0 bottom-0 rounded-md transition-all duration-300 ease-in-out ${isChecked ? 'left-0 right-1/2' : 'right-0 left-1/2'
            }`}
        ></p>

        {/* First Tab */}
        <Tooltip
          tooltipClassName="font-normal"
          content={tooltipFirstTab ?? option1}
          className={`bg-transparent cursor-pointer w-1/2 flex items-center justify-center transition-all duration-300 ease-in-out z-10 ${isChecked
            ? 'text-primary text-white dark:text-black font-bold'
            : 'dark:text-white text-black font-medium'
            }`}
          onClick={() => setIsChecked(true)}
          data-testid="table-view-switch-option-one"
        >
          {option1}
        </Tooltip>

        {/* Second Tab */}
        {option2Disabled ? (
          <Tooltip
            className={`bg-transparent cursor-pointer flex justify-center items-center w-1/2 h-full transition-all duration-300 ease-in-out z-10 ${isChecked
              ? 'text-black dark:text-white font-medium'
              : 'dark:text-black text-white font-bold'
              } dark:text-gray50 text-black opacity-60 cursor-not-allowed`}
            data-testid="table-view-switch-option-two"
            content={disabledHelpText}
          >
            {option2Disabled && <FaLock className="mr-1" />}
            {option2}
          </Tooltip>
        ) : (
          <Tooltip
            tooltipClassName="font-normal"
            content={tooltipSecondTab ?? option2}
            className={`bg-transparent cursor-pointer flex justify-center items-center w-1/2 h-full transition-all duration-300 ease-in-out z-10 ${isChecked
              ? 'text-black dark:text-white font-medium'
              : 'dark:text-black text-white font-bold'
              }`}
            onClick={() => setIsChecked(false)}
            data-testid="table-view-switch-option-two"
          >
            {option2Disabled && <FaLock className="mr-1" />}
            {option2}
          </Tooltip>
        )}
      </div>
    </div>
  );
};
