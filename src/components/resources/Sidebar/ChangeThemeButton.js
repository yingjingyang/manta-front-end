import React, { useContext } from 'react';
import classNames from 'classnames';
import FormSwitch from 'components/elements/Form/FormSwitch';
import { ThemeContext } from 'contexts/theme.context';
import Images from 'common/Images';
import { themeType } from 'constants/theme.constant';

const ChangeThemeButton = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === themeType.Dark;
  return (
    <div className="p-2">
      <FormSwitch
        checked={isDark}
        onLabel={
          <img
            className={classNames('absolute theme-icon left-1 top-1', {
              iconActive: !isDark,
            })}
            src={Images.SunIcon}
            alt="sun-icon"
          />
        }
        offLabel={
          <img
            className={classNames('absolute theme-icon right-1 bottom-1.5', {
              iconActive: isDark,
            })}
            src={Images.MoonIcon}
            alt="off-icon"
          />
        }
        onChange={(e) => setTheme(e.target.checked ? themeType.Dark : themeType.Light)}
      />
    </div>
  );
};

export default ChangeThemeButton;
