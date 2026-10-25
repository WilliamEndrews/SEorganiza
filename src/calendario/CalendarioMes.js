import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { ptBR } from "../../src/utilidades/localeCalendarConfig.js";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

export default function CalendarioMes({ corTexto }) {
  const [day, setDay] = useState(
    /** @type {import("react-native-calendars").DateData | null} */ (null),
  );

  return (
    <View>
      <Calendar
        style={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderRadius: 10,
          borderColor: corTexto,
          padding: 5,
          boxShadow: "0px 4px 2px rgba(0, 0, 0, 0.25)",
        }}
        headerStyle={{
          borderBottomWidth: 1,
          borderBlockColor: corTexto,
        }}
        theme={{
          monthTextColor: corTexto,
          textMonthFontSize: 25,
          arrowColor: corTexto,
          textSectionTitleColor: corTexto,

          textDisabledColor: "rgba(255, 255, 255, .40)",
          dayTextColor: "black",
          todayTextColor: "#0088FF",

          calendarBackground: "transparent",
          selectedDayBackgroundColor: "#0088FF",
          selectedDayTextColor: "white",
        }}
        onDayPress={setDay}
        markedDates={
          day && {
            [day.dateString]: {selected: true}
          }
        }
        /* dayComponent={({ date }) => {
          return (
            <TouchableOpacity>
              <Text>{date.day}</Text>
            </TouchableOpacity>
          );
        }} */
      />
    </View>
  );
}
