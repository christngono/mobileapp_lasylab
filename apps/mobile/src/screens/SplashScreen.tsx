import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Logo, Txt } from '../components';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const DOT_COLORS = [colors.yellow, colors.blue, colors.green];

/** Écran de démarrage : logo animé, points rebondissants, avance auto (2,6 s). */
export default function SplashScreen({ navigation }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dots = useRef(DOT_COLORS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 650,
          easing: Easing.out(Easing.back(1.6)),
          useNativeDriver: true,
        }),
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();

    const loops = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(d, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay((DOT_COLORS.length - i) * 200),
        ]),
      ),
    );
    loops.forEach((l) => l.start());

    const timer = setTimeout(go, 2600);
    return () => {
      clearTimeout(timer);
      loops.forEach((l) => l.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = () => navigation.replace('Onboarding');

  return (
    <Pressable style={styles.root} onPress={go}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Logo height={64} />
      </Animated.View>

      <View style={styles.dots}>
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: DOT_COLORS[i],
                transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
                opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
              },
            ]}
          />
        ))}
      </View>

      <Txt weight={800} size={12} color={colors.textDisabled} style={styles.hint}>
        TOUCHE POUR CONTINUER
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  dots: { flexDirection: 'row', gap: 7, marginTop: 38 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  hint: { position: 'absolute', bottom: 34, letterSpacing: 0.6 },
});
