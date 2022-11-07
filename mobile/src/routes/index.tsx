import { Box } from 'native-base' //Para nao dar glitch entre tela, ja que tudo vai ficar dentro de um box de mesma cor
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { AppRoutes } from './app.routes';
import { SignIn } from '../screens/SignIn';

export function Routes(){
    const {user} = useAuth();

    return (

        <Box flex={1} bg='gray.900'>
        <NavigationContainer>

            {/* <AppRoutes /> */}
            {/* <SignIn /> */}
            {user.name ? <AppRoutes /> : <SignIn />}


        </NavigationContainer>
        </Box>
    )
}