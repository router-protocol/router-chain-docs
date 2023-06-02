import React from 'react';
import { paramCase } from 'param-case';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export function HomepageSection({
  id,
  title,
  children,
  description,
  className,
  hasSubSections = false,
  HeadingTag = 'h3',
}) {
  return (
    <div
      className={clsx(
        'homepage-section',
        hasSubSections && 'has-sub-sections',
        className
      )}
    >
      {title && <HeadingTag id={id ?? paramCase(title)}>{title}</HeadingTag>}
      {description && <p className="section-description">{description}</p>}
      <div className="section-content">{children}</div>
    </div>
  );
}

export function DocVersion(){
  return(
            <div class="theme-admonition theme-admonition-info alert alert--info admonition_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module" style={{marginBottom: "20px"}}>
                <div class="admonitionContent_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
                The documentation provided below pertains to Router V2. If you require documentation for V1, please refer to the <b><a href="https://v1.docs.routerprotocol.com/" target="_blank">following link</a></b>.
              </div></div>
  );
}
export function HomepageCard({ id, icon, svgFile, title, description, to, bottomText }) {
  return (
    <Link to={to} className="homepage-card">
      <div className="detail">
        {svgFile
        ?  <div className="icon"><img src={svgFile}/></div>
        :  icon && <div className="icon" style={{paddingBottom: "10px", marginTop:"3px"}}>{icon}</div>
        }
        <div className="card-content">
          <div className="title" id={id && paramCase(title)}>
            {title}
          </div>
          <div className="description">{description}</div>
          </div>
      </div>
      <div className="bottomText" style={{textAlign: "center", color: "blue", margin: "0 auto"}}>{bottomText}</div>
    </Link>
  );
}
