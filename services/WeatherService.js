// // // // קובץ זה מכיל פונקציות לקבלת נתוני מזג אוויר מה-API של מזג אוויר

// // // מפתח API עבור שירות מזג האוויר (באפליקציה אמיתית, זה היה נשמר במשתני סביבה)
// // const API_KEY = "d4300c3b1ba24ae9f4acebd39397d45e"; 
// // const BASE_URL = "https://api.openweathermap.org/data/2.5";

// // // פונקציה לקבלת נתוני מזג אוויר נוכחיים עבור עיר
// // // export const fetchWeatherData = async (city) => {
// // //   try {
// // //     // בניית כתובת ה-API עם פרמטרי שאילתה
// // //     const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`;



// // //     // קבלת נתונים מה-API
// // //     const response = await fetch(url)

// // //     // בדיקה אם התגובה מוצלחת
// // //     if (!response.ok) {
// // //       throw new Error("העיר לא נמצאה או שגיאת API")
// // //     }

// // //     // פענוח תגובת ה-JSON
// // //     const data = await response.json()

// // //     // המרת הנתונים לפורמט שהאפליקציה שלנו מצפה לו
// // //     return {
// // //       name: data.location.name,
// // //       sys: {
// // //         country: data.location.country,
// // //         sunrise: Math.floor(new Date().setHours(6, 0, 0, 0) / 1000), // ערך ברירת מחדל כי WeatherAPI לא מספק זריחה
// // //         sunset: Math.floor(new Date().setHours(18, 0, 0, 0) / 1000), // ערך ברירת מחדל כי WeatherAPI לא מספק שקיעה
// // //       },
// // //       weather: [
// // //         {
// // //           main: data.current.condition.text,
// // //           description: data.current.condition.text,
// // //         },
// // //       ],
// // //       main: {
// // //         temp: data.current.temp_c,
// // //         feels_like: data.current.feelslike_c,
// // //         humidity: data.current.humidity,
// // //         pressure: data.current.pressure_mb,
// // //       },
// // //       wind: {
// // //         speed: data.current.wind_kph / 3.6, // המרה מקמ"ש למ'/שנייה
// // //         deg: data.current.wind_degree,
// // //       },
// // //       visibility: data.current.vis_km * 1000, // המרה מק"מ למטרים
// // //     }
// // //   } catch (error) {
// // //     console.error("שגיאה בקבלת נתוני מזג אוויר:", error)
// // //     throw error
// // //   }
// // // }
// // export const fetchWeatherData = async (city) => {
// //   try {
// //     const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`
// //     const response = await fetch(url)

// //     if (!response.ok) {
// //       throw new Error(`שגיאת API: ${response.status} ${response.statusText}`)
// //     }

// //     const data = await response.json()

// //     // החזרת נתונים במבנה מותאם
// //     return {
// //       name: data.name,
// //       sys: {
// //         country: data.sys.country,
// //         sunrise: data.sys.sunrise,
// //         sunset: data.sys.sunset,
// //       },
// //       weather: data.weather,
// //       main: {
// //         temp: data.main.temp,
// //         feels_like: data.main.feels_like,
// //         humidity: data.main.humidity,
// //         pressure: data.main.pressure,
// //       },
// //       wind: {
// //         speed: data.wind.speed,
// //         deg: data.wind.deg,
// //       },
// //       visibility: data.visibility,
// //     }
// //   } catch (error) {
// //     console.error("שגיאה בקבלת נתוני מזג אוויר:", error)
// //     throw error
// //   }
// // }

// // // // פונקציה לקבלת נתוני תחזית ל-5 ימים עבור עיר
// // // export const fetchForecastData = async (city) => {
// // //   try {
// // //     // בניית כתובת ה-API עם פרמטרי שאילתה
// // //     const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`;

// // //     // קבלת נתונים מה-API
// // //     const response = await fetch(url)

// // //     // בדיקה אם התגובה מוצלחת
// // //     if (!response.ok) {
// // //       throw new Error("העיר לא נמצאה או שגיאת API")
// // //     }

