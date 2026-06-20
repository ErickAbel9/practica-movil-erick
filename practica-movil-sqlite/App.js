import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addTarea,
  deleteTarea,
  getSqliteVersion,
  getTareas,
  toggleTarea,
} from "./src/db";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState("");

  const cargar = useCallback(async () => {
    setTareas(await getTareas());
  }, []);

  useEffect(() => {
    (async () => {
      await cargar();
      setVersion(await getSqliteVersion());
      setCargando(false);
    })();
  }, [cargar]);

  const onAgregar = async () => {
    const titulo = texto.trim();
    if (!titulo) return;
    setTexto("");
    setTareas(await addTarea(titulo));
  };

  const onToggle = async (item) =>
    setTareas(await toggleTarea(item.id, !item.hecha));

  const onEliminar = async (item) =>
    setTareas(await deleteTarea(item.id));

  if (cargando) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>
          Cargando base de datos SQLite...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.phoneFrame}>
        <Text style={styles.titulo}>Tareas de Erick</Text>

        <Text style={styles.subtitulo}>
          SQLite v{version} · {tareas.length} tarea(s)
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Escribe una nueva tarea..."
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={onAgregar}
          />

          <TouchableOpacity
            style={styles.boton}
            onPress={onAgregar}
          >
            <Text style={styles.botonTexto}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tareas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.vacio}>
              No hay tareas todavía. Agrega la primera.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tareaRow}>
              <TouchableOpacity
                style={styles.checkArea}
                onPress={() => onToggle(item)}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.hecha ? styles.checkboxOn : null,
                  ]}
                />

                <Text
                  style={[
                    styles.tareaTexto,
                    item.hecha
                      ? styles.tareaTextoHecha
                      : null,
                  ]}
                >
                  {item.titulo}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onEliminar(item)}
              >
                <Text style={styles.eliminar}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? 40 : 0,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 12,
    fontSize: 16,
  },

  phoneFrame: {
    width: "100%",
    maxWidth: 420,
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: Platform.OS === "web" ? 28 : 0,
    padding: 22,
    paddingTop: 30,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#15803D",
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },

  boton: {
    backgroundColor: "#16A34A",
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  vacio: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 24,
    fontSize: 15,
  },

  tareaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  checkArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#94A3B8",
    marginRight: 12,
  },

  checkboxOn: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  tareaTexto: {
    fontSize: 15,
    color: "#1E293B",
    flexShrink: 1,
  },

  tareaTextoHecha: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },

  eliminar: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 12,
  },
});