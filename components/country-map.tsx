import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useAppSettings } from '@/context/settings';
import type { Country } from '@/data/countries';

export type CountryMapProps = {
  country: Country;
  // Texto del globo que aparece al tocar el marcador.
  title: string;
  description: string;
};

const MAP_HEIGHT = 200;

// Mapa nativo (Apple Maps en iOS, Google Maps en Android). En web se usa country-map.web.tsx.
export function CountryMap({ country, title, description }: CountryMapProps) {
  const { colors, colorMode } = useAppSettings();

  return (
    // En Android el MapView ignora borderRadius: lo recorta el contenedor.
    <View style={styles.clip}>
      <MapView
        // Remontamos al cambiar de tema: userInterfaceStyle solo se aplica al crear el mapa.
        key={colorMode}
        style={styles.map}
        initialRegion={{
          latitude: country.latitude,
          longitude: country.longitude,
          latitudeDelta: country.delta,
          longitudeDelta: country.delta,
        }}
        // Mapa fijo: sin gestos, para no pelear con el scroll del detalle.
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        userInterfaceStyle={colorMode === 'DARK' ? 'dark' : 'light'}>
        <Marker
          coordinate={{ latitude: country.latitude, longitude: country.longitude }}
          pinColor={colors.primary}
          title={title}
          description={description}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    height: MAP_HEIGHT,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