// // //     // פענוח תגובת ה-JSON
// // //     const data = await response.json()

// // //     // המרת נתוני התחזית לפורמט שהאפליקציה שלנו מצפה לו
// // //     const forecastList = []

// // //     // עיבוד כל יום
// // //     data.forecast.forecastday.forEach((day) => {
// // //       // עיבוד כל שעה של היום
// // //       day.hour.forEach((hour, index) => {
// // //         // כלול רק כל 3 שעות כדי לדמות את פורמט ה-API של OpenWeatherMap
// // //         if (index % 3 === 0) {
// // //           forecastList.push({
// // //             dt: new Date(hour.time).getTime() / 1000,
// // //             main: {
// // //               temp: hour.temp_c,
// // //               temp_min: hour.temp_c - 1, // קירוב
// // //               temp_max: hour.temp_c + 1, // קירוב
// // //               humidity: hour.humidity,
// // //               pressure: hour.pressure_mb,
// // //             },
// // //             weather: [
// // //               {
// // //                 main: hour.condition.text,
// // //                 description: hour.condition.text,
// // //               },
// // //             ],
// // //             wind: {
// // //               speed: hour.wind_kph / 3.6, // המרה מקמ"ש למ'/שנייה
// // //               deg: hour.wind_degree,
// // //             },
// // //           })
// // //         }
// // //       })
// // //     })

// // //     return forecastList
// // //   } catch (error) {
// // //     console.error("שגיאה בקבלת נתוני תחזית:", error)
// // //     throw error
// // //   }
// // // }

// // // // פונקציה להמרת טמפרטורה מצלזיוס לפרנהייט
// // // export const celsiusToFahrenheit = (celsius) => {
// // //   return (celsius * 9) / 5 + 32
// // // }

// // // // פונקציה להמרת טמפרטורה מפרנהייט לצלזיוס
// // // export const fahrenheitToCelsius = (fahrenheit) => {
// // //   return ((fahrenheit - 32) * 5) / 9
// // // }
// // // קבלת תחזית ל-5 ימים (כל 3 שעות)
// // export const fetchForecastData = async (city) => {
// //   try {
// //     const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`
// //     const response = await fetch(url)

// //     if (!response.ok) {
// //       throw new Error(`שגיאת API: ${response.status} ${response.statusText}`)
// //     }

// //     const data = await response.json()

// //     // כלול רק את התחזיות לכל 3 שעות
// //     const forecastList = data.list.map((item) => ({
// //       dt: item.dt,
// //       main: {
// //         temp: item.main.temp,
// //         temp_min: item.main.temp_min,
// //         temp_max: item.main.temp_max,
// //         humidity: item.main.humidity,
// //         pressure: item.main.pressure,
// //       },
// //       weather: item.weather,
// //       wind: {
// //         speed: item.wind.speed,
// //         deg: item.wind.deg,
// //       },
// //     }))

// //     return forecastList
// //   } catch (error) {
// //     console.error("שגיאה בקבלת נתוני תחזית:", error)
// //     throw error
// //   }
// // }

// // // המרת טמפרטורה מצלזיוס לפרנהייט
// // export const celsiusToFahrenheit = (celsius) => {
// //   return (celsius * 9) / 5 + 32
// // }

// // // המרת טמפרטורה מפרנהייט לצלזיוס
// // export const fahrenheitToCelsius = (fahrenheit) => {
// //   return ((fahrenheit - 32) * 5) / 9
// // }

// const API_KEY = "d4300c3b1ba24ae9f4acebd39397d45e";
// const BASE_URL = "https://api.openweathermap.org/data/2.5";

// // מזג אוויר נוכחי לפי עיר
// export const fetchWeatherData = async (city) => {
//   try {
//     const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`;
//     console.log("📡 URL מזג אוויר נוכחי:", url);

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error("העיר לא נמצאה או שגיאת API");
//     }

//     const data = await response.json();

