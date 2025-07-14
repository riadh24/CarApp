import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    StatusBar, 
    ImageBackground,
    Animated,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { Button, ThemeToggle } from '../components';

import { setHasSeenLanding } from '../Store';

const LandingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: 1000,
        }).start();
    }, [opacity]);

    const handleGetStarted = () => {
        try {
            dispatch(setHasSeenLanding(true));
            // Navigation is handled automatically by Redux state change
        } catch (error) {
            console.error('Error in handleGetStarted:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Theme Toggle Button */}
            <ThemeToggle style={styles.themeToggle} />

            {/* Background */}
            <ImageBackground
                source={{
                    uri: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop'
                }}
                style={styles.backgroundImage}
                resizeMode="cover"
                imageStyle={styles.backgroundImageStyle}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(2,2,2,0.8)', '#020202']}
                    style={styles.gradient}
                >
                    <Animated.View style={[styles.content, { opacity }]}>
                        {/* Title */}
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                Premium cars.{'\n'}Enjoy the luxury
                            </Text>
                            <Text style={styles.subtitle}>
                                Premium and prestige car for your lifestyle.{'\n'}
                                Experience the thrill at affordable rate
                            </Text>
                        </View>

                        {/* Button */}
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Let's Go"
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
    themeToggle: {
        position: 'absolute',
        top: 50,
        right: 24,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
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
    },
    title: {
        color: '#fff',
        fontSize: 41,
        fontWeight: 'bold',
        lineHeight: 50,
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        color: '#CDD6DF',
        fontSize: 16,
        lineHeight: 22,
        width: '85%',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        width: '85%',
        backgroundColor: '#fff',
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonText: {
        color: '#192129',
        fontWeight: 'bold',
    },
});

export default LandingScreen;
