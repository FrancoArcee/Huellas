import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';

interface Props {
  size?: number;
}

export const SuccessCheckIcon = React.memo(({ size = 350 }: Props) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      animationRef.current?.play(0, 45);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LottieView
      ref={animationRef}
      source={require('../../../assets/icons/notification/success.json')}
      loop={false}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
});