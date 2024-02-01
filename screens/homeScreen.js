import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { weatherImages } from "../constants/constants";
import { CalendarDaysIcon } from "react-native-heroicons/solid";

import { apiKey } from "../constants/constants";

bounceValue = new Animated.Value(0);

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState(false);
  const [city, setCity] = useState("Lisbon");
  const [weather, setWeather] = useState(null);

  const handleSearch = () => {
    fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    )
      .then((response) => response.json())
      .then((json) => {
        setWeather(json);
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleForecast = () => {
    fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`
    )
      .then((response) => response.json())
      .then((json) => {
        setWeather(json);
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    handleForecast();
  }, []);

  Animated.loop(
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(bounceValue, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const bounce = this.bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const toggleSearch = () => {
    setSearch(!search);
  };

  return (
    <View className="flex flex-1 relative">
      <StatusBar style="light" />
      <ImageBackground
        blurRadius={75}
        resizeMode="cover"
        source={require("../assets/images/bg.png")}
        className="w-full h-full absolute z-[-1]"
      />

      <SafeAreaView className="flex flex-1">
        {/* Search Area */}
        <View
          style={{ height: "7%" }}
          className="mx-4 mt-4 relative  flex-row justify-end items-center rounded-full"
        >
          <TextInput
            className="flex-1 text-white bg-slate-600/60 text-lg font-bold px-4 pb-1 h-full w-full absolute rounded-full"
            style={{ display: search ? "flex" : "none" }}
            placeholder="Lisboa"
            placeholderTextColor="gray"
            value={city}
            onChangeText={(text) => setCity(text)}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity
            className="bg-slate-400/50 p-3 m-1 rounded-full"
            onPress={() => toggleSearch()}
          >
            <MagnifyingGlassIcon color="white" size={30} />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-center items-end gap-2 mt-4">
          <Text className="text-slate-200 text-4xl font-bold">
            {weather?.location?.name},
          </Text>
          <Text className="text-slate-300 text-2xl font-bold">
            {weather?.location?.country}
          </Text>
        </View>

        {/* Image and Temp */}
        <View className="flex flex-col justify-center items-center gap-8  mt-0">
          <Animated.Image
            className="w-56 h-56"
            style={{
              transform: [{ translateY: bounce }],
            }}
            source={weatherImages[weather?.current?.condition?.text]}
          />
          <View className="flex flex-col justify-center items-center">
            <Text className="text-slate-200 text-7xl font-bold">
              {weather?.current?.temp_c}°
            </Text>
            <Text className="text-slate-300 text-2xl ">
              {weather?.current?.condition?.text}
            </Text>
          </View>

          {/* Random Info */}
          <View className="flex-row justify-around items-center w-full pt-4">
            <View className="flex-row space-x-2 items-center">
              <Image
                className="w-6 h-6"
                source={require("../assets/icons/wind.png")}
              />
              <Text className="text-slate-200 font-semibold text-base">
                {weather?.current?.wind_kph} km/h
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/drop.png")}
                className="w-6 h-6"
              />
              <Text className="text-slate-200 font-semibold text-base">
                {weather?.current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/pressure.png")}
                className="w-6 h-6"
              />
              <Text className="text-slate-200 font-semibold text-base">
                {weather?.current?.pressure_mb} mb
              </Text>
            </View>
          </View>
        </View>

        {/* Forecast */}
        <View className="mt-8">
          <View className=" mx-4 flex flex-row items-center space-x-2">
            <CalendarDaysIcon color="white" size={30} />
            <Text className="text-slate-300 text-lg">Daily Forecast</Text>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {weather?.forecast?.forecastday?.map((day) => {
              const date = new Date(day.date);
              const options = { weekday: "long" };
              let dayName = date.toLocaleDateString("en-US", options);
              dayName = dayName.split(",")[0];
              return (
                <View
                  key={day.date}
                  className="flex justify-center items-center w-28 rounded-3xl py-3 space-y-1 mr-4 mt-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Image
                    className="w-16 h-16"
                    source={weatherImages[day.day.condition.text]}
                  />
                  <Text className="text-slate-300 text-base font-semibold">
                    {dayName}
                  </Text>
                  <View>
                    <Text className="text-slate-200 text-sm ">
                      Max: {day.day.maxtemp_c}°
                    </Text>
                    <Text className="text-slate-300 text-sm ">
                      Min: {day.day.mintemp_c}°
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
