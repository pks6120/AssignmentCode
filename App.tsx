/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  ArrowBigUp,
  HeartIcon,
  MoveRight,
  MoveUp,
  SlidersHorizontal,
  UploadIcon,
  Volume,
  Volume2,
  VolumeOff,
} from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Video from 'react-native-video';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}
const window = Dimensions.get('window');
enum mediaType {
  'video',
  'image',
  'solid',
}
enum themeType {
  'light' = '#fff',
  'dark' = '#000',
}

interface DataType {
  id: number;
  type: mediaType;
  location: string;
  country: string;
  title: string;
  mediaUrl: string | null;
  theme: themeType;
}

const colors = {
  black: '#000',
  white: '#fff',
  semiTransBlack: 'rgb(0,0,0,0.15)',
  grey: '#808080',
};
const data = [
  {
    id: 1,
    type: mediaType.image,
    location: '32°14\'36" N, 77°11\'21" E',
    country: 'Turkey',
    title: 'Home Away From Home',
    theme: themeType.dark,
    mediaUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1080&h=1920&q=80',
  },
  {
    id: 2,
    type: mediaType.video,
    location: '32°14\'36" N, 77°11\'21" E',
    country: 'Keral',
    title: 'Mountain Sunrise Timelapse',
    theme: themeType.light,
    mediaUrl:
      'https://freenaturestock.com/wp-content/uploads/freenaturestock-rugged-ocean-coast.mp4',
  },
  {
    id: 3,
    type: mediaType.video,
    location: '32°15\'10" N, 77°12\'05" E',
    country: 'Himachal Pradesh',
    title: 'Snowy Trails Adventure',
    theme: themeType.light,
    mediaUrl:
      'https://freenaturestock.com/wp-content/uploads/freenaturestock-rolling-mist-clouds.mp4',
  },
  {
    id: 4,
    type: mediaType.image,
    location: '32°14\'50" N, 77°11\'55" E',
    country: 'Bali',
    title: 'Mist Over The Valley',
    theme: themeType.dark,
    mediaUrl:
      'https://wallpapers.com/images/high/portrait-photography-nature-mountain-stairs-lwn4r8bxuitgpf0u.webp',
  },
  {
    id: 5,
    type: mediaType.solid,
    location: '32°14\'36" N, 77°11\'21" E',
    country: 'Thailand',
    theme: themeType.light,
    title: 'Calm Mountain Breeze',
    mediaUrl: null,
  },
];

function AppContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].item.id);
    }
  }).current;
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <RenderCard
            item={item}
            isActive={item.id === activeIndex}
            muted={muted}
            setMuted={setMuted}
          />
        )}
        keyExtractor={item => `key_${item.id}`}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={window.height}
        decelerationRate="fast"
        snapToAlignment="center"
        disableIntervalMomentum={true}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const RenderCard = ({ item, isActive, muted, setMuted }) => {
  const background = () => {
    return item.type == mediaType.image ? (
      <Image
        source={{ uri: item.mediaUrl }}
        resizeMode="cover"
        style={styles.absoluteFill}
      />
    ) : item.type == mediaType.video ? (
      <Video
        source={{ uri: item.mediaUrl }}
        style={styles.absoluteFill}
        resizeMode="cover"
        repeat
        muted={muted}
        paused={false}
        playInBackground={false}
        playWhenInactive={false}
      />
    ) : null;
  };
  const mutedIcon = muted ? (
    <VolumeOff size={21} color={colors.black} strokeWidth={1} />
  ) : (
    <Volume2 size={21} color={colors.black} strokeWidth={1} />
  );
  return (
    <View style={styles.cardWrapper}>
      {background()}
      <View style={{ marginTop: 50, flex: 1 }}>
        <View style={styles.actionWrapper}>
          <MoveUp
            size={30}
            strokeWidth={1}
            color={colors.black}
            style={{ marginLeft: 16 }}
          />
          <View style={styles.actionWrapper}>
            <Pressable
              onPress={() => setMuted(!muted)}
              style={styles.headerAction}
            >
              {mutedIcon}
            </Pressable>
            <Pressable style={styles.headerAction}>
              <SlidersHorizontal
                size={21}
                color={colors.black}
                strokeWidth={1}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.mainWrapper}>
          <View style={styles.textWrapper}>
            <SlideUpText key={`${isActive}country`}>
              <Text style={{ color: item.theme }}>{item.country}</Text>
            </SlideUpText>
            <SlideUpText key={`${isActive}title`}>
              <Text style={[styles.titleText, { color: item.theme }]}>
                {item.title}
              </Text>
            </SlideUpText>
            <TextReveal
              theme={item.theme}
              isActive={`${isActive}location`}
              text={item.location}
            />
          </View>

          <RippleRing
            text={'EXPLORE • EXPLORE • EXPLORE • EXPLORE • EXPLORE • '}
          />
        </View>
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.bottomBlurView}
        />
        <View style={styles.bottomActionWrapper}>
          <Pressable style={styles.bottomActionButton}>
            <HeartIcon size={20} color={colors.white} />
            <Text style={styles.bottomActionText}>Like</Text>
          </Pressable>
          <Pressable style={styles.bottomActionButton}>
            <UploadIcon size={20} color={colors.white} />
            <Text style={styles.bottomActionText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const SlideUpText = ({ children, key, offset = 30, duration = 1000 }) => {
  const translateY = useSharedValue(offset);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [key]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const TextReveal = ({ text = '', speed = 80, isActive, theme }) => {
  const characters = useMemo(() => text.split(''), [text]);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      progress.value = 0; // reset
      progress.value = withTiming(1, {
        duration: characters.length * speed,
      });
    }
  }, [isActive]);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
      {characters.map((char, index) => (
        <AnimatedCharacter
          key={index}
          char={char}
          index={index}
          progress={progress}
          theme={theme}
        />
      ))}
    </View>
  );
};

