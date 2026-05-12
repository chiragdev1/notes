# Notes App – Submission Details

## Components Used
- SafeAreaView
- View
- Text
- TextInput
- FlatList
- Pressable
- Switch
- ScrollView
- KeyboardAvoidingView
- ImageBackground
- Alert

---

## Hooks Used
- `useState()` — state management for notes, theme, editor, and search
- `useMemo()` — optimized filtered notes and dynamic styles
- `useColorScheme()` — automatic dark/light mode detection
- `useWindowDimensions()` — responsive layouts for phones and tablets

---

## Additional Improvements / UI Enhancements Added
- Responsive UI for both mobile and tablet screen sizes
- Dynamic dark/light theme support
- Search functionality for filtering notes
- Focus mode toggle for distraction-free note viewing
- Press animations for better user interaction feedback
- Modern card-based layout with spacing and typography hierarchy
- Keyboard-safe editor screen using `KeyboardAvoidingView`
- Image header section for improved visual design
- Empty state UI when no notes are found
- Reusable and structured styling using `StyleSheet.create()`
- Optimized styling using `StyleSheet.compose()`
- Clean visual hierarchy with consistent spacing and rounded components