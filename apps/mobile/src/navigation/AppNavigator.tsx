import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { HomeFeedScreen } from '../screens/HomeFeedScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { RefinedFeedScreen } from '../screens/RefinedFeedScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { WithdrawScreen } from '../screens/WithdrawScreen';
import { CompletePurchaseScreen } from '../screens/CompletePurchaseScreen';
import { CreatorDashboardScreen } from '../screens/CreatorDashboardScreen';
import { LiveStreamRoomScreen } from '../screens/LiveStreamRoomScreen';
import { FanAchievementsScreen } from '../screens/FanAchievementsScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { IdentityVerificationScreen } from '../screens/IdentityVerificationScreen';
import { UploadIDDocumentScreen } from '../screens/UploadIDDocumentScreen';
import { VerificationPendingScreen } from '../screens/VerificationPendingScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ChallengeListScreen } from '../screens/ChallengeListScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { ReferralScreen } from '../screens/ReferralScreen';
import { PKBattleScreen } from '../screens/PKBattleScreen';
import { ClipsScreen } from '../screens/ClipsScreen';

type TabParamList = {
  HomeTab: undefined;
  DiscoverTab: undefined;
  FeedTab: undefined;
  WalletTab: undefined;
  MoreTab: undefined;
  ChallengeTab: undefined;
};

type HomeStackParamList = {
  Home: undefined;
  LiveStream: undefined;
  CreatorDashboard: undefined;
};

type WalletStackParamList = {
  Wallet: undefined;
  Withdraw: undefined;
  CompletePurchase: undefined;
  Achievements: undefined;
  Notifications: undefined;
  IdentityVerification: undefined;
  UploadID: undefined;
  VerificationPending: undefined;
};

type ChallengeStackParamList = {
  ChallengeList: undefined;
  Leaderboard: undefined;
  ChallengeDetail: { challengeId: string };
  Subscriptions: undefined;
  Referral: undefined;
  PKBattle: undefined;
  Clips: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const WalletStack = createNativeStackNavigator<WalletStackParamList>();
const ChallengeStack = createNativeStackNavigator<ChallengeStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeFeedScreen} />
      <HomeStack.Screen name="LiveStream" component={LiveStreamRoomScreen} />
      <HomeStack.Screen name="CreatorDashboard" component={CreatorDashboardScreen} />
    </HomeStack.Navigator>
  );
}

function WalletStackScreen() {
  return (
    <WalletStack.Navigator screenOptions={{ headerShown: false }}>
      <WalletStack.Screen name="Wallet" component={WalletScreen} />
      <WalletStack.Screen name="Withdraw" component={WithdrawScreen} />
      <WalletStack.Screen name="CompletePurchase" component={CompletePurchaseScreen} />
      <WalletStack.Screen name="Achievements" component={FanAchievementsScreen} />
      <WalletStack.Screen name="Notifications" component={NotificationSettingsScreen} />
      <WalletStack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <WalletStack.Screen name="UploadID" component={UploadIDDocumentScreen} />
      <WalletStack.Screen name="VerificationPending" component={VerificationPendingScreen} />
    </WalletStack.Navigator>
  );
}

function ChallengeStackScreen() {
  return (
    <ChallengeStack.Navigator screenOptions={{ headerShown: false }}>
      <ChallengeStack.Screen name="ChallengeList" component={ChallengeListScreen} />
      <ChallengeStack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <ChallengeStack.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <ChallengeStack.Screen name="Referral" component={ReferralScreen} />
      <ChallengeStack.Screen name="PKBattle" component={PKBattleScreen} />
      <ChallengeStack.Screen name="Clips" component={ClipsScreen} />
    </ChallengeStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
            if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'DiscoverTab') iconName = focused ? 'compass' : 'compass-outline';
            else if (route.name === 'FeedTab') iconName = focused ? 'film' : 'film-outline';
            else if (route.name === 'WalletTab') iconName = focused ? 'wallet' : 'wallet-outline';
            else if (route.name === 'MoreTab') iconName = focused ? 'grid' : 'grid-outline';
            else if (route.name === 'ChallengeTab') iconName = focused ? 'trophy' : 'trophy-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.brandOrange,
          tabBarInactiveTintColor: colors.outline,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.glassBorder,
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
            paddingBottom: 28,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="DiscoverTab" component={DiscoverScreen} options={{ tabBarLabel: 'Discover' }} />
        <Tab.Screen name="FeedTab" component={RefinedFeedScreen} options={{ tabBarLabel: 'Feed' }} />
        <Tab.Screen name="ChallengeTab" component={ChallengeStackScreen} options={{ tabBarLabel: 'Challenges' }} />
        <Tab.Screen name="WalletTab" component={WalletStackScreen} options={{ tabBarLabel: 'Wallet' }} />
        <Tab.Screen name="MoreTab" component={CreatorDashboardScreen} options={{ tabBarLabel: 'Studio' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
