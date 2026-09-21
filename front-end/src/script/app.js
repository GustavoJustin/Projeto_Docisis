import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SplashScreen from '../../splashScreen';
import RelatoriosScreen from '../../relatoriosScreen';
import Sidebar from '../componentes/sidebar';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Menu Lateral com os componentes estilizados
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} activePage={props.state.routes[props.state.index].name.toLowerCase()} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Relatorios" component={RelatoriosScreen} />
      {/* Adicionar as demais telas aqui */}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}