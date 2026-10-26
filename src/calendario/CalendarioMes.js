import { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
        style={[styles.calendario, { borderColor: corTexto }]}
        renderArrow={(direction) => (
          <Ionicons
            name={direction === "left" ? "chevron-back" : "chevron-forward"}
            color={corTexto}
            size={15}
          />
        )}
        headerStyle={{
          borderBottomWidth: 1,
          borderBlockColor: corTexto,
        }}
        theme={{
          monthTextColor: corTexto,
          textMonthFontSize: 25,
          arrowColor: corTexto,
          textSectionTitleColor: corTexto,
          calendarBackground: "transparent",
          arrowStyle: { padding: 0, margin: 0 },
        }}
        dayComponent={({ date, state }) => {
          return (
            <TouchableOpacity
              style={[
                styles.day,
                date.dateString === day?.dateString && styles.selectedDay,
              ]}
            >
              <Text
                onPress={() => setDay(date)}
                style={[
                  { color: corTexto },
                  state === "today" && styles.today,
                  date.dateString === day?.dateString && { color: corTexto },
                ]}
              >
                {state != "disabled" ? date.day : ""}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendario: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    boxShadow: "0px 4px 2px rgba(0, 0, 0, 0.25)",
  },
  day: {
    width: 32,
    height: 32,
    alignItems: /** @type {"center"} */ ("center"),
    justifyContent: /** @type {"center"} */ ("center"),
    borderRadius: 8,
  },
  today: {
    color: "#0088FF",
    fontWeight: "bold",
  },
  selectedDay: {
    backgroundColor: "#0088FF",
    color: "white",
  },
});
