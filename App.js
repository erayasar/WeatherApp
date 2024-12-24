import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const App = () => {
  const [city, setCity] = useState(''); // Kullanıcının gireceği şehir
  const [weather, setWeather] = useState(null); // Hava durumu verileri
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata mesajları

  const API_KEY = 'dee5f16f4bd70aaa85be93af05ba0350'; // OpenWeatherMap API anahtarınızı buraya ekleyin

  // Hava durumu verisini çekme fonksiyonu
  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.weatherText}>City: {weather.name}</Text>
          <Text style={styles.weatherText}>
            Temperature: {weather.main.temp}°C
          </Text>
          <Text style={styles.weatherText}>
            Description: {weather.weather[0].description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4e9dff', // Hava durumu uygulaması için mavi tonları
  },
  title: {
    fontSize: 30,
    fontFamily: 'Roboto-Bold', // Modern bir font
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
    elevation: 5, // Butonun gölgelendirilmesi için
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto-Medium', // Buton yazısı için modern bir font
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
    fontFamily: 'Roboto-Regular', // Hava durumu metinleri için farklı bir font
  },
});

export default App;
