import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { ChevronsRight } from 'lucide-react-native';

interface SwipeButtonProps {
  onSwipeSuccess: () => void;
  title: string;
  color?: string;
}

const BUTTON_WIDTH = Dimensions.get('window').width - 32;
const SWIPE_RANGE = BUTTON_WIDTH - 64; // Button padding + slider size

export const SwipeButton: React.FC<SwipeButtonProps> = ({
  onSwipeSuccess,
  title,
  color = '#E53935', // Brand red default
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [success, setSuccess] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (success) return;
        
        // Constrain slider movement within the range [0, SWIPE_RANGE]
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > SWIPE_RANGE) newX = SWIPE_RANGE;
        
        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (e, gestureState) => {
        if (success) return;

        if (gestureState.dx >= SWIPE_RANGE * 0.8) {
          // Trigger success! Animated to the end
          setSuccess(true);
          Animated.timing(pan, {
            toValue: { x: SWIPE_RANGE, y: 0 },
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            onSwipeSuccess();
            // Reset state
            setTimeout(() => {
              pan.setValue({ x: 0, y: 0 });
              setSuccess(false);
            }, 500);
          });
        } else {
          // Snap back to beginning
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, { borderColor: color }]}>
      {/* Background slide track text */}
      <View style={styles.textContainer}>
        <Text style={styles.swipeText}>{success ? 'Success!' : title}</Text>
      </View>

      {/* Swipe slider thumb */}
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [{ translateX: pan.x }],
            backgroundColor: color,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ChevronsRight color="#FFFFFF" size={24} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeText: {
    color: '#E0E0E0',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  slider: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
