import React, { useEffect, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import dayjs from "dayjs";

const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return dayjs(date).add(diff, "day");
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

export default function Index() {
  const [startOfWeek, setStartOfWeek] = useState(getMonday(new Date()));
  const [weekDates, setWeekDates] = useState<
    { date: dayjs.Dayjs; day: string }[]
  >([]);

  useEffect(() => {
    setWeekDates(calculateWeekDates(startOfWeek));
  }, [startOfWeek]);

  const calculateWeekDates = (start: dayjs.Dayjs) => {
    return weekdays.map((dayName, i) => ({
      date: start.add(i, "day"),
      day: dayName,
    }));
  };

  const prevWeek = () => setStartOfWeek(startOfWeek.subtract(1, "week"));
  const nextWeek = () => setStartOfWeek(startOfWeek.add(1, "week"));

  console.log(startOfWeek);

  return (
    <View>
      <View className="flex-row">
        <TouchableOpacity onPress={prevWeek}>
          <Text>prev</Text>
        </TouchableOpacity>
        <View>
          <Text>
            {startOfWeek.format("M월 D일")} -{" "}
            {startOfWeek.add(6, "day").format("M월 D일")}
          </Text>
          <Text></Text>
        </View>
        <TouchableOpacity onPress={nextWeek}>
          <Text>next</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {weekDates.map(({ date, day }) => {
          console.log(date, day);
          //   const dataForDate = weekData.find((d) => d.date === date);
          return (
            <View key={date.format("YYYY-MM-DD")}>
              <Text>{day}</Text>
              <Text>{date.format("M월 D일")}</Text>
              {/* <Text>{dataForDate?.value || "-"}</Text> */}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
