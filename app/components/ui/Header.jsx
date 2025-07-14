import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../hooks/UseThemeHooks';
import IconButton from './IconButton';

/**
 * Reusable Header Component
 * Single Responsibility: Consistent header layout across screens
 * Open/Closed: Extensible through props
 */
const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  onBackPress,
  showBackButton = false,
  style,
  titleStyle,
  showBadge = false,
  badgeCount = 0,
  ...props
}) => {
  const { theme } = useTheme();

  // Determine left icon and action
  const effectiveLeftIcon = showBackButton ? 'arrow-back' : leftIcon;
  const effectiveLeftPress = showBackButton ? onBackPress : onLeftPress;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]} {...props}>
      {/* Left Action */}
      <View style={styles.leftContainer}>
        {(effectiveLeftIcon || showBackButton) && (
          <IconButton
            icon={effectiveLeftIcon}
            onPress={effectiveLeftPress}
            color={theme.colors.text}
            style={styles.actionButton}
          />
        )}
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }, titleStyle]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Action */}
      <View style={styles.rightContainer}>
        {rightIcon && (
          <View style={styles.rightActionContainer}>
            <IconButton
              icon={rightIcon}
              onPress={onRightPress}
              color={theme.colors.text}
              style={styles.actionButton}
            />
            {showBadge && badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    width: 50,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  actionButton: {
    padding: 8,
  },
  rightActionContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
