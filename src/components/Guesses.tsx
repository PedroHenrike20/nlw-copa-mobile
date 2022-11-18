import { Share } from "react-native";
import { useToast, FlatList } from "native-base";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSendGuess, setLoadingSendGuess] = useState(false);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const [games, setGames] = useState<GameProps[]>([]);

  const toast = useToast();

  async function getGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (err) {
      console.log(err);
      toast.show({
        title: "Não foi possível carregar os jogos!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do jogo!",
          placement: "top",
          bgColor: "red.500",
        });
      }
      // setLoadingSendGuess(true);

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamsPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite realizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      await getGames();
    } catch (err) {
      console.log(err?.response?.data?.message);
      if (
        err?.response?.data?.message ===
        "You cannot send guesses after the game date."
      ) {
        return toast.show({
          title: "Esse jogo já foi encerrado!",
          placement: "top",
          bgColor: "red.500",
        });
      }
      toast.show({
        title: "Não foi possível enviar o seu palpite",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: code,
    });
  }

  useEffect(() => {
    getGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
        />
      )}
      _contentContainerStyle={{ pb: 30 }}
      ListEmptyComponent={() => (
        <EmptyMyPoolList onShare={handleCodeShare} code={code} />
      )}
    />
  );
}