//     return {
//       name: data.name,
//       sys: {
//         country: data.sys.country,
//         sunrise: data.sys.sunrise,
//         sunset: data.sys.sunset,
//       },
//       weather: data.weather,
//       main: data.main,
//       wind: data.wind,
//       visibility: data.visibility,
//     };
//   } catch (error) {
//     console.error("❌ שגיאה בקבלת נתוני מזג אוויר:", error.message);
//     throw error;
//   }
// };

// // תחזית ל-5 ימים (כל 3 שעות)
// export const fetchForecastData = async (city) => {
//   try {
//     const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`;
//     console.log("📡 URL תחזית:", url);

//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error("העיר לא נמצאה או שגיאת API");
//     }

//     const data = await response.json();

//     const forecastList = data.list.map((item) => ({
//       dt: item.dt,
//       main: item.main,
//       weather: item.weather,
//       wind: item.wind,
//     }));

//     return forecastList;
//   } catch (error) {
//     console.error("❌ שגיאה בקבלת נתוני תחזית:", error.message);
//     throw error;
//   }
// };

// // המרות טמפרטורה
// export const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
// export const fahrenheitToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;


const API_KEY = "d4300c3b1ba24ae9f4acebd39397d45e";
const BASE_URL = "http://api.openweathermap.org/data/2.5";

// הוספת פונקציית עזר לבדיקת חיבור אינטרנט
const checkInternetConnection = async () => {
  try {
    const response = await fetch('http://www.google.com', { 
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// מזג אוויר נוכחי לפי עיר - עם טיפול שגיאות משופר
export const fetchWeatherData = async (city) => {
  try {
    // בדיקת חיבור אינטרנט לפני הקריאה
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      throw new Error("אין חיבור לאינטרנט");
    }

    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`;
    console.log("📡 URL מזג אוויר נוכחי:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000 // טיימאאוט של 10 שניות
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "שגיאה בקבלת נתוני מזג אוויר");
    }

    const data = await response.json();
    console.log("✅ התקבלו נתוני מזג אוויר:", data);

    return {
      name: data.name,
      sys: {
        country: data.sys.country,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      },
      weather: data.weather,
      main: data.main,
      wind: data.wind,
      visibility: data.visibility,
    };
  } catch (error) {
    console.error("❌ שגיאה בקבלת נתוני מזג אוויר:", error.message);
    // הוספת פרטי שגיאה נוספים
    console.error("פרטי שגיאה:", {
      timestamp: new Date().toISOString(),
      city: city,
      error: error.stack
    });
    throw error;
  }
};

// תחזית ל-5 ימים עם טיפול שגיאות משופר
export const fetchForecastData = async (city) => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      throw new Error("אין חיבור לאינטרנט");
    }

    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=he`;
    console.log("📡 URL תחזית:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "שגיאה בקבלת נתוני תחזית");
    }

    const data = await response.json();
    console.log("✅ התקבלו נתוני תחזית");

    const forecastList = data.list.map((item) => ({
      dt: item.dt,
      main: item.main,
      weather: item.weather,
      wind: item.wind,
    }));

    return forecastList;
  } catch (error) {
    console.error("❌ שגיאה בקבלת נתוני תחזית:", error.message);
    console.error("פרטי שגיאה:", {
      timestamp: new Date().toISOString(),
      city: city,
      error: error.stack
    });
    throw error;
  }
};

// המרות טמפרטורה משופרות עם בדיקות תקינות
export const celsiusToFahrenheit = (celsius) => {
  if (typeof celsius !== 'number') {
    throw new Error('הערך חייב להיות מספר');
  }
  return Number(((celsius * 9) / 5 + 32).toFixed(1));
};

export const fahrenheitToCelsius = (fahrenheit) => {
  if (typeof fahrenheit !== 'number') {
    throw new Error('הערך חייב להיות מספר');
  }
  return Number(((fahrenheit - 32) * 5 / 9).toFixed(1));
};

// פונקציית עזר להמרת timestamp לפורמט תאריך מקומי
export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};