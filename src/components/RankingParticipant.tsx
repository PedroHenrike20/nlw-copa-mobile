import { Share } from "react-native";
import { useToast, FlatList } from "native-base";
import { useState, useEffect } from "react";
import { api } from "../services/api";

import { Loading } from "./Loading";
import { EmptyRakingList } from "./EmptyRakingList";
import { PoolCardParticipant, PoolCardParticipantProps } from "./PoolCardParticipant";
import { ParticipantProps } from "./Participants";

interface Props {
  participants: PoolCardParticipantProps[]
}

export function RankingParticipant({ participants }: Props) {


  return (
    <FlatList
      data={participants}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <PoolCardParticipant data={item} placing={index} />
      )}
      _contentContainerStyle={{ pb: 30 }}
      ListEmptyComponent={() => (
        <EmptyRakingList />
      )}
    />
  );
}
