import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function PasswordField({ value, onChangeText, placeholder = 'Sua senha' }) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={colors.cocoa[400]}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => setSecureTextEntry(!secureTextEntry)}
        style={styles.toggleBtn}
      >
        <Text style={styles.toggleText}>
          {secureTextEntry ? 'mostrar' : 'ocultar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', width: '100%', justifyContent: 'center' },
  input: { width: '100%', height: 48, borderWidth: 1, borderColor: colors.cocoa[200], borderRadius: 8, paddingHorizontal: 12, paddingRight: 70, color: colors.cocoa[800] },
  toggleBtn: { position: 'absolute', right: 12 },
  toggleText: { fontSize: 12, color: colors.cocoa[400], fontWeight: '500' },
});