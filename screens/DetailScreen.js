// "use client"

// ייבוא הספריות והרכיבים הנדרשים
import React, { useMemo } from "react" // הוקים לניהול מצב ומיטוב ביצועים
import { StyleSheet, Text, View, ScrollView, Dimensions, Pressable, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context" // מבטיח שהתוכן לא יחפוף עם אלמנטי מערכת
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons" // סמלים
import { LineChart } from "react-native-chart-kit" // רכיב גרף קו

// קבלת מידות המכשיר לעיצוב רספונסיבי
const { width } = Dimensions.get("window")

// רכיב DetailScreen עם מיטוב ביצועים
const DetailScreen = ({ route, navigation }) => {
  // חילוץ נתוני מזג אוויר ותחזית מפרמטרי הניתוב
  const { weatherData, forecastData } = route.params

  // קיבוץ נתוני תחזית לפי יום - שימוש ב-useMemo למניעת חישוב מחדש בכל רינדור
  const groupedForecast = useMemo(() => groupForecastByDay(forecastData), [forecastData])

  // פונקציה לקבלת תמונת רקע בהתבסס על תנאי מזג האוויר - שימוש ב-useMemo
  const backgroundImage = useMemo(() => {
    if (!weatherData) return require("../assets/icon.png")

    const condition = weatherData.weather[0].main.toLowerCase()

    if (condition.includes("clear")) {
      return require("../assets/adaptive-icon.png") // בהיר
    } else if (condition.includes("cloud")) {
      return require("../assets/adaptive-icon.png") // מעונן
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return require("../assets/adaptive-icon.png") // גשום
    } else if (condition.includes("snow")) {
      return require("../assets/adaptive-icon.png") // מושלג
    } else if (condition.includes("thunderstorm")) {
      return require("../assets/adaptive-icon.png") // סופה
    } else {
      return require("../assets/adaptive-icon.png") // ברירת מחדל
    }
  }, [weatherData])

  // הכנת נתונים לגרף טמפרטורה - שימוש ב-useMemo
  const chartData = useMemo(
    () => ({
      labels: Object.keys(groupedForecast).map((day) => day.substring(0, 3)), // שמות ימים קצרים
      datasets: [
        {
          data: Object.values(groupedForecast).map(
            (day) => day.reduce((sum, item) => sum + item.main.temp, 0) / day.length,
          ),
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    }),
    [groupedForecast],
  )

  // תצורת גרף - קבוע, לא צריך להשתנות בכל רינדור
  const chartConfig = {
    backgroundGradientFrom: "rgba(0, 0, 0, 0.2)",
    backgroundGradientTo: "rgba(0, 0, 0, 0.2)",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#4a90e2",
    },
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* סיכום מזג אוויר נוכחי */}
          <View style={styles.currentWeatherContainer}>
            <Text style={styles.cityName}>
              {weatherData.name}, {weatherData.sys.country}
            </Text>

            <View style={styles.mainWeather}>
              <MaterialCommunityIcons name={getWeatherIcon(weatherData.weather[0].main)} size={60} color="white" />
              <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
            </View>

            <Text style={styles.weatherDescription}>
              {weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}
            </Text>
          </View>

          {/* גרף טמפרטורה */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>תחזית טמפרטורה ל-5 ימים</Text>
            <LineChart
              data={chartData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false} // שיפור ביצועים על ידי הסרת קווים פנימיים
              withOuterLines={false} // שיפור ביצועים על ידי הסרת קווים חיצוניים
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={false}
            />
          </View>

          {/* מידע מפורט על מזג האוויר */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>פרטים נוכחיים</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Feather name="thermometer" size={24} color="white" />
                <Text style={styles.detailValue}>{Math.round(weatherData.main.feels_like)}°C</Text>
                <Text style={styles.detailLabel}>מרגיש כמו</Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="weather-windy" size={24} color="white" />
                <Text style={styles.detailValue}>{Math.round(weatherData.wind.speed * 3.6)} קמ"ש</Text>
                <Text style={styles.detailLabel}>מהירות רוח</Text>
              </View>

              <View style={styles.detailItem}>
                <Feather name="compass" size={24} color="white" />
                <Text style={styles.detailValue}>{getWindDirection(weatherData.wind.deg)}</Text>
                <Text style={styles.detailLabel}>כיוון רוח</Text>
              </View>

              <View style={styles.detailItem}>
                <Feather name="droplet" size={24} color="white" />
                <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
                <Text style={styles.detailLabel}>לחות</Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="gauge" size={24} color="white" />
                <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
                <Text style={styles.detailLabel}>לחץ</Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="weather-fog" size={24} color="white" />
                <Text style={styles.detailValue}>{weatherData.visibility / 1000} ק"מ</Text>
                <Text style={styles.detailLabel}>ראות</Text>
              </View>
            </View>
          </View>

          {/* מידע על שמש וירח */}
          <View style={styles.sunMoonCard}>
            <Text style={styles.sectionTitle}>שמש וירח</Text>

            <View style={styles.sunMoonContainer}>
              <View style={styles.sunMoonItem}>
                <MaterialCommunityIcons name="weather-sunset-up" size={30} color="#FFD700" />
                <Text style={styles.sunMoonLabel}>זריחה</Text>
                <Text style={styles.sunMoonValue}>
                  {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              <View style={styles.sunMoonItem}>
                <MaterialCommunityIcons name="weather-sunset-down" size={30} color="#FF8C00" />
                <Text style={styles.sunMoonLabel}>שקיעה</Text>
                <Text style={styles.sunMoonValue}>
                  {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* תחזית יומית */}
          <View style={styles.forecastCard}>
            <Text style={styles.sectionTitle}>תחזית ל-5 ימים</Text>

            {Object.entries(groupedForecast).map(([day, forecasts]) => {
              // חישוב טמפרטורה ממוצעת וקבלת תנאי מזג האוויר הנפוץ ביותר
              const avgTemp = forecasts.reduce((sum, item) => sum + item.main.temp, 0) / forecasts.length
              const conditions = forecasts.map((item) => item.weather[0].main)
              const mostCommonCondition = getMostCommonItem(conditions)

              return (
                <View key={day} style={styles.forecastDay}>
                  <Text style={styles.forecastDayName}>{day}</Text>

                  <View style={styles.forecastDayDetails}>
                    <MaterialCommunityIcons name={getWeatherIcon(mostCommonCondition)} size={30} color="white" />

                    <View style={styles.forecastTemps}>
                      <Text style={styles.forecastTemp}>{Math.round(avgTemp)}°C</Text>
                      <Text style={styles.forecastCondition}>{mostCommonCondition}</Text>
                    </View>

                    <View style={styles.forecastMinMax}>
                      <Text style={styles.forecastMinMaxText}>
                        גבוה: {Math.round(Math.max(...forecasts.map((item) => item.main.temp_max)))}°
                      </Text>
                      <Text style={styles.forecastMinMaxText}>
                        נמוך: {Math.round(Math.min(...forecasts.map((item) => item.main.temp_min)))}°
                      </Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>

          {/* כפתור חזרה */}
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color="white" />
            <Text style={styles.backButtonText}>חזרה לחיפוש</Text>
          </Pressable>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}

// פונקציית עזר לקיבוץ נתוני תחזית לפי יום
const groupForecastByDay = (forecastData) => {
  const grouped = {}

  forecastData.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toLocaleDateString("en-US", { weekday: "long" })

    if (!grouped[day]) {
      grouped[day] = []
    }

    grouped[day].push(item)
  })

  return grouped
}

// פונקציית עזר לקבלת הפריט הנפוץ ביותר במערך
const getMostCommonItem = (array) => {
  const counts = {}
  let maxCount = 0
  let mostCommon = null

  array.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1
    if (counts[item] > maxCount) {
      maxCount = counts[item]
      mostCommon = item
    }
  })

  return mostCommon
}

// פונקציית עזר לקבלת כיוון רוח ממעלות
const getWindDirection = (degrees) => {
  const directions = ["צפון", "צפון-מזרח", "מזרח", "דרום-מזרח", "דרום", "דרום-מערב", "מערב", "צפון-מערב"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

// פונקציית עזר לקבלת סמל מזג אוויר מתאים
const getWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase()

  if (conditionLower.includes("clear")) {
    return "weather-sunny" // בהיר
  } else if (conditionLower.includes("cloud")) {
    return "weather-cloudy" // מעונן
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "weather-rainy" // גשום
  } else if (conditionLower.includes("snow")) {
    return "weather-snowy" // מושלג
  } else if (conditionLower.includes("thunderstorm")) {
    return "weather-lightning" // סופה
  } else if (conditionLower.includes("mist") || conditionLower.includes("fog")) {
    return "weather-fog" // ערפל
  } else {
    return "weather-partly-cloudy" // מעונן חלקית
  }
}

// StyleSheet לעיצוב הרכיבים
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    padding: 20,
  },
  currentWeatherContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mainWeather: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherDescription: {
    fontSize: 18,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  chartContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailsCard: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sunMoonCard: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  sunMoonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sunMoonItem: {
    alignItems: "center",
  },
  sunMoonLabel: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sunMoonValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  forecastCard: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  forecastDay: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 15,
  },
  forecastDayName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  forecastDayDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  forecastTemps: {
    marginLeft: 15,
    flex: 1,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  forecastCondition: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  forecastMinMax: {
    alignItems: "flex-end",
  },
  forecastMinMaxText: {
    fontSize: 14,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  backButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default React.memo(DetailScreen) // שימוש ב-React.memo למניעת רינדורים מיותרים
