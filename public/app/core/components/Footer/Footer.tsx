import React, { FC } from 'react';
import config from 'app/core/config';
import { Icon, IconName } from '@grafana/ui';

export interface FooterLink {
  text: string;
  icon?: string;
  url?: string;
  target?: string;
}

export let getFooterLinks = (): FooterLink[] => {
  return [];
};

export let getVersionLinks = (): FooterLink[] => {
  const { buildInfo } = config;
  const links: FooterLink[] = [];

  if (buildInfo.hideVersion) {
    return links;
  }

  links.push({ text: `v${buildInfo.version} (${buildInfo.commit})` });

  return links;
};

export function setFooterLinksFn(fn: typeof getFooterLinks) {
  getFooterLinks = fn;
}

export function setVersionLinkFn(fn: typeof getFooterLinks) {
  getVersionLinks = fn;
}

export const Footer: FC = React.memo(() => {
  const links = getFooterLinks().concat(getVersionLinks());

  return (
    <footer className="footer">
      <div className="text-center">
        <ul>
          {links.map((link) => (
            <li key={link.text}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.icon && <Icon name={link.icon as IconName} />} {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
