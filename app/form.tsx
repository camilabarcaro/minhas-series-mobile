import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { runMigrations } from '../src/database/database';
import {
  createSerie,
  getSerieById,
  updateSerie,
} from '../src/database/serieRepository';
import type { Serie } from '../src/types/serie';

export default function FormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = Array.isArray(id) ? id[0] : id;
  const isEditing = Boolean(serieId);

  const [serie, setSerie] = useState<Serie | null>(null);
  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(isEditing);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!serieId) {
      return;
    }

    const carregarSerie = async () => {
      try {
        await runMigrations();
        const serieEncontrada = await getSerieById(Number(serieId));

        if (!serieEncontrada) {
          Alert.alert('Série não encontrada', 'Não foi possível carregar esta série.');
          router.back();
          return;
        }

        setSerie(serieEncontrada);
        setTitulo(serieEncontrada.titulo);
        setPlataforma(serieEncontrada.plataforma);
        setTemporadas(String(serieEncontrada.temporadas));
        setNota(serieEncontrada.nota);
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar a série.');
        router.back();
      } finally {
        setCarregando(false);
      }
    };

    carregarSerie();
  }, [router, serieId]);

  const salvar = async () => {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadasNumero = Number(temporadas);

    if (!tituloLimpo || !plataformaLimpa) {
      Alert.alert('Campos obrigatórios', 'Preencha o título e a plataforma.');
      return;
    }

    if (
      !temporadas.trim() ||
      !Number.isFinite(temporadasNumero) ||
      temporadasNumero < 0
    ) {
      Alert.alert('Temporadas inválidas', 'Informe um número de temporadas maior ou igual a zero.');
      return;
    }

    setSalvando(true);

    try {
      await runMigrations();

      if (serie) {
        await updateSerie(serie.id, {
          titulo: tituloLimpo,
          plataforma: plataformaLimpa,
          temporadas: temporadasNumero,
          episodios: serie.episodios,
          nota,
          concluida: serie.concluida,
        });
      } else {
        await createSerie({
          titulo: tituloLimpo,
          plataforma: plataformaLimpa,
          temporadas: temporadasNumero,
          episodios: 0,
          nota,
        });
      }

      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a série.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <Text className="text-base text-slate-500">Carregando série...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-5 rounded-2xl bg-white p-5">
        <View>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Título</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex.: Ruptura"
            placeholderTextColor="#94a3b8"
            className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Plataforma</Text>
          <TextInput
            value={plataforma}
            onChangeText={setPlataforma}
            placeholder="Ex.: Apple TV+"
            placeholderTextColor="#94a3b8"
            className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Temporadas</Text>
          <TextInput
            value={temporadas}
            onChangeText={setTemporadas}
            placeholder="0"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Nota</Text>
          <View className="flex-row justify-between">
            {[1, 2, 3, 4, 5].map((valor) => {
              const selecionada = nota === valor;

              return (
                <Pressable
                  key={valor}
                  onPress={() => setNota(selecionada ? null : valor)}
                  className={`h-12 w-12 items-center justify-center rounded-xl ${
                    selecionada ? 'bg-amber-400' : 'bg-slate-100'
                  }`}
                >
                  <Text className={`text-base ${selecionada ? 'text-white' : 'text-slate-500'}`}>
                    ★ {valor}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={salvar}
          disabled={salvando}
          className={`items-center rounded-xl py-4 ${salvando ? 'bg-slate-300' : 'bg-rose-500'}`}
        >
          <Text className="text-base font-bold text-white">
            {salvando ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar série'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
