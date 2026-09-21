import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de carregando em loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Redirecionamento de tela após 2.5s (splash_2.html)
    const timer = setTimeout(() => {
      navigation.replace('MainDrawer');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Elementos Decorativos de Fundo */}
      <View style={[styles.blob, styles.blobTopLeft]} />
      <View style={[styles.blob, styles.blobBottomRight]} />

      <View style={styles.content}>
        {/* Logo Icon */}
        <View style={styles.iconCircle}>
          <View style={styles.iconSquare}>
            <View style={styles.rhombus} />
          </View>
        </View>

        <Text style={styles.brandTitle}>Docisis</Text>
        <Text style={styles.brandSubtitle}>GESTÃO DE ESTOQUE</Text>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando seus dados…</Text>
          <View style={styles.track}>
            <Animated.View style={[styles.bar, { width: widthInterpolate }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, justifyContent: 'center', alignItems: 'center' },
  blob: { position: 'absolute', width: 288, height: 288, borderRadius: 144, opacity: 0.5 },
  blobTopLeft: { top: -96, left: -96, backgroundColor: colors.blush[100] },
  blobBottomRight: { bottom: -96, right: -96, backgroundColor: colors.cocoa[200] },
  content: { alignItems: 'center', zIndex: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: colors.cocoa[200], borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  iconSquare: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.cocoa[500], justifyContent: 'center', alignItems: 'center' },
  rhombus: { width: 12, height: 12, backgroundColor: colors.cream, transform: [{ rotate: '45deg' }], borderRadius: 2 },
  brandTitle: { fontSize: 28, fontWeight: '700', color: colors.cocoa[700] },
  brandSubtitle: { fontSize: 11, letterSpacing: 2, color: colors.cocoa[400], fontWeight: '500', marginTop: 4 },
  loadingContainer: { marginTop: 64, alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 12, color: colors.cocoa[400] },
  track: { width: 128, height: 4, borderRadius: 2, backgroundColor: colors.cocoa[200], overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.cocoa[500], borderRadius: 2 },
});