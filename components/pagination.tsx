import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  blockSize?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalItems,
  onPageChange,
  blockSize = 5,
  itemsPerPage = 5,
}: Props) {
  if (totalItems <= itemsPerPage) return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startBlock = currentBlock * blockSize + 1;
  const endBlock = Math.min(startBlock + blockSize - 1, totalPages);

  const pages = [];
  for (let i = startBlock; i <= endBlock; i++) {
    pages.push(i);
  }

  const goToPrevBlock = () => onPageChange(startBlock - 1);
  const goToNextBlock = () => onPageChange(startBlock + blockSize);

  //   const goToPrevPage = () => onPageChange(1);
  //   const goToLastPage = () => onPageChange(totalPages);

  return (
    <View className="w-full flex-row justify-center  items-center ">
      {/* {totalPages > blockSize && currentBlock > 1 && (
        <TouchableOpacity
          onPress={goToPrevPage}
          className={`w-10 h-10 mx-1 rounded-lg bg-gray-100  items-center justify-center `}
        >
          <Text className="text-sm font-medium text-gray-700">{"<<"}</Text>
        </TouchableOpacity>
      )} */}

      {startBlock > 1 && (
        <TouchableOpacity
          onPress={goToPrevBlock}
          className="w-10 h-10 mx-1 rounded-lg bg-gray-100  items-center justify-center"
        >
          <Text className="text-sm font-medium text-gray-700">{"<"}</Text>
        </TouchableOpacity>
      )}

      {pages.map((item) => (
        <TouchableOpacity
          key={item}
          className={`w-10 h-10 mx-1 rounded-lg items-center justify-center ${
            item === currentPage ? "bg-black" : "bg-gray-100"
          }`}
          onPress={() => onPageChange(item)}
        >
          <Text
            className={`text-sm font-medium ${item === currentPage ? "text-white" : "text-gray-700"}`}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      {endBlock < totalPages && (
        <TouchableOpacity
          onPress={goToNextBlock}
          className="w-10 h-10 mx-1 rounded-lg bg-gray-100  items-center justify-center"
        >
          <Text className="text-sm font-medium text-gray-700">{">"}</Text>
        </TouchableOpacity>
      )}

      {/* {totalPages > blockSize && endBlock < totalPages && (
        <TouchableOpacity
          onPress={goToLastPage}
          className="w-10 h-10 mx-1 rounded-lg bg-gray-100  items-center justify-center"
        >
          <Text className="text-sm font-medium text-gray-700">{">>"}</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
}
