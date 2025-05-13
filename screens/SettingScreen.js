// 
"use client"

// ייבוא הספריות והרכיבים הנדרשים
import { useState, useEffect } from "react" // הוקים לניהול מצב ומחזור חיים
import {
  StyleSheet, // לעיצוב הרכיבים
  Text, // להצגת טקסט
  View, // מכיל רכיבים אחרים
  Switch, // מתג בוליאני
  TouchableOpacity, // אזור לחיץ עם אפקט שקיפות
  Alert, // להצגת התראות
  ScrollView, // מאפשר גלילת תוכן
  Modal, // חלון קופץ
  ImageBackground, // תמונת רקע
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context" // מבטיח שהתוכן לא יחפוף עם אלמנטי מערכת
import { Feather } from "@expo/vector-icons" // סמלים
import AsyncStorage from "@react-native-async-storage/async-storage" // אחסון מקומי

const SettingsScreen = ({ navigation }) => {
  // משתני מצב (state)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false) // האם התראות מופעלות
  const [darkMode, setDarkMode] = useState(false) // האם מצב כהה מופעל
  const [useLocation, setUseLocation] = useState(false) // האם להשתמש במיקום נוכחי
  const [temperatureUnit, setTemperatureUnit] = useState("celsius") // יחידת טמפרטורה ('celsius' או 'fahrenheit')
  const [modalVisible, setModalVisible] = useState(false) // האם המודל נראה
  const [aboutModalVisible, setAboutModalVisible] = useState(false) // האם מודל האודות נראה

  // טעינת הגדרות מ-AsyncStorage כאשר הרכיב עולה
  useEffect(() => {
    loadSettings()
  }, [])

  // פונקציה לטעינת הגדרות מ-AsyncStorage
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("weatherAppSettings")
      if (settings) {
        const parsedSettings = JSON.parse(settings)
        setNotificationsEnabled(parsedSettings.notificationsEnabled || false)
        setDarkMode(parsedSettings.darkMode || false)
        setUseLocation(parsedSettings.useLocation || false)
        setTemperatureUnit(parsedSettings.temperatureUnit || "celsius")
      }
    } catch (error) {
      console.error("שגיאה בטעינת הגדרות:", error)
    }
  }

  // פונקציה לשמירת הגדרות ל-AsyncStorage
  const saveSettings = async () => {
    try {
      const settings = {
        notificationsEnabled,
        darkMode,
        useLocation,
        temperatureUnit,
      }
      await AsyncStorage.setItem("weatherAppSettings", JSON.stringify(settings))

      // הצגת הודעת הצלחה
      Alert.alert("הצלחה", "ההגדרות נשמרו בהצלחה!")
    } catch (error) {
      console.error("שגיאה בשמירת הגדרות:", error)
      Alert.alert("שגיאה", "שמירת ההגדרות נכשלה. אנא נסה שוב.")
    }
  }

  // פונקציה למחיקת כל נתוני האפליקציה
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear()
      Alert.alert("הצלחה", "כל הנתונים נמחקו בהצלחה. האפליקציה תופעל מחדש כעת.")
      // באפליקציה אמיתית, ייתכן שתרצה להפעיל מחדש את האפליקציה או לנווט למסך הבית
      navigation.navigate("Home")
    } catch (error) {
      console.error("שגיאה במחיקת נתונים:", error)
      Alert.alert("שגיאה", "מחיקת הנתונים נכשלה. אנא נסה שוב.")
    }
  }

  // פונקציה לאישור מחיקת נתונים
  const confirmClearData = () => {
    Alert.alert("מחיקת כל הנתונים", "האם אתה בטוח שברצונך למחוק את כל נתוני האפליקציה? פעולה זו אינה ניתנת לביטול.", [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "מחק",
        onPress: clearAllData,
        style: "destructive",
      },
    ])
  }

  // פונקציה להחלפת יחידת טמפרטורה
  const toggleTemperatureUnit = () => {
    setModalVisible(true)
  }

  // פונקציה לבחירת יחידת טמפרטורה
  const selectTemperatureUnit = (unit) => {
    setTemperatureUnit(unit)
    setModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/adaptive-icon.png")} style={styles.backgroundImage} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerTitle}>הגדרות</Text>

          {/* אזור הגדרות כלליות */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>כללי</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Feather name="bell" size={20} color="white" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>התראות</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#767577", true: "#4a90e2" }}
                thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Feather name="moon" size={20} color="white" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>מצב כהה</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#767577", true: "#4a90e2" }}
                thumbColor={darkMode ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Feather name="map-pin" size={20} color="white" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>השתמש במיקום נוכחי</Text>
              </View>
              <Switch
                value={useLocation}
                onValueChange={setUseLocation}
                trackColor={{ false: "#767577", true: "#4a90e2" }}
                thumbColor={useLocation ? "#fff" : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={toggleTemperatureUnit}>
              <View style={styles.settingLabelContainer}>
                <Feather name="thermometer" size={20} color="white" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>יחידת טמפרטורה</Text>
              </View>
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>
                  {temperatureUnit === "celsius" ? "צלזיוס (°C)" : "פרנהייט (°F)"}
                </Text>
                <Feather name="chevron-right" size={16} color="white" style={styles.settingArrow} />
              </View>
            </TouchableOpacity>
          </View>

          {/* אזור ניהול נתונים */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ניהול נתונים</Text>

            <TouchableOpacity style={styles.settingItem} onPress={confirmClearData}>
              <View style={styles.settingLabelContainer}>
                <Feather name="trash-2" size={20} color="#ff6b6b" style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: "#ff6b6b" }]}>מחק את כל הנתונים</Text>
              </View>
              <Feather name="chevron-right" size={16} color="white" style={styles.settingArrow} />
            </TouchableOpacity>
          </View>

          {/* אזור אודות */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>אודות</Text>

            <TouchableOpacity style={styles.settingItem} onPress={() => setAboutModalVisible(true)}>
              <View style={styles.settingLabelContainer}>
                <Feather name="info" size={20} color="white" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>אודות האפליקציה</Text>
              </View>
              <Feather name="chevron-right" size={16} color="white" style={styles.settingArrow} />
            </TouchableOpacity>
          </View>

          {/* כפתור שמירה */}
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Text style={styles.saveButtonText}>שמור הגדרות</Text>
          </TouchableOpacity>

          {/* כפתור חזרה */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color="white" />
            <Text style={styles.backButtonText}>חזרה למזג אוויר</Text>
          </TouchableOpacity>

          {/* מודל יחידת טמפרטורה */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>בחר יחידת טמפרטורה</Text>

                <TouchableOpacity
                  style={[styles.modalOption, temperatureUnit === "celsius" && styles.modalOptionSelected]}
                  onPress={() => selectTemperatureUnit("celsius")}
                >
                  <Text style={styles.modalOptionText}>צלזיוס (°C)</Text>
                  {temperatureUnit === "celsius" && <Feather name="check" size={20} color="#4a90e2" />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalOption, temperatureUnit === "fahrenheit" && styles.modalOptionSelected]}
                  onPress={() => selectTemperatureUnit("fahrenheit")}
                >
                  <Text style={styles.modalOptionText}>פרנהייט (°F)</Text>
                  {temperatureUnit === "fahrenheit" && <Feather name="check" size={20} color="#4a90e2" />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseButtonText}>ביטול</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* מודל אודות */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={aboutModalVisible}
            onRequestClose={() => setAboutModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.aboutModalContent}>
                <Text style={styles.aboutModalTitle}>אפליקציית מזג אוויר</Text>
                <Text style={styles.aboutModalVersion}>גרסה 1.0.0</Text>

                <View style={styles.aboutModalDivider} />

                <Text style={styles.aboutModalText}>
                  אפליקציית מזג האוויר הזו נוצרה כפרויקט React Native. היא משתמשת ב-API של מזג אוויר כדי לקבל נתוני מזג
                  אוויר.
                </Text>

                <Text style={styles.aboutModalText}>
                  התכונות כוללות תנאי מזג אוויר נוכחיים, תחזית ל-5 ימים, מידע מפורט על מזג האוויר והגדרות הניתנות להתאמה
                  אישית.
                </Text>

                <View style={styles.aboutModalDivider} />

                <Text style={styles.aboutModalCredit}>נוצר על ידי:רחל קיסנר</Text>

                <TouchableOpacity style={styles.aboutModalCloseButton} onPress={() => setAboutModalVisible(false)}>
                  <Text style={styles.aboutModalCloseButtonText}>סגור</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginRight: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingArrow: {
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  backButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionSelected: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: "#333",
  },
  aboutModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  aboutModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  aboutModalVersion: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  aboutModalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  aboutModalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    lineHeight: 20,
  },
  aboutModalCredit: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
  aboutModalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#4a90e2",
    borderRadius: 20,
    alignItems: "center",
  },
  aboutModalCloseButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
})

export default SettingsScreen
