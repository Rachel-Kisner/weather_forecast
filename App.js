// // 
// "use client"

// // ייבוא הספריות הנדרשות
// import "react-native-gesture-handler" // נדרש עבור React Navigation
// import { useState, useEffect } from "react" // הוקים לניהול מצב ומחזור חיים
// import { StatusBar } from "expo-status-bar" // רכיב לשליטה בסרגל הסטטוס
// import { SafeAreaProvider } from "react-native-safe-area-context" // מספק אזור בטוח למניעת חפיפה עם אלמנטי מערכת
// import { NavigationContainer } from "@react-navigation/native" // מכיל את כל הניווט באפליקציה
// import { createStackNavigator } from "@react-navigation/stack" // יוצר ניווט מסוג מחסנית
// import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native" // רכיבים בסיסיים
// import * as SplashScreen from "expo-splash-screen" // מסך טעינה של Expo
// import { Asset } from "expo-asset" // לטעינה מוקדמת של נכסים
// import AsyncStorage from "@react-native-async-storage/async-storage" // אחסון מקומי

// // ייבוא המסכים שלנו
// import HomeScreen from "./screens/HomeScreen" // מסך הבית עם חיפוש מזג אוויר
// import DetailScreen from "./screens/DetailScreen" // מסך פרטים מורחבים של מזג אוויר
// import SettingsScreen from "./screens/SettingsScreen" // מסך הגדרות

// // מנע הסתרה אוטומטית של מסך הטעינה
// SplashScreen.preventAutoHideAsync()

// // יצירת מחסנית ניווט
// const Stack = createStackNavigator()

// // רשימת תמונות לטעינה מוקדמת
// const imagesToPreload = [
//   require("./assets/default-bg.png"),
//   require("./assets/clear-bg.png"),
//   require("./assets/cloudy-bg.png"),
//   require("./assets/rain-bg.png"),
//   require("./assets/snow-bg.png"),
//   require("./assets/storm-bg.png"),
//   require("./assets/settings-bg.png"),
// ]

// export default function App() {
//   // מצב טעינה של האפליקציה
//   const [appIsReady, setAppIsReady] = useState(false)

//   // פונקציה לטעינה מוקדמת של נכסים
//   const preloadAssets = async () => {
//     try {
//       // טעינה מוקדמת של תמונות
//       const imageAssets = imagesToPreload.map((image) => Asset.fromModule(image).downloadAsync())
//       await Promise.all(imageAssets)

//       // טעינת הגדרות מקומיות
//       await AsyncStorage.getItem("weatherAppSettings")

//       // השהייה קצרה כדי לוודא שהכל נטען כראוי
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//     } catch (e) {
//       console.warn("שגיאה בטעינת נכסים:", e)
//     } finally {
//       setAppIsReady(true)
//     }
//   }

//   // טעינת נכסים כאשר האפליקציה עולה
//   useEffect(() => {
//     preloadAssets()
//   }, [])

//   // פונקציה שתופעל כאשר הפריסה מוכנה
//   const onLayoutRootView = async () => {
//     if (appIsReady) {
//       await SplashScreen.hideAsync()
//     }
//   }

//   // הצג מסך טעינה מותאם אישית אם האפליקציה עדיין לא מוכנה
//   if (!appIsReady) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Image source={require("./assets/icon.png")} style={styles.loadingIcon} resizeMode="contain" />
//         <ActivityIndicator size="large" color="#4a90e2" style={styles.loadingSpinner} />
//         <Text style={styles.loadingText}>טוען את אפליקציית מזג האוויר...</Text>
//       </View>
//     )
//   }

//   // הרכיב הראשי App משמש כנקודת הכניסה לאפליקציה
//   return (
//     // SafeAreaProvider עוטף את כל האפליקציה כדי להבטיח שהתוכן לא יחפוף עם אלמנטי ממשק המשתמש של המערכת
//     <SafeAreaProvider onLayout={onLayoutRootView}>
//       {/* רכיב StatusBar שולט במראה של סרגל הסטטוס */}
//       <StatusBar style="auto" />