const AnimatedCharacter = ({ char, index, progress, theme }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const charDelay = index * 0.03; // small stagger
    const show = progress.value > charDelay;

    return {
      opacity: show ? 1 : 0,
      transform: [{ translateX: show ? 0 : 10 }],
    };
  }, []);

  return (
    <Animated.Text style={[{ fontSize: 11, color: theme }, animatedStyle]}>
      {char}
    </Animated.Text>
  );
};

const CIRCLE_SIZE = 90; // outer circle
const TEXT_RADIUS = 44; // radius on which text sits
const SPEED = 13000; // lower is faster

const AnimatedCharCircle = ({ char, baseAngle, rotation }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const angle = (rotation.value + baseAngle) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = TEXT_RADIUS * Math.cos(rad);
    const y = TEXT_RADIUS * Math.sin(rad);

    return {
      position: 'absolute',

      left: CIRCLE_SIZE / 2 + x,
      top: CIRCLE_SIZE / 2 + y,
      transform: [
        { translateX: -3 },
        { translateY: -6 },
        { rotate: `${angle + 90}deg` },
      ],
    };
  });

  return (
    <Animated.Text
      style={[
        {
          fontSize: 10,
          fontWeight: '500',
          color: colors.white,
        },
        animatedStyle,
      ]}
    >
      {char}
    </Animated.Text>
  );
};

const RippleRing = ({ text }) => {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);

  const chars = useMemo(() => text.split(''), [text]);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
    rotation.value = withRepeat(
      withTiming(360, { duration: SPEED }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1.1, 1.4]);
    const opacity = interpolate(progress.value, [0, 1], [0.9, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View
      style={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
        alignSelf: 'center',
      }}
    >
      {chars.map((char, i) => {
        const angle = (i / chars.length) * 360;

        return (
          <AnimatedCharCircle
            key={i}
            char={char}
            baseAngle={angle}
            rotation={rotation}
          />
        );
      })}

      <Pressable style={styles.exploreButton}>
        <MoveRight size={25} color={colors.black} />
        <Animated.View
          style={[
            {
              width: 100,
              height: 100,
              borderRadius: 60,
              borderWidth: 1,
              borderColor: colors.white,
              position: 'absolute',
              top: -15,
              bottom: 0,
            },
            animatedStyle,
          ]}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  cardWrapper: {
    height: window.height,
    width: window.width,
    backgroundColor: 'pink',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: window.height,
    width: window.width,
    aspectRatio: 16 / 9,
  },
  actionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBlurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  bottomActionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 35,
  },
  exploreButton: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 70,
    position: 'relative',
  },
  bottomActionButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    color: colors.white,
  },
  bottomActionText: {
    color: colors.white,
    fontSize: 13,
  },
  headerAction: {
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.semiTransBlack,
    padding: 5,
    marginRight: 13,
  },
  titleText: {
    fontSize: 25,
    fontWeight: '700',
    marginVertical: 25,
  },
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});

export default App;
