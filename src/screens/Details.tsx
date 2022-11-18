import { Share } from "react-native";
import { useState, useEffect } from "react";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { api } from "../services/api";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { PoolCardParticipant, PoolCardParticipantProps } from "../components/PoolCardParticipant";
import { RankingParticipant } from "../components/RankingParticipant";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [participantsPool, setParticipantsPool] = useState<PoolCardParticipantProps[]>([])
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  async function getPoolDetails() {
    try {
      setIsLoading(true);
      const [poolResponse, participantsResponse] =
        await Promise.all([
          api.get(`/pools/${id}`),
          api.get(`/pools/${id}/participants`),
        ]);

      console.log(participantsResponse.data.participants);


      setPoolDetails(poolResponse.data.pool);
      setParticipantsPool(participantsResponse.data.pool.participants)
    } catch (err) {
      console.log(err);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        onShare={handleCodeShare}
        title={poolDetails.title}
        showBackButton
        showShareButton
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} option={optionSelected} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>
          {optionSelected === "guesses" ? (
            <Guesses poolId={poolDetails.id} code={poolDetails.code} />

          ) : (
            <RankingParticipant participants={participantsPool} />
          )}

        </VStack>
      ) : (
        <EmptyMyPoolList onShare={handleCodeShare} code={poolDetails.code} />
      )}
    </VStack>
  );
}
