import { useRef, useState, useEffect, useCallback } from 'react';

// Use a shared type or import it if better centralized,
// for now defining here to avoid circular dep issues during refactor

interface UseGuildScrollReturn {
  pendingScrollGuild: number | null;
  selectedGuild: number | null;
  isProgrammaticScroll: React.MutableRefObject<boolean>;
  setPendingScrollGuild: (id: number | null) => void;
  setSelectedGuild: (id: number | null) => void;
  scrollToGuild: (
    guildId: number,
    updateUrlCallback: (params: any) => void,
    closeSidebarCallback: () => void,
  ) => void;
  handleAutoScroll: (dataReady: boolean) => void;
}

export function useGuildScroll(): UseGuildScrollReturn {
  const [pendingScrollGuild, setPendingScrollGuild] = useState<number | null>(
    null,
  );
  const [selectedGuild, setSelectedGuild] = useState<number | null>(null);
  const isProgrammaticScroll = useRef(false);

  const scrollToGuild = useCallback(
    (
      guildId: number,
      updateUrlCallback: (params: any) => void,
      closeSidebarCallback: () => void,
    ) => {
      isProgrammaticScroll.current = true;
      const element = document.getElementById(`guild-${guildId}`);
      const scrollContainer = document.getElementById('main-scroll-container');

      if (element && scrollContainer) {
        const isMobile = window.innerWidth < 1024;
        const headerOffset = isMobile ? 80 : 0; // Mobile header height + padding
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        scrollContainer.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        closeSidebarCallback();
        updateUrlCallback({ guild: String(guildId) });

        // Reset after animation
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 1000);
      }
    },
    [],
  );

  const handleAutoScroll = (dataReady: boolean) => {
    if (dataReady && pendingScrollGuild !== null) {
      // Small timeout to ensure DOM render
      setTimeout(() => {
        // We need to re-find element here or pass logic,
        // simpler to just call the logic directly if we had callbacks available,
        // but for separation, we might just return the ID to the component to handle the effect
      }, 100);
    }
  };

  return {
    pendingScrollGuild,
    selectedGuild,
    isProgrammaticScroll,
    setPendingScrollGuild,
    setSelectedGuild,
    scrollToGuild,
    handleAutoScroll,
  };
}
