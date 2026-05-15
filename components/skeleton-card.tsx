import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props {
  index?: number;
}

export function SkeletonCard({ index = 0 }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(300)}
      style={{ marginHorizontal: 16, marginBottom: 12 }}
    >
      <Animated.View style={pulseStyle}>
        <View
          className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700"
          style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
        >
          <View style={{ width: 64, height: 64, borderRadius: 12 }} className="bg-gray-200 dark:bg-gray-700" />
          <View className="flex-1 ml-3 gap-2">
            <View className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
            <View className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
          </View>
          <View className="ml-3 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
