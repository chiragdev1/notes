import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  ടെxt,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

const SAMPLE_NOTES = [
  {
    id: "1",
    title: "Meeting notes",
    content:
      "Discuss project timeline, confirm sprint scope, and prepare the demo checklist for Friday.",
    date: "Today · 9:40 AM",
  },
  {
    id: "2",
    title: "Shopping list",
    content:
      "Coffee, muskmelon, banana, mechanical keyboard, pull up bar",
    date: "Yesterday · 6:15 PM",
  },
  {
    id: "3",
    title: "Ideas",
    content:
      "Build a habit tracker, redesign the dashboard, add quick search, and support offline sync.",
    date: "Mon · 2:30 PM",
  },
  {
    id: "4",
    title: "Study plan",
    content:
      "Revise React Native core components, practice hooks, review layout concepts, and build two screens.",
    date: "Sun · 8:10 PM",
  },
];

const LIGHT = {
  bg: "#F5F7FB",
  card: "#FFFFFF",
  text: "#101828",
  subtext: "#667085",
  border: "#D0D5DD",
  inputBg: "#FFFFFF",
  accent: "#2563EB",
  accentSoft: "#DBEAFE",
  dangerSoft: "#FEF3F2",
};

const DARK = {
  bg: "#0B1220",
  card: "#121A2A",
  text: "#F9FAFB",
  subtext: "#98A2B3",
  border: "#253046",
  inputBg: "#0F172A",
  accent: "#60A5FA",
  accentSoft: "#1E3A8A",
  dangerSoft: "#3B1D1D",
};

export default function App() {
  const systemScheme = useColorScheme();
  const [forcedScheme, setForcedScheme] = useState(null); // null = system
  const [focusMode, setFocusMode] = useState(false);
  const [screen, setScreen] = useState("notes");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [draft, setDraft] = useState({
    id: null,
    title: "",
    content: "",
  });

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const padding = isTablet ? 24 : 16;
  const numColumns = isTablet ? 2 : 1;

  const scheme = forcedScheme ?? systemScheme ?? "light";
  const colors = scheme === "dark" ? DARK : LIGHT;

  const styles = useMemo(
    () => createStyles(colors, padding, isTablet),
    [colors, padding, isTablet],
  );

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.date.toLowerCase().includes(q),
    );
  }, [notes, search]);

  const openEditor = (note = null) => {
    if (note) {
      setDraft({ id: note.id, title: note.title, content: note.content });
    } else {
      setDraft({ id: null, title: "", content: "" });
    }
    setScreen("editor");
  };

  const saveNote = () => {
    const title = draft.title.trim();
    const content = draft.content.trim();

    if (!title || !content) {
      Alert.alert(
        "Missing details",
        "Please add both a title and note content.",
      );
      return;
    }

    const now = new Date();
    const date = now.toLocaleString([], {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });

    setNotes((prev) => {
      const existing = draft.id && prev.find((n) => n.id === draft.id);
      if (existing) {
        return prev.map((n) =>
          n.id === draft.id ? { ...n, title, content, date } : n,
        );
      }

      const newNote = {
        id: String(Date.now()),
        title,
        content,
        date: `Saved · ${date}`,
      };
      return [newNote, ...prev];
    });

    setScreen("notes");
  };

  const renderNoteCard = ({ item }) => {
    const cardStyle = StyleSheet.compose(
      styles.card,
      focusMode && styles.cardFocus,
    );

    return (
      <Pressable
        onPress={() => openEditor(item)}
        style={({ pressed }) => [cardStyle, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {!focusMode && (
          <Text style={styles.cardPreview} numberOfLines={3}>
            {item.content}
          </Text>
        )}

        <Text style={styles.cardDate}>{item.date}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        edges={["top"]}
        style={[styles.safeArea, { backgroundColor: colors.bg }]}
      >
        <View style={styles.appShell}>
          <View style={styles.segmentRow}>
            <Pressable
              onPress={() => setScreen("notes")}
              style={({ pressed }) => [
                styles.segmentButton,
                screen === "notes" && styles.segmentButtonActive,
                pressed && styles.segmentButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  screen === "notes" && styles.segmentTextActive,
                ]}
              >
                Notes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => openEditor()}
              style={({ pressed }) => [
                styles.segmentButton,
                screen === "editor" && styles.segmentButtonActive,
                pressed && styles.segmentButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  screen === "editor" && styles.segmentTextActive,
                ]}
              >
                Editor
              </Text>
            </Pressable>
          </View>

          {screen === "notes" ? (
            <View style={styles.screen}>
              <View style={styles.headerBlock}>
                <View style={styles.headerTitleRow}>
                  <View>
                    <Text style={styles.pageTitle}>My Notes</Text>
                    <Text style={styles.pageSubtitle}>
                      {filteredNotes.length} note
                      {filteredNotes.length === 1 ? "" : "s"} available
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      setForcedScheme((prev) =>
                        (prev ?? systemScheme) === "dark" ? "light" : "dark",
                      )
                    }
                    style={({ pressed }) => [
                      styles.themeToggle,
                      pressed && styles.themeTogglePressed,
                    ]}
                  >
                    <Text style={styles.toggleLabel}>
                      {scheme === "dark" ? "Dark" : "Light"}
                    </Text>
                    <Switch
                      value={scheme === "dark"}
                      onValueChange={(value) =>
                        setForcedScheme(value ? "dark" : "light")
                      }
                    />
                  </Pressable>
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Focus</Text>
                  <Switch value={focusMode} onValueChange={setFocusMode} />
                </View>

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search notes"
                  placeholderTextColor={colors.subtext}
                  style={styles.searchInput}
                />
              </View>

              <FlatList
                data={filteredNotes}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                renderItem={renderNoteCard}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={numColumns > 1 ? styles.columnWrap : null}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No notes found</Text>
                    <Text style={styles.emptyText}>
                      Try a different search term or create a new note.
                    </Text>
                  </View>
                }
              />
            </View>
          ) : (
            <KeyboardAvoidingView
              style={styles.screen}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.editorScroll}
                showsVerticalScrollIndicator={false}
              >
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
                  }}
                  style={styles.hero}
                  imageStyle={styles.heroImage}
                >
                  <View style={styles.heroOverlay} />
                  <View style={styles.heroTopRow}>
                    <Pressable
                      onPress={() => setScreen("notes")}
                      style={({ pressed }) => [
                        styles.heroButton,
                        pressed && styles.heroButtonPressed,
                      ]}
                    >
                      <Text style={styles.heroButtonText}>Back</Text>
                    </Pressable>

                    <Pressable
                      onPress={saveNote}
                      style={({ pressed }) => [
                        styles.heroButton,
                        styles.heroButtonPrimary,
                        pressed && styles.heroButtonPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.heroButtonText,
                          styles.heroButtonPrimaryText,
                        ]}
                      >
                        Save
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={styles.heroTitle}>
                    {draft.id ? "Edit Note" : "New Note"}
                  </Text>
                  <Text style={styles.heroSubtitle}>
                    Write comfortably with proper spacing and keyboard-safe
                    layout.
                  </Text>
                </ImageBackground>

                <View style={styles.editorCard}>
                  <Text style={styles.fieldLabel}>Title</Text>
                  <TextInput
                    value={draft.title}
                    onChangeText={(text) =>
                      setDraft((prev) => ({ ...prev, title: text }))
                    }
                    placeholder="Note title"
                    placeholderTextColor={colors.subtext}
                    style={styles.titleInput}
                  />

                  <Text style={styles.fieldLabel}>Content</Text>
                  <TextInput
                    value={draft.content}
                    onChangeText={(text) =>
                      setDraft((prev) => ({ ...prev, content: text }))
                    }
                    placeholder="Start writing your note..."
                    placeholderTextColor={colors.subtext}
                    multiline
                    textAlignVertical="top"
                    style={styles.bodyInput}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

