import { TouchableOpacityProps } from "react-native";
import { Heading, HStack, Text, VStack, Avatar, Box } from "native-base";



export interface PoolCardParticipantProps {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
}


interface Props extends TouchableOpacityProps {
  data: PoolCardParticipantProps;
  placing: number;
}

export function PoolCardParticipant({ data, placing, ...rest }: Props) {

  return (
    <VStack>
      <HStack
        w="full"
        h={20}
        bgColor="gray.800"
        borderBottomWidth={3}
        borderBottomColor="yellow.500"
        justifyContent="space-between"
        alignItems="center"
        rounded="sm"
        mb={3}
        p={4}
      >
        <HStack>
          <Avatar
            key={data.id}
            source={{ uri: data.user.avatarUrl }}
            w={12}
            h={12}
            rounded="full"
            borderWidth={2}
            marginRight={3}
            borderColor="gray.800"
          />
          <VStack>

            <Heading color="white" fontSize="md" pb={1} fontFamily="heading">
              {data.user.name}
            </Heading>
            <Text color="gray.200" fontSize="xs">
              {/* {data.score} */}
              36 ponto(s)
            </Text>

          </VStack>
        </HStack>
        <Box w={37} h={23} justifyContent="center" alignItems="center" rounded="xl" backgroundColor="yellow.500">
          <Heading size="xs">
            {placing + 1}°
          </Heading>
        </Box>

      </HStack>
    </VStack>
  );
}
