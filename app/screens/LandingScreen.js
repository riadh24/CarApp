import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Button } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const LandingScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { setHasSeenLanding } = useAuth();
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: 1000,
        }).start();
    }, [opacity]);

    const handleGetStarted = async () => {
        try {
            await setHasSeenLanding(true);
            // Navigation is handled automatically by auth state change
        } catch (error) {
            if (__DEV__) {
                console.error('Error in handleGetStarted:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background */}
            <ImageBackground
                source={require('../assets/images/cars/suv_1.jpeg')} // You can replace this with your landing-car.jpg when you save it
                style={styles.backgroundImage}
                resizeMode="cover"
                imageStyle={styles.backgroundImageStyle}
            >
                <LinearGradient
                    colors={['rgba(0,20,40,0.4)', 'rgba(0,10,30,0.7)', 'rgba(0,5,15,0.9)']}
                    style={styles.gradient}
                >
                    <Animated.View style={[styles.content, { opacity }]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                {t('landing.title')}
                            </Text>
                            <Text style={styles.subtitle}>
                                {t('landing.subtitle')}
                            </Text>
                        </View>

                        {/* Button */}
                        <View style={styles.buttonContainer}>
                            <Button
                                title={t('landing.letsGo')}
                                onPress={handleGetStarted}
                                variant="secondary"
                                size="large"
                                style={styles.button}
                                textStyle={styles.buttonText}
                            />
                        </View>
                    </Animated.View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020202',
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
    },
    backgroundImageStyle: {
        width: width,
        height: height,
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 48,
        paddingTop: 120,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 40,
        paddingHorizontal: 4,
    },
    title: {
        color: '#fff',
        fontSize: 42,
        fontWeight: 'bold',
        lineHeight: 50,
        marginBottom: 16,
        textShadowColor: 'rgba(0, 20, 40, 0.9)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
        letterSpacing: 0.5,
    },
    subtitle: {
        color: '#E8F1FF',
        fontSize: 16,
        lineHeight: 24,
        width: '90%',
        textShadowColor: 'rgba(0, 20, 40, 0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        opacity: 0.95,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        width: '85%',
        backgroundColor: '#fff',
        borderWidth: 0,
        shadowColor: '#1E3A8A',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: '#1E40AF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default LandingScreen;
