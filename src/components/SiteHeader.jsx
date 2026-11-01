import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { copy } from "../content";
import ThemeToggle from "./ThemeToggle";
import { Brand, CTAGroup } from "./UI";
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const drawer = useRef(null),
    trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const el = drawer.current;
    const button = trigger.current;
    el.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      button?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label={copy.common.mainNavigation}>
          {copy.nav.map((item) => (
            <Link to={item.path} key={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <CTAGroup location="nav" />
          <button
            ref={trigger}
            type="button"
            className="icon-button mobile-menu-toggle"
            aria-label={copy.common.menu}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      <dialog
        ref={drawer}
        className="navigation-drawer"
        id="mobile-navigation"
        aria-label={copy.common.mobileNavigation}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        {open && (
          <>
            <div className="drawer-top">
              <Brand />
              <button
                autoFocus
                type="button"
                className="icon-button"
                aria-label={copy.common.closeMenu}
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <nav aria-label={copy.common.mobileNavigation}>
              {copy.nav.map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            <CTAGroup location="nav" />
          </>
        )}
      </dialog>
    </header>
  );
}
