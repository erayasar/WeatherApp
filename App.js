import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animationValues, setAnimationValues] = useState([]);

  const API_KEY = 'dee5f16f4bd70aaa85be93af05ba0350';
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
      startAnimation(response.data.weather[0].description);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const startAnimation = (description) => {
    const emoji = getWeatherEmoji(description);
    const animations = Array.from({ length: 10 }, () => new Animated.Value(-50));

    setAnimationValues(animations);

    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: SCREEN_HEIGHT,
        duration: 3000 + index * 200, // Her emoji için farklı zamanlama
        useNativeDriver: true,
      }).start();
    });
  };

  const getWeatherEmoji = (description) => {
    if (description.includes('cloud')) return '☁️';
    if (description.includes('rain')) return '🌧️';
    if (description.includes('snow')) return '❄️';
    if (description.includes('sun')) return '☀️';
    return '🌍'; // Genel emoji
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        placeholderTextColor="#fff"
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>
            {getWeatherEmoji(weather.weather[0].description)} {weather.name}
          </Text>
          <Text style={styles.weatherText}>
            Temperature: {weather.main.temp}°C
          </Text>
          <Text style={styles.weatherText}>
            Description: {weather.weather[0].description}
          </Text>
        </View>
      )}
      {animationValues.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.emoji,
            {
              transform: [{ translateY: anim }],
              left: Math.random() * Dimensions.get('window').width, // Emojilerin yatay pozisyonunu rastgele yapıyoruz
            },
          ]}
        >
          <Text style={styles.emojiText}>
            {weather ? getWeatherEmoji(weather.weather[0].description) : '🌍'}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4e9dff',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  error: {
    color: '#f00',
    marginTop: 10,
    fontSize: 16,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
    fontFamily: 'Roboto-Regular',
  },
  emoji: {
    position: 'absolute',
    top: 0,
  },
  emojiText: {
    fontSize: 40,
  },
});

export default App;
