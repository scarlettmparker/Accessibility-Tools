import React, { useEffect, useState } from "react";
import themes from '../utils/json/themes.json';
import { changeTheme } from "../utils/theme/themehelper";
import { resetTheme, saveOriginalColors } from "../utils/theme/reset";

export const Theme: React.FC = React.memo(() => {
    const [selectedTheme, setSelectedTheme] = useState<string>(() => localStorage.getItem('selectedTheme') || '#FFFFFF');
    const [originalColors, setOriginalColors] = useState<{ colors: Map<string, string>, elements: HTMLElement[] }>({ colors: new Map(), elements: [] });

    useEffect(() => {
        // if original colours are not saved, save them
        if (!originalColors.colors.size) {
            saveOriginalColors({ setOriginalColors });
        }

        resetTheme(document.body, originalColors.colors);

        // default theme, set to original colours
        if (selectedTheme === '#FFFFFF') {
            localStorage.removeItem('selectedTheme');
        } else {
            // change to a new theme
            changeTheme(selectedTheme);
            localStorage.setItem('selectedTheme', selectedTheme);
        }
    }, [selectedTheme]);

    const handleThemeChange = (themeColor: string) => {
        setSelectedTheme(themeColor);
    };

    return (
        <div className="theme">
            <div className="themeSelectMenu">
                {themes.map((theme) => (
                    <span key={theme.name} onClick={() => handleThemeChange(theme.color)}
                        className={`extButton themeButton ${selectedTheme === theme.color ? 'selected' : 'Default'}`}>
                        {theme.name + (theme.name === "Default" ? "" : " Theme")}
                    </span>
                ))}
            </div>
        </div>
    );
});

export default Theme;