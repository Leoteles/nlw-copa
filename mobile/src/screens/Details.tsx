import { HStack, useToast, VStack } from "native-base";
import { Share } from 'react-native';
import { useRoute } from '@react-navigation/native'
import { Header} from '../components/Header';
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import {PoolCardProps} from '../components/PoolCard'
import {Option} from '../components/Option'
import {Guesses} from '../components/Guesses'
import {PoolHeader} from '../components/PoolHeader'
interface RouteParams {
    id: String;
}

export function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranking do grupo'>('Seus Palpites');
    const toast = useToast();
    const route = useRoute();
    const { id } = route.params as RouteParams;

    async function fetchPoolDetails(){
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);
            // console.log(response.data.pool.participants);
            setPoolDetails(response.data.pool);
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(()=> {
        fetchPoolDetails();
    },[id]);
    if (isLoading) {
        return (
            <Loading />
        )
    }
    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header
             title={poolDetails.title}
             showBackButton
             showShareButton
             onShare={handleCodeShare}
             />

            {
                poolDetails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />
                    <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                    <Option
                        title='Seus Palpites'
                        isSelected={optionSelected === 'Seus Palpites'}
                        onPress={()=>setOptionSelected('Seus Palpites')}
                    />
                    <Option
                        title='Ranking do grupo'
                        isSelected={optionSelected === 'Ranking do grupo'}
                        onPress={()=>setOptionSelected("Ranking do grupo")}
                    />
                   </HStack>

                   <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                </VStack>
                : <EmptyMyPoolList code={poolDetails.code} />
            }
        </VStack>
    )
}