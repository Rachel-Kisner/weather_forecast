import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

// Get device width for responsive design
const { width } = Dimensions.get("window")

// WeatherList component displays a horizontal list of weather items
const WeatherList = ({ data }) => {
  // Function to render each weather item
  const renderItem = ({ item }) => {
    // Format the date
    const date = new Date(item.dt * 1000)
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const day = date.toLocaleDateString([], { weekday: "short" })

    // Get the appropriate weather icon
    const iconName = getWeatherIcon(item.weather[0].main)

    return (
      <View style={styles.weatherItem}>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.timeText}>{time}</Text>

        <MaterialCommunityIcons name={iconName} size={30} color="white" style={styles.weatherIcon} />

        <Text style={styles.tempText}>{Math.round(item.main.temp)}°C</Text>

        <Text style={styles.descText}>
          {item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1)}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>תחזית שעתית</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.dt.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

// Helper function to get the appropriate weather icon
const getWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase()

  if (conditionLower.includes("clear")) {
    return "weather-sunny"
  } else if (conditionLower.includes("cloud")) {
    return "weather-cloudy"
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "weather-rainy"
  } else if (conditionLower.includes("snow")) {
    return "weather-snowy"
  } else if (conditionLower.includes("thunderstorm")) {
    return "weather-lightning"
  } else if (conditionLower.includes("mist") || conditionLower.includes("fog")) {
    return "weather-fog"
  } else {
    return "weather-partly-cloudy"
  }
}

// StyleSheet for component styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContent: {
    paddingVertical: 5,
  },
  weatherItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    alignItems: "center",
    width: width / 4,
    minWidth: 100,
  },
  dayText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherIcon: {
    marginBottom: 10,
  },
  tempText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
})

export default WeatherList
