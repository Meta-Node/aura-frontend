import { JSX } from 'react';
import { FaAngleDown } from 'react-icons/fa';

interface DropdownItem {
  label: JSX.Element;
  value: string | number;
}

export default function Dropdown<T extends DropdownItem>({
  isDropdownOpen,
  setIsDropdownOpen,
  selectedItem,
  items,
  onItemClick,
  className,
}: {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectedItem: T;
  items: T[];
  onItemClick: (item: T) => void;
  className?: string;
}) {
  return (
    <div className="dropdown cursor-pointer">
      <div
        data-testid="confidence-dropdown-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex text-black dark:text-white relative items-center bg-white dark:bg-button-primary justify-between rounded-t-lg text-lg pl-5 md:pl-5 pr-3 cursor-pointer border border-gray10 ${
          !isDropdownOpen && 'rounded-b-lg'
        } ${className}`}
      >
        <span
          className="flex gap-1.5 md:gap-2.5 items-center"
          data-testid="confidence-dropdown-selected-label"
        >
          <p className="font-medium">{selectedItem.label}</p>
        </span>

        <FaAngleDown
          className={
            'w-3 h-3 text-gray-800 dark:text-gray100 md:w-[14px] md:h-[14px] ml-1'
          }
        />

        {isDropdownOpen && (
          <div className="dropdown__body absolute min-w-[300px] w-full top-full text-black dark:text-white items-center bg-white dark:bg-button-primary left-0 rounded-b-lg border border-gray10 z-[100]">
            {items.map((item) => (
              <div
                data-testid={`confidence-dropdown-option-${item.value}`}
                key={item.value}
                onClick={() => onItemClick(item)}
                className="dropdown__item flex items-center justify-between px-5 h-12 cursor-pointer hover:bg-gray10 hover:text-white"
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
