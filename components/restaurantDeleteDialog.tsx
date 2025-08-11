import React from "react";

import { Button, Dialog, Portal, Text } from "react-native-paper";

interface Props {
  hideDialog: () => void;
  confirmDelete: () => Promise<void>;
}

export default function RestaurantDeleteDialog({
  hideDialog,
  confirmDelete,
}: Props) {
  return (
    <Portal>
      <Dialog visible>
        <Dialog.Title>삭제 확인</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            이 항목을 삭제할까요? 삭제하면 복구 불가합니다
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} labelStyle={{ color: "#666" }}>
            취소
          </Button>
          <Button onPress={confirmDelete} labelStyle={{ color: "red" }}>
            삭제
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
