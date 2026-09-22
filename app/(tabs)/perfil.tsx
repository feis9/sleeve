import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileView } from '@/components/profile-view';
import { colors } from '@/constants/theme';
import { ME_ID } from '@/data/mock';

export default function PerfilScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ProfileView userId={ME_ID} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
