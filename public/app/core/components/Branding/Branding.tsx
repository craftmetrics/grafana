import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useTheme2 } from '@grafana/ui';
import { colorManipulator } from '@grafana/data';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps> = ({ className }) => {
  const maxSize = css`
    max-width: 180px;
  `;

  return (
    <>
      <img className={cx(className, maxSize)} src="public/img/cm_stacktop_rev.png" alt="Craft Metrics" />
    </>
  );
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme2();

  const background = css`
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: url(public/img/g8_login_${theme.isDark ? 'dark' : 'light'}.svg);
      background-size: cover;
      opacity: 0;
      transition: opacity 3s ease-in-out;
    }
  `;

  return <div className={cx(background, className)}>{children}</div>;
};

export const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src="public/img/cm_logo.png" alt="Craft Metrics" />;
};

const LoginBoxBackground = () => {
  const theme = useTheme2();
  return css`
    background: ${colorManipulator.alpha(theme.colors.background.primary, 0.5)};
    background-size: cover;
  `;
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'Craft Metrics';
  static LoginTitle = 'Craft Metrics Login';
  static GetLoginSubTitle = (): null | string => {
    return null;
  };
}
