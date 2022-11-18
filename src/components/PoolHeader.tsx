import { Heading, HStack, Text, VStack } from 'native-base';

import { PoolCardProps } from './PoolCard';
import { Participants } from './Participants';

interface Props {
  data: PoolCardProps;
  option: 'guesses' | 'ranking'
}

export function PoolHeader({ data, option }: Props) {
  return (
    <HStack
      w="full"
      h={20}
      bgColor="transparent"
      borderBottomWidth={1}
      borderBottomColor="gray.600"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      p={4}
    >
      <VStack>
        <Heading color="white" fontSize="md" fontFamily="heading">
          {data.title}
        </Heading>

        <HStack>
          <Text color="gray.200" fontSize="xs" mr={1}>
            {option === "guesses" ? 'Código:' : 'Criado por'}
          </Text>

          <Text color="gray.200" fontSize="xs" fontFamily="heading">
            {option === "guesses" ? data.code : data.owner.name}
          </Text>
        </HStack>
      </VStack>

      <Participants
        count={data._count?.participants}
        participants={data.participants}
      />
    </HStack>
  );
}