import React, { createContext, useRef, useContext, useCallback, useState, ReactNode } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import { View } from "react-native";

type ConfettiContextType = {
  triggerConfetti: () => void;
};

const ConfettiContext = createContext<ConfettiContextType>({
  triggerConfetti: () => {},
});

interface ConfettiProviderProps {
  children: ReactNode;
}

export const ConfettiProvider: React.FC<ConfettiProviderProps> = ({ children }) => {
  const confettiRef = useRef<ConfettiCannon>(null);
  const [visible, setVisible] = useState(false);

  const triggerConfetti = useCallback(() => {
    setVisible(true);
  }, []);

  const handleAnimationEnd = () => {
    setVisible(false);
  };

  return (
    <ConfettiContext.Provider value={{ triggerConfetti }}>
      {children}

      {visible && (
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          pointerEvents="none"
        >
          <ConfettiCannon
            ref={confettiRef}
            count={350}
            origin={{ x: -10, y: 0 }}
            fadeOut={true}
            autoStart={true} // start immediately once visible
            onAnimationEnd={handleAnimationEnd}
          />
        </View>
      )}
    </ConfettiContext.Provider>
  );
};

export const useConfetti = () => useContext(ConfettiContext);