function createStyles(colors, padding, isTablet) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    appShell: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: padding,
      paddingTop: 8,
    },
    segmentRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
    },
    segmentButton: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segmentButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    segmentButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
    segmentText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },
    segmentTextActive: {
      color: "#FFFFFF",
    },
    screen: {
      flex: 1,
    },
    headerBlock: {
      marginBottom: 12,
    },
    headerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 12,
    },
    pageTitle: {
      fontSize: isTablet ? 30 : 26,
      lineHeight: isTablet ? 36 : 32,
      fontWeight: "800",
      color: colors.text,
    },
    pageSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: colors.subtext,
    },
    themeToggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    themeTogglePressed: {
      opacity: 0.9,
    },
    toggleLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.text,
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    switchLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    searchInput: {
      height: 48,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.inputBg,
      paddingHorizontal: 14,
      color: colors.text,
      fontSize: 15,
    },
    listContent: {
      paddingBottom: 20,
    },
    columnWrap: {
      gap: 12,
      marginBottom: 12,
    },
    card: {
      flex: 1,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 12,
      minHeight: 132,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    cardFocus: {
      minHeight: 118,
    },
    cardPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.99 }],
    },
    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    cardTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
    },
    cardPreview: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.subtext,
      marginBottom: 12,
    },
    cardDate: {
      marginTop: "auto",
      fontSize: 12,
      fontWeight: "600",
      color: colors.subtext,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 14,
      color: colors.subtext,
      textAlign: "center",
      maxWidth: 260,
      lineHeight: 20,
    },
    editorScroll: {
      paddingBottom: 24,
    },
    hero: {
      minHeight: isTablet ? 240 : 210,
      borderRadius: 22,
      overflow: "hidden",
      justifyContent: "space-between",
      padding: 16,
      marginBottom: 16,
    },
    heroImage: {
      borderRadius: 22,
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    heroTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      zIndex: 1,
    },
    heroButton: {
      minWidth: 92,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    heroButtonPrimary: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    heroButtonPressed: {
      opacity: 0.9,
    },
    heroButtonText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    heroButtonPrimaryText: {
      color: "#FFFFFF",
    },
    heroTitle: {
      zIndex: 1,
      fontSize: isTablet ? 34 : 28,
      lineHeight: isTablet ? 40 : 34,
      fontWeight: "900",
      color: "#FFFFFF",
      marginTop: 18,
    },
    heroSubtitle: {
      zIndex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: "rgba(255,255,255,0.9)",
      maxWidth: 420,
      marginTop: 6,
    },
    editorCard: {
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8,
      marginTop: 4,
    },
    titleInput: {
      height: 50,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.inputBg,
      paddingHorizontal: 14,
      color: colors.text,
      fontSize: 15,
      marginBottom: 14,
    },
    bodyInput: {
      minHeight: isTablet ? 360 : 300,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.inputBg,
      paddingHorizontal: 14,
      paddingVertical: 14,
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