//       {/* NavigationContainer הוא הרכיב השורש עבור ניווט */}
//       <NavigationContainer>
//         {/* Stack.Navigator מנהל את מחסנית הניווט */}
//         <Stack.Navigator
//           initialRouteName="Home" // המסך הראשון שיוצג
//           screenOptions={{
//             headerStyle: {
//               backgroundColor: "#4a90e2", // רקע כחול לכותרת
//             },
//             headerTintColor: "#fff", // טקסט/סמלים לבנים בכותרת
//             headerTitleStyle: {
//               fontWeight: "bold", // טקסט מודגש בכותרת
//             },
//           }}
//         >
//           {/* הגדרת כל מסך במחסנית הניווט שלנו */}
//           <Stack.Screen name="Home" component={HomeScreen} options={{ title: "אפליקציית מזג אוויר" }} />
//           <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "פרטי מזג אוויר" }} />
//           <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "הגדרות" }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   )
// }

// // סגנונות למסך טעינה
// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#4a90e2",
//   },
//   loadingIcon: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//   },
//   loadingSpinner: {
//     marginBottom: 20,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: "white",
//     fontWeight: "bold",
//   },
// })
"use client"

// ייבוא הספריות הנדרשות
import "react-native-gesture-handler" // נדרש עבור React Navigation
import { StatusBar } from "expo-status-bar" // רכיב לשליטה בסרגל הסטטוס
import { SafeAreaProvider } from "react-native-safe-area-context" // מספק אזור בטוח למניעת חפיפה עם אלמנטי מערכת
import { NavigationContainer } from "@react-navigation/native" // מכיל את כל הניווט באפליקציה
import { createStackNavigator } from "@react-navigation/stack" // יוצר ניווט מסוג מחסנית
import { StyleSheet } from "react-native" // רכיבים בסיסיים

// ייבוא המסכים שלנו
import HomeScreen from "./screens/HomeScreen" // מסך הבית עם חיפוש מזג אוויר
import DetailScreen from "./screens/DetailScreen" // מסך פרטים מורחבים של מזג אוויר
import SettingsScreen from "./screens/SettingScreen" // מסך הגדרות

// יצירת מחסנית ניווט
const Stack = createStackNavigator()

export default function App() {
  // הסרנו את מצב הטעינה ומעבירים ישירות לתוכן האפליקציה
  // כך נמנע מהאפליקציה להיתקע במסך הטעינה

  // הרכיב הראשי App משמש כנקודת הכניסה לאפליקציה
  return (
    // SafeAreaProvider עוטף את כל האפליקציה כדי להבטיח שהתוכן לא יחפוף עם אלמנטי ממשק המשתמש של המערכת
    <SafeAreaProvider>
      {/* רכיב StatusBar שולט במראה של סרגל הסטטוס */}
      <StatusBar style="auto" />

      {/* NavigationContainer הוא הרכיב השורש עבור ניווט */}
      <NavigationContainer>
        {/* Stack.Navigator מנהל את מחסנית הניווט */}
        <Stack.Navigator
          initialRouteName="Home" // המסך הראשון שיוצג
          screenOptions={{
            headerStyle: {
              backgroundColor: "#4a90e2", // רקע כחול לכותרת
            },
            headerTintColor: "#fff", // טקסט/סמלים לבנים בכותרת
            headerTitleStyle: {
              fontWeight: "bold", // טקסט מודגש בכותרת
            },
          }}
        >
          {/* הגדרת כל מסך במחסנית הניווט שלנו */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "אפליקציית מזג אוויר" }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "פרטי מזג אוויר" }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "הגדרות" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

// סגנונות למסך טעינה (לא בשימוש כעת, אבל משאירים למקרה שנרצה להחזיר אותם)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4a90e2",
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
})
