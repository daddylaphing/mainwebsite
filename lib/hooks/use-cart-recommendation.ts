"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useSiteConfig } from "./use-site-config";

interface RecommendationState {
  shouldShow: boolean;
  kitQty: number;
  extraSheets: number;
  dismissed: boolean;
}

export function useCartRecommendation(kitQuantity: number, extraSheets: number) {
  const { data: config } = useSiteConfig();
  const [state, setState] = useState<RecommendationState>({
    shouldShow: false,
    kitQty: kitQuantity,
    extraSheets: extraSheets,
    dismissed: false,
  });

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem("recommendation_dismissed") === "true";
    if (dismissed) {
      setState((prev) => ({ ...prev, dismissed: true }));
      return;
    }

    if (!config) return;

    // Recommendation logic
    const threshold = config.recommendation_threshold.extra_sheets_count;
    const shouldShowPopup = extraSheets >= threshold && kitQuantity >= config.min_kit_qty;

    // Calculate if adding kit is actually better value
    const costOfExtraSheets = extraSheets * config.extra_sheet_price;
    const costOfAdditionalKit = config.laphing_kit_price;
    
    // Only show if adding kit would be beneficial
    // (Kit includes sheet + all other components)
    const isBetterValue = costOfExtraSheets >= costOfAdditionalKit * 0.7; // 70% threshold

    setState({
      shouldShow: shouldShowPopup && isBetterValue && !dismissed,
      kitQty: kitQuantity,
      extraSheets: extraSheets,
      dismissed,
    });
  }, [kitQuantity, extraSheets, config]);

  const dismiss = () => {
    sessionStorage.setItem("recommendation_dismissed", "true");
    setState((prev) => ({ ...prev, shouldShow: false, dismissed: true }));
  };

  const reset = () => {
    sessionStorage.removeItem("recommendation_dismissed");
    setState((prev) => ({ ...prev, dismissed: false }));
  };

  return {
    shouldShowRecommendation: state.shouldShow,
    dismiss,
    reset,
  };
}
