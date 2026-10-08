"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * AdScripts Component
 * Dynamically loads publisher ad scripts (Monetag, Adsterra, PopAds, etc.)
 * for free guest users.
 * 
 * IMPORTANT FOR VIP USERS:
 * When a user logs in with valid VIP credentials (isVip === true),
 * all ad scripts are blocked, suppressed, and cleaned from the DOM.
 */
export function AdScripts() {
  const { isVip } = useAuth();

  useEffect(() => {
    // If user is VIP, do not inject any ad scripts, and remove any leftover tags
    if (isVip) {
      const adElements = document.querySelectorAll("[data-movbazaar-ad]");
      adElements.forEach((el) => el.remove());
      return;
    }

    const monetagTagId = process.env.NEXT_PUBLIC_MONETAG_TAG_ID;
    const adsterraKey = process.env.NEXT_PUBLIC_ADSTERRA_KEY;
    const popadsId = process.env.NEXT_PUBLIC_POPADS_ID;

    // 1. Inject Monetag MultiTag (if configured)
    if (monetagTagId && !document.getElementById("monetag-multitag")) {
      const script = document.createElement("script");
      script.id = "monetag-multitag";
      script.setAttribute("data-movbazaar-ad", "monetag");
      script.src = `https://alwingulla.com/${monetagTagId}`;
      script.async = true;
      document.head.appendChild(script);
    }

    // 2. Inject Adsterra Social Bar / Native Script (if configured)
    if (adsterraKey && !document.getElementById("adsterra-script")) {
      const script = document.createElement("script");
      script.id = "adsterra-script";
      script.setAttribute("data-movbazaar-ad", "adsterra");
      script.src = `//pl${adsterraKey}.highperformancegate.com/${adsterraKey}/invoke.js`;
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. Inject PopAds Popunder (if configured)
    if (popadsId && !document.getElementById("popads-script")) {
      const script = document.createElement("script");
      script.id = "popads-script";
      script.setAttribute("data-movbazaar-ad", "popads");
      script.type = "text/javascript";
      script.innerHTML = `
        var _pop = _pop || [];
        _pop.push(['siteId', ${popadsId}]);
        _pop.push(['minBid', 0]);
        _pop.push(['popundersPerIP', 2]);
        _pop.push(['delayBetween', 0]);
        _pop.push(['default', false]);
        _pop.push(['defaultPerDay', 0]);
        _pop.push(['topmostLayer', false]);
        (function() {
          var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
          var s = document.getElementsByTagName('script')[0]; 
          pa.src = '//c1.popads.net/pop.js';
          s.parentNode.insertBefore(pa, s);
        })();
      `;
      document.body.appendChild(script);
    }
  }, [isVip]);

  return null;
}

