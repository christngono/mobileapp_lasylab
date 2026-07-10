import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Txt } from './Txt';
import { ChevronDown, CheckIcon } from './icons';
import { colors, radius } from '../theme';

export interface PickerOption {
  label: string;
  value: string;
}

interface PickerFieldProps {
  label?: string;
  placeholder: string;
  title?: string;
  value: string | null;
  options: PickerOption[];
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
}

/** Champ « select » qui ouvre une liste d'options en bottom-sheet. */
export function PickerField({
  label,
  placeholder,
  title,
  value,
  options,
  onSelect,
  containerStyle,
}: PickerFieldProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View style={containerStyle}>
      {label ? (
        <Txt weight={800} size={13} color={colors.textMuted} style={styles.label}>
          {label}
        </Txt>
      ) : null}
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Txt weight={700} size={14} color={current ? colors.ink : colors.textMuted} numberOfLines={1}>
          {current ? current.label : placeholder}
        </Txt>
        <ChevronDown />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Txt family="baloo" weight={800} size={18} color={colors.ink} align="center" style={styles.sheetTitle}>
              {title ?? placeholder}
            </Txt>
            <ScrollView>
              {options.map((o) => {
                const sel = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    style={styles.item}
                    onPress={() => {
                      onSelect(o.value);
                      setOpen(false);
                    }}
                  >
                    <Txt weight={sel ? 800 : 700} size={16} color={sel ? colors.blue : colors.ink}>
                      {o.label}
                    </Txt>
                    {sel ? <CheckIcon size={18} color={colors.blue} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginLeft: 6, marginBottom: 5 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    paddingVertical: 18,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  sheetTitle: { marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
});
