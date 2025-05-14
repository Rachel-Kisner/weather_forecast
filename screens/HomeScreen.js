import { useState, useEffect, useMemo, useCallback } from "react" 
import {
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground,
  ActivityIndicator,
  Alert, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform, 
  Dimensions, 
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context" 
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons" 
import AsyncStorage from "@react-native-async-storage/async-storage" 
import * as Location from "expo-location" 
import NetInfo from "@react-native-community/netinfo" 
import WeatherList from "../components/WeatherList" 
import { fetchWeatherData, fetchForecastData } from "../services/WeatherService" 

const { width, height } = Dimensions.get("window")

// מפתח מטמון עבור נתוני מזג אוויר
const WEATHER_CACHE_KEY = "weatherData_cache"
const FORECAST_CACHE_KEY = "forecastData_cache"
const CACHE_EXPIRY = 30 * 60 * 1000 // 30 דקות בmilliseconds

// רכיב HomeScreen עם מיטוב ביצועים
const HomeScreen = ({ navigation }) => {
  // משתני מצב (state)
  const [city, setCity] = useState("") // מאחסן את שם העיר שהוזן על ידי המשתמש
  const [weatherData, setWeatherData] = useState(null) // מאחסן נתוני מזג אוויר נוכחיים
  const [forecastData, setForecastData] = useState([]) // מאחסן נתוני תחזית
  const [loading, setLoading] = useState(false) // עוקב אחר מצב טעינה
  const [recentSearches, setRecentSearches] = useState([]) // מאחסן חיפושים אחרונים
  const [error, setError] = useState("") // מאחסן הודעות שגיאה
  const [isConnected, setIsConnected] = useState(true) // מצב חיבור לאינטרנט
  const [useLocationEnabled, setUseLocationEnabled] = useState(false) // האם להשתמש במיקום נוכחי

  // בדיקת חיבור לאינטרנט כאשר הרכיב עולה
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected)
      if (!state.isConnected) {
        Alert.alert("אין חיבור לאינטרנט", "האפליקציה תשתמש בנתונים מהמטמון. חלק מהנתונים עשויים להיות לא מעודכנים.")
      }
    })

    // טעינת הגדרות והפעלת מיקום אם צריך
    loadSettings()

    // טעינת חיפושים אחרונים
    loadRecentSearches()

    // טעינת נתונים מהמטמון
    loadCachedData()

    return () => {
      unsubscribe()
    }
  }, [])

  // טעינת הגדרות מ-AsyncStorage
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("weatherAppSettings")
      if (settings) {
        const parsedSettings = JSON.parse(settings)
        setUseLocationEnabled(parsedSettings.useLocation || false)

        // אם הגדרת המיקום מופעלת, קבל את המיקום הנוכחי
        if (parsedSettings.useLocation) {
          getCurrentLocation()
        }
      }
    } catch (error) {
      console.error("שגיאה בטעינת הגדרות:", error)
    }
  }

  // פונקציה לקבלת המיקום הנוכחי
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true)

      // בקשת הרשאות מיקום
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("הרשאת מיקום נדחתה", "כדי להשתמש במיקום הנוכחי, אנא אפשר גישה למיקום בהגדרות המכשיר.")
        setLoading(false)
        return
      }

      // קבלת מיקום נוכחי
      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      // קבלת מידע על העיר לפי קואורדינטות
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude })

      if (geocode && geocode.length > 0) {
        const cityName = geocode[0].city || geocode[0].subregion || geocode[0].region

        if (cityName) {
          setCity(cityName)
          // חיפוש מזג אוויר לפי העיר שהתקבלה
          await fetchWeatherForCity(cityName)
        }
      }
    } catch (error) {
      console.error("שגיאה בקבלת מיקום:", error)
      setError("לא ניתן לקבל את המיקום הנוכחי")
    } finally {
      setLoading(false)
    }
  }, [])

  // טעינת נתונים מהמטמון
  const loadCachedData = async () => {
    try {
      const weatherCache = await AsyncStorage.getItem(WEATHER_CACHE_KEY)
      const forecastCache = await AsyncStorage.getItem(FORECAST_CACHE_KEY)

      if (weatherCache && forecastCache) {
        const { data: cachedWeather, timestamp: weatherTimestamp, city: cachedCity } = JSON.parse(weatherCache)
        const { data: cachedForecast, timestamp: forecastTimestamp } = JSON.parse(forecastCache)

        // בדוק אם המטמון עדיין תקף (פחות מ-30 דקות)
        const now = Date.now()
        if (now - weatherTimestamp < CACHE_EXPIRY && now - forecastTimestamp < CACHE_EXPIRY) {
          setWeatherData(cachedWeather)
          setForecastData(cachedForecast)
          setCity(cachedCity)
        }
      }
    } catch (error) {
      console.error("שגיאה בטעינת נתונים מהמטמון:", error)
    }
  }

  // פונקציה לטעינת חיפושים אחרונים מ-AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("recentSearches")
      if (searches) {
        setRecentSearches(JSON.parse(searches))
      }
    } catch (error) {
      console.error("שגיאה בטעינת חיפושים אחרונים:", error)
    }
  }

  // פונקציה לשמירת עיר בחיפושים אחרונים
  const saveRecentSearch = async (cityName) => {
    try {
      // יצירת מערך חדש עם העיר הנוכחית בהתחלה
      const updatedSearches = [cityName, ...recentSearches.filter((item) => item !== cityName)].slice(0, 5)
      setRecentSearches(updatedSearches)
      await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    } catch (error) {
      console.error("שגיאה בשמירת חיפוש אחרון:", error)
    }
  }

  // פונקציה לשמירת נתונים במטמון
  const cacheData = async (key, data, additionalData = {}) => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ...additionalData,
      }
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.error(`שגיאה בשמירת נתונים במטמון (${key}):`, error)
    }
  }

  // פונקציה לקבלת נתוני מזג אוויר עם תמיכה במטמון
  const fetchWeatherForCity = async (cityName) => {
    if (!cityName.trim()) {
      Alert.alert("שגיאה", "אנא הזן שם עיר")
      return
    }

    setLoading(true)
    setError("")

    try {
      // בדוק אם יש חיבור לאינטרנט
      if (!isConnected) {
        // אם אין חיבור, נסה להשתמש בנתונים מהמטמון
        const weatherCache = await AsyncStorage.getItem(WEATHER_CACHE_KEY)
        const forecastCache = await AsyncStorage.getItem(FORECAST_CACHE_KEY)

        if (weatherCache && forecastCache) {
          const { data: cachedWeather, city: cachedCity } = JSON.parse(weatherCache)
          const { data: cachedForecast } = JSON.parse(forecastCache)

          if (cachedCity.toLowerCase() === cityName.toLowerCase()) {
            setWeatherData(cachedWeather)
            setForecastData(cachedForecast)
            return
          }
        }

        setError("אין חיבור לאינטרנט ואין נתונים במטמון עבור עיר זו")
        return
      }

      // קבלת נתוני מזג אוויר נוכחיים
      const weatherResult = await fetchWeatherData(cityName)
      setWeatherData(weatherResult)

      // שמירת נתוני מזג אוויר במטמון
      await cacheData(WEATHER_CACHE_KEY, weatherResult, { city: cityName })

      // קבלת נתוני תחזית
      const forecastResult = await fetchForecastData(cityName)
      setForecastData(forecastResult)

      // שמירת נתוני תחזית במטמון
      await cacheData(FORECAST_CACHE_KEY, forecastResult)

      // שמירת העיר בחיפושים אחרונים
      saveRecentSearch(cityName)
    } catch (error) {
      console.error("שגיאה בקבלת נתוני מזג אוויר:", error)
      setError("העיר לא נמצאה או שגיאת רשת")
      Alert.alert("שגיאה", "לא ניתן לקבל נתוני מזג אוויר. אנא בדוק את שם העיר ונסה שוב.")
    } finally {
      setLoading(false)
    }
  }

  // פונקציה לטיפול בפעולת החיפוש
  const handleSearch = () => {
    fetchWeatherForCity(city)
  }

  // פונקציה לטיפול בלחיצה על פריט חיפוש אחרון
  const handleRecentSearchPress = (cityName) => {
    setCity(cityName)
    // הפעלת חיפוש עם העיר שנבחרה
    fetchWeatherForCity(cityName)
  }

  // פונקציה להצגת מידע מפורט על מזג האוויר
  const viewDetails = () => {
    if (weatherData) {
      navigation.navigate("Detail", { weatherData, forecastData })
    }
  }

  // פונקציה לניווט למסך הגדרות
  const goToSettings = () => {
    navigation.navigate("Settings")
  }

  // שימוש ב-useMemo לתמונת רקע כדי למנוע חישוב מחדש בכל רינדור
  const backgroundImage = useMemo(() => {
    if (!weatherData) return require("../assets/splash-icon.png")

    const condition = weatherData.weather[0].main.toLowerCase()

    if (condition.includes("clear")) {
      return require("../assets/favicon.png") // בהיר
    } else if (condition.includes("cloud")) {
      return require("../assets/favicon.png") // מעונן
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return require("../assets/favicon.png") // גשום
    } else if (condition.includes("snow")) {
      return require("../assets/favicon.png") // מושלג
    } else if (condition.includes("thunderstorm")) {
      return require("../assets/favicon.png") // סופה
    } else {
      return require("../assets/favicon.png") // ברירת מחדל
    }
  }, [weatherData])

  return (
    // SafeAreaView מבטיח שהתוכן לא יחפוף עם אלמנטי ממשק המשתמש של המערכת
    <SafeAreaView style={styles.container}>
      {/* ImageBackground מספק תמונת רקע שמשתנה בהתאם למזג האוויר */}
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        {/* KeyboardAvoidingView מזיז את התוכן למעלה כאשר המקלדת מופיעה */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            {/* כותרת עם כותרת והגדרות כפתור */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>תחזית מזג אוויר</Text>
              <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
                <Feather name="settings" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* אזור חיפוש עם קלט וכפתור */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="הזן שם עיר"
                value={city}
                onChangeText={setCity}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Feather name="search" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* כפתור מיקום נוכחי */}
            {useLocationEnabled && (
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <Feather name="map-pin" size={16} color="white" />
                <Text style={styles.locationButtonText}>השתמש במיקום הנוכחי</Text>
              </TouchableOpacity>
            )}

            {/* אזור חיפושים אחרונים */}
            {recentSearches.length > 0 && (
              <View style={styles.recentSearchesContainer}>
                <Text style={styles.recentSearchesTitle}>חיפושים אחרונים</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recentSearchesList}
                >
                  {recentSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentSearchItem}
                      onPress={() => handleRecentSearchPress(item)}
                    >
                      <Text style={styles.recentSearchText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* מחוון טעינה */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>טוען נתוני מזג אוויר...</Text>
              </View>
            )}

            {/* הודעת שגיאה */}
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={50} color="#ff6b6b" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* תצוגת נתוני מזג אוויר */}
            {weatherData && !loading && (
              <View style={styles.weatherContainer}>
                <Text style={styles.cityName}>
                  {weatherData.name}, {weatherData.sys.country}
                </Text>

                <View style={styles.mainWeather}>
                  <MaterialCommunityIcons name={getWeatherIcon(weatherData.weather[0].main)} size={80} color="white" />
                  <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
                </View>

                <Text style={styles.weatherDescription}>
                  {weatherData.weather[0].description.charAt(0).toUpperCase() +
                    weatherData.weather[0].description.slice(1)}
                </Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Feather name="droplet" size={18} color="white" />
                    <Text style={styles.detailText}>{weatherData.main.humidity}%</Text>
                    <Text style={styles.detailLabel}>לחות</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Feather name="wind" size={18} color="white" />
                    <Text style={styles.detailText}>{Math.round(weatherData.wind.speed * 3.6)} קמ"ש</Text>
                    <Text style={styles.detailLabel}>רוח</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="weather-sunset-up" size={18} color="white" />
                    <Text style={styles.detailText}>
                      {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text style={styles.detailLabel}>זריחה</Text>
                  </View>
                </View>

                {/* כפתור לצפייה בפרטים נוספים */}
                <TouchableOpacity style={styles.detailsButton} onPress={viewDetails}>
                  <Text style={styles.detailsButtonText}>צפה בתחזית ל-5 ימים</Text>
                  <Feather name="chevron-right" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {/* רשימת תחזית */}
            {forecastData.length > 0 && !loading && <WeatherList data={forecastData.slice(0, 5)} />}

            {/* מידע על מצב מטמון */}
            {!isConnected && weatherData && (
              <View style={styles.offlineNotice}>
                <Feather name="wifi-off" size={16} color="#ffcc00" />
                <Text style={styles.offlineText}>מצב לא מקוון - מציג נתונים מהמטמון</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  )
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
    flex: 1, // תופס את כל המסך
  },
  backgroundImage: {
    flex: 1, // תופס את כל המכל
    width: "100%",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // מאפשר ל-ScrollView לגדול
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: "#4a90e2",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  locationButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  recentSearchesContainer: {
    marginBottom: 20,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  recentSearchesList: {
    paddingBottom: 8,
  },
  recentSearchItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  recentSearchText: {
    color: "gray",
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherContainer: {
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
    fontSize: 60,
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
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 144, 226, 0.8)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  detailsButtonText: {
    color: "white",
    marginRight: 5,
    fontWeight: "bold",
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  offlineText: {
    color: "#ffcc00",
    marginLeft: 8,
    fontSize: 14,
  },
})

export default HomeScreen
