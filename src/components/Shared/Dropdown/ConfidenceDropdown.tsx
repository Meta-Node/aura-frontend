import { useEffect, useMemo, useState } from 'react';

import Dropdown from './index';

const ConfidenceDropdown = ({
  confidence,
  setConfidence,
}: {
  confidence: number;
  setConfidence: (value: number) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = useMemo(
    () => [
      {
        value: 1,
        label: (
          <p>
            I have <strong>Low</strong> confidence
          </p>
        ),
      },
      {
        value: 2,
        label: (
          <p>
            I have <strong>Medium</strong> confidence
          </p>
        ),
      },
      {
        value: 3,
        label: (
          <p>
            I have <strong>High</strong> confidence
          </p>
        ),
      },
      {
        value: 4,
        label: (
          <p>
            I have <strong>Very High</strong> confidence
          </p>
        ),
      },
    ],
    [],
  );

  const [selectedItem, setSelectedItem] = useState(options[0]);
  useEffect(() => {
    const item = options.find((o) => o.value === confidence);
    if (item) {
      setSelectedItem(item);
    }
  }, [confidence, options]);
  return (
    <Dropdown
      items={options}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      selectedItem={selectedItem}
      onItemClick={(item) => {
        setSelectedItem(item);
        setConfidence(item.value);
        setIsDropdownOpen(false);
      }}
      className="h-12 !w-full"
    />
  );
};

export default ConfidenceDropdown;
