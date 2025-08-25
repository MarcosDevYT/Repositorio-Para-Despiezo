import { RefObject } from "react";

export const UseDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240;

    // calculate initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // check is dropdown would be go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      // Align to right edge of button instead
      left = rect.right + window.scrollX - dropdownWidth;

      // If still off-screen, align to left edge of button
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }

    // Ensure Dropdown doesn't go off left edge
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
