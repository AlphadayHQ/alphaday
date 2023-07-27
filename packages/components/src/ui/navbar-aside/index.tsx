import React from "react";
import { useLocation } from "react-router-dom";
import { IMenu } from "@alphaday/shared/types";
import { getSiblings } from "@alphaday/shared/methods";
import cn from "classnames";
import {
  StyledNavbar,
  StyledNavitem,
  StyledNavlink,
  StyledSubmenu,
  StyledSubNavItem,
  StyledSubNavlink,
} from "./style";

interface IProps {
  menus: IMenu[];
}

const NavbarAside: React.FC<IProps> = ({ menus }) => {
  const location = useLocation();

  const clickHandler = (e: React.MouseEvent, hasChildren: boolean) => {
    if (hasChildren) {
      e.preventDefault();
      let target = e.currentTarget as HTMLElement;
      if (target.nodeName === "A") {
        target = target.parentElement as HTMLElement;
      }
      const submenu = target.querySelector(".mega-submenu");
      const siblings = getSiblings(target);
      submenu?.classList.toggle("open");
      target.classList.toggle("open");
      siblings.forEach((sib) => {
        sib.classList.remove("open");
        sib.childNodes.forEach((child) => {
          const childHT = child as HTMLElement;
          childHT?.classList?.remove("open");
        });
      });
    }
  };
  return (
    <StyledNavbar className="aside-navbar">
      {menus?.map((nav: IMenu) => {
        const { submenu, megamenu, id: navId, label: navLabel } = nav;
        const hasSubmenu = !!submenu?.length;
        const hasMegamenu = !!megamenu?.length;
        const hasChildren = hasSubmenu || hasMegamenu;
        return (
          <StyledNavitem $hasSubmenu={hasChildren} key={navId}>
            <StyledNavlink
              path={hasChildren ? "#!" : nav.url}
              className="aside-navbar-label"
            >
              {navLabel}
            </StyledNavlink>
            {hasSubmenu && (
              <StyledSubmenu className="submenu">
                {submenu?.map(({ id, label, url, Icon }) => (
                  <StyledSubNavItem key={id}>
                    <StyledSubNavlink
                      path={url}
                      className={cn(
                        location.pathname === url ? "active" : "",
                        "aside-navbar-link"
                      )}
                    >
                      {Icon && <Icon />}
                      <span>{label}</span>
                    </StyledSubNavlink>
                  </StyledSubNavItem>
                ))}
              </StyledSubmenu>
            )}
            {hasMegamenu && (
              <StyledSubmenu className="submenu">
                {megamenu?.map(({ id, title, Icon, submenu: megaSubmenu }) => {
                  const hasMegaSubmenu = !!megaSubmenu?.length;
                  return (
                    <StyledSubNavItem
                      key={id}
                      onClick={(e) => clickHandler(e, hasChildren)}
                      className={hasMegaSubmenu ? "with-sub" : ""}
                    >
                      <StyledSubNavlink path="#!" className="aside-navbar-link">
                        {Icon && <Icon />}
                        <span>{title}</span>
                      </StyledSubNavlink>
                      {hasMegaSubmenu && (
                        <StyledSubmenu className="mega-submenu">
                          {megaSubmenu?.map((subnav) => (
                            <StyledSubNavItem key={subnav.id}>
                              <StyledSubNavlink
                                className={
                                  location.pathname === subnav.url
                                    ? "active"
                                    : ""
                                }
                                path={subnav.url}
                              >
                                {subnav.label}
                              </StyledSubNavlink>
                            </StyledSubNavItem>
                          ))}
                        </StyledSubmenu>
                      )}
                    </StyledSubNavItem>
                  );
                })}
              </StyledSubmenu>
            )}
          </StyledNavitem>
        );
      })}
    </StyledNavbar>
  );
};

NavbarAside.defaultProps = {
  menus: [],
};

export default NavbarAside;

// {hasSubmenu && (
//     <StyledSubmenu className="submenu">
//         {submenu?.map(({ id, label, url, Icon }) => (
//             <StyledSubNavItem key={id}>
//                 <StyledSubNavlink path={url}>
//                     {Icon && <Icon />}
//                     {label}
//                 </StyledSubNavlink>
//             </StyledSubNavItem>
//         ))}
//     </StyledSubmenu>
// )}
