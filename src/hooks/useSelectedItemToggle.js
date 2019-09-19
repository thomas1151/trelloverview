import { useState } from "react";


export default function useSelectedItemToggle(item) {
    const [selectedItem, setSelectedItem] = useState(item || '');
    const isSelected = (el) => (selectedItem === el)

    const toggleSelectedItem = (el) => {
        isSelected(el) ? setSelectedItem('') : setSelectedItem(el);
    }

    return { isSelectedFn: isSelected, toggleSelected: toggleSelectedItem, selectedState: [selectedItem, setSelectedItem] };
}

